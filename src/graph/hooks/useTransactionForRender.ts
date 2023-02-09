import { useEffect, useMemo, useState } from 'react';

import { Direction } from '../../components/buttons/header.button';
import { TRANSACTION_SORT_FIELD } from '../constants';
import { Transaction, TransactionRender, TransactionType } from '../reducers/types';
import updateNameData from '../utils/data';

function getFieldName(field: TRANSACTION_SORT_FIELD): keyof TransactionRender {
  switch (field) {
    case TRANSACTION_SORT_FIELD.TOTAL_VALUE:
      return 'amountUSD';
    case TRANSACTION_SORT_FIELD.TOKEN_AMOUNT_0:
      return 'token0Amount';
    case TRANSACTION_SORT_FIELD.TOKEN_AMOUNT_1:
      return 'token1Amount';
    default:
      return 'timestamp';
  }
}

export default function useTransactionForRender(
  data: Transaction | null,
  defaultFilter: TransactionType = TransactionType.ALL,
  defaultSorter: TRANSACTION_SORT_FIELD = TRANSACTION_SORT_FIELD.TIME,
) {
  const [transactions, setTransactions] = useState<TransactionRender[]>([]);
  const [filter, setFilter] = useState(defaultFilter);

  const [sortedColumn, setSortedColumn] = useState({
    field: defaultSorter,
    direction: Direction.DESC,
  });

  useEffect(() => {
    if (!data || !data.mints || !data.burns || !data.swaps) {
      return;
    }

    const transactions: TransactionRender[] = [];
    data.mints.forEach((mint) => {
      const newTxn: TransactionRender = {} as TransactionRender;
      newTxn.hash = mint.transaction.id;
      newTxn.timestamp = mint.transaction.timestamp;
      newTxn.type = TransactionType.ADD;
      newTxn.token0Amount = mint.amount0;
      newTxn.token1Amount = mint.amount1;
      newTxn.account = mint.to;
      newTxn.token0Symbol = updateNameData(mint.pair)!.token0!.symbol;
      newTxn.token1Symbol = updateNameData(mint.pair)!.token1!.symbol;
      newTxn.amountUSD = mint.amountUSD;
      transactions.push(newTxn);
    });

    data.burns.forEach((burn) => {
      const newTxn: TransactionRender = {} as TransactionRender;
      newTxn.hash = burn.transaction.id;
      newTxn.timestamp = burn.transaction.timestamp;
      newTxn.type = TransactionType.REMOVE;
      newTxn.token0Amount = burn.amount0;
      newTxn.token1Amount = burn.amount1;
      newTxn.account = burn.sender;
      newTxn.token0Symbol = updateNameData(burn.pair)!.token0!.symbol;
      newTxn.token1Symbol = updateNameData(burn.pair)!.token1!.symbol;
      newTxn.amountUSD = burn.amountUSD;
      transactions.push(newTxn);
    });

    data.swaps.forEach((swap) => {
      const netToken0 = Number(swap.amount0In) - Number(swap.amount0Out);
      const netToken1 = Number(swap.amount1In) - Number(swap.amount1Out);

      const newTxn: TransactionRender = {} as TransactionRender;

      if (netToken0 < 0) {
        newTxn.token0Symbol = updateNameData(swap.pair)!.token0!.symbol;
        newTxn.token1Symbol = updateNameData(swap.pair)!.token1!.symbol;
        newTxn.token0Amount = Math.abs(netToken0).toString();
        newTxn.token1Amount = Math.abs(netToken1).toString();
      } else if (netToken1 < 0) {
        newTxn.token0Symbol = updateNameData(swap.pair)!.token1!.symbol;
        newTxn.token1Symbol = updateNameData(swap.pair)!.token0!.symbol;
        newTxn.token0Amount = Math.abs(netToken1).toString();
        newTxn.token1Amount = Math.abs(netToken0).toString();
      }

      newTxn.hash = swap.transaction.id;
      newTxn.timestamp = swap.transaction.timestamp;
      newTxn.type = TransactionType.SWAP;

      newTxn.amountUSD = swap.amountUSD;
      newTxn.account = swap.to;
      transactions.push(newTxn);
    });

    setTransactions(transactions);
  }, [data]);

  const onChangeFilter = (filter: TransactionType) => {
    setFilter(filter);
  };

  const filteredData = useMemo(() => {
    let filteredTransactions = [...transactions];
    if (filter !== TransactionType.ALL) {
      filteredTransactions = transactions.filter((t) => t.type === filter);
    }

    filteredTransactions.sort((txn1, txn2) => {
      return sortedColumn.direction === Direction.ASC
        ? parseFloat(txn1[getFieldName(sortedColumn.field)] as any) -
            parseFloat(txn2[getFieldName(sortedColumn.field) as any])
        : parseFloat(txn2[getFieldName(sortedColumn.field)] as any) -
            parseFloat(txn1[getFieldName(sortedColumn.field) as any]);
    });

    return filteredTransactions;
  }, [filter, sortedColumn.direction, sortedColumn.field, transactions]);

  return {
    data: filteredData,
    filter,
    onChangeFilter,
    sortedColumn,
    onSort: (field: TRANSACTION_SORT_FIELD) => {
      setSortedColumn((v) => ({
        field,
        direction: v.field === field ? v.direction * -1 : v.direction,
      }));
    },
  };
}
