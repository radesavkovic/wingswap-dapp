import { useMemo } from 'react';

import { selectors } from '../reducers';
import { useAppSelector } from '../reducers/hooks';
import useActiveWeb3React from './useActiveWeb3React';

export default function useAllTransactions() {
  const { chainId } = useActiveWeb3React();
  const transactions = useAppSelector(selectors.transaction.selectTransactions);

  return useMemo(() => {
    return transactions[chainId ?? -1];
  }, [chainId, transactions]);
}
