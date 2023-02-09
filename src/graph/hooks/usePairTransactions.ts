import { useEffect, useState } from 'react';

import getPairTransactions from '../data/getPairTransactions';
import { Transaction } from './../reducers/types';
import { useClients } from './useClients';

export default function usePairTransactions(pairAddress: string) {
  const { dataClient } = useClients();
  const [transaction, setTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    async function getData() {
      if (!dataClient) {
        return;
      }
      const data = await getPairTransactions(pairAddress, dataClient);
      if (data) {
        setTransaction(data);
      }
    }
    getData();
  }, [dataClient, pairAddress]);

  return transaction;
}
