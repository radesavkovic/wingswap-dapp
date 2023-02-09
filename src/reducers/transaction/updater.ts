import { useCallback, useEffect, useMemo } from 'react';

import { retry, RetryableError, RetryOptions } from '../../functions/retry';
import useActiveWeb3React from '../../hooks/useActiveWeb3React';
import useLatestBlockNumber from '../../hooks/useLatestBlockNumber';
import { actions, selectors } from '..';
import { useAppDispatch, useAppSelector } from '../hooks';

interface TxInterface {
  addedTime: number;
  receipt?: Record<string, any>;
  lastCheckedBlockNumber?: number;
}

export function shouldCheck(lastBlockNumber: number, tx: TxInterface): boolean {
  if (tx.receipt) return false;
  if (!tx.lastCheckedBlockNumber) return true;
  const blocksSinceCheck = lastBlockNumber - tx.lastCheckedBlockNumber;
  if (blocksSinceCheck < 1) return false;
  const minutesPending = (new Date().getTime() - tx.addedTime) / 1000 / 60;
  if (minutesPending > 60) {
    // every 10 blocks if pending for longer than an hour
    return blocksSinceCheck > 9;
  } else if (minutesPending > 5) {
    // every 3 blocks if pending more than 5 minutes
    return blocksSinceCheck > 2;
  } else {
    // otherwise every block
    return true;
  }
}

const RETRY_OPTIONS_BY_CHAIN_ID: { [chainId: number]: RetryOptions } = {};

const DEFAULT_RETRY_OPTIONS: RetryOptions = { n: 3, minWait: 1000, maxWait: 3000 };

export default function Updater(): null {
  const { chainId, library } = useActiveWeb3React();

  const lastBlockNumber = useLatestBlockNumber();

  const dispatch = useAppDispatch();
  const txs = useAppSelector(selectors.transaction.selectTransactions);

  const transactions = useMemo(() => (chainId ? txs[chainId] ?? {} : {}), [chainId, txs]);

  const getReceipt = useCallback(
    (hash: string) => {
      if (!library || !chainId) throw new Error('No library or chainId');
      const retryOptions = RETRY_OPTIONS_BY_CHAIN_ID[chainId] ?? DEFAULT_RETRY_OPTIONS;
      return retry(
        () =>
          library.getTransactionReceipt(hash).then((receipt) => {
            console.log('got receipt', receipt);
            console.log('txs', hash);
            if (receipt === null) {
              console.debug('Retrying for hash', hash);
              throw new RetryableError();
            }
            return receipt;
          }),
        retryOptions,
      );
    },
    [chainId, library],
  );

  useEffect(() => {
    if (!chainId || !library || !lastBlockNumber) return;

    const cancels = Object.keys(transactions)
      .filter((hash) => shouldCheck(lastBlockNumber, transactions[hash]))
      .map((hash) => {
        const { promise, cancel } = getReceipt(hash);
        promise
          .then((receipt) => {
            if (receipt) {
              dispatch(
                actions.transaction.finalizeTransaction({
                  chainId,
                  hash,
                  receipt: {
                    blockHash: receipt.blockHash,
                    blockNumber: receipt.blockNumber,
                    contractAddress: receipt.contractAddress,
                    from: receipt.from,
                    status: receipt.status,
                    to: receipt.to,
                    transactionHash: receipt.transactionHash,
                    transactionIndex: receipt.transactionIndex,
                  },
                }),
              );

              // the receipt was fetched before the block, fast forward to that block to trigger balance updates
              if (receipt.blockNumber > lastBlockNumber) {
                dispatch(actions.application.updateBlockNumber({ chainId, blockNumber: receipt.blockNumber }));
              }
            } else {
              dispatch(actions.transaction.checkedTransaction({ chainId, hash, blockNumber: lastBlockNumber }));
            }
          })
          .catch((error) => {
            if (!error.isCancelledError) {
              console.error(`Failed to check transaction hash: ${hash}`, error);
            }
          });
        return cancel;
      });

    return () => {
      cancels.forEach((cancel) => cancel());
    };
  }, [chainId, library, transactions, lastBlockNumber, dispatch, getReceipt]);

  return null;
}
