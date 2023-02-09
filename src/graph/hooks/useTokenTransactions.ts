import { useEffect, useState } from 'react';

import getTokenTransactions from '../data/getTokenTransactions';
import { Transaction } from './../reducers/types';
import { useClients } from './useClients';
import useTokenPairs from './useTokenPairs';

export default function useTokenTransactions(address: string) {
  const { dataClient } = useClients();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const pairs = useTokenPairs(address);

  useEffect(() => {
    async function getData() {
      if (!dataClient) {
        return;
      }
      const data = await getTokenTransactions(
        pairs.map((p) => p.id),
        dataClient,
      );
      if (data) {
        setTransaction(data);
      }
    }
    getData();
  }, [dataClient, pairs]);

  return transaction;
}
