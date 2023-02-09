import { useCallback } from 'react';

import { actions } from '../reducers';
import { useAppDispatch } from '../reducers/hooks';
import useActiveWeb3React from './useActiveWeb3React';

type TransactionResponseLight = {
  hash: string;
};

// helper that can take a ethers library transaction response and add it to the list of transactions
export default function useTransactionAdder(): (
  response: TransactionResponseLight,
  customData?: {
    summary?: string;
    approval?: { tokenAddress: string; spender: string };
    claim?: { recipient: string };
  },
) => void {
  const { chainId, account } = useActiveWeb3React();
  const dispatch = useAppDispatch();

  return useCallback(
    (
      response: TransactionResponseLight,
      {
        summary,
        approval,
        claim,
      }: {
        summary?: string;
        claim?: { recipient: string };
        approval?: { tokenAddress: string; spender: string };
      } = {},
    ) => {
      if (!account || !chainId) return;

      const { hash } = response;
      if (!hash) {
        throw Error('No transaction hash found.');
      }

      dispatch(
        actions.transaction.addTransaction({
          hash,
          from: account,
          chainId,
          approval,
          summary,
          claim,
        }),
      );
    },
    [dispatch, chainId, account],
  );
}
