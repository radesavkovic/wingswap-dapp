import { isAddress } from '@ethersproject/address';
import { useEffect, useState } from 'react';

import getTokenPairs from '../data/getTokenPairs';
import { useClients } from './useClients';

export default function useTokenPairs(tokenAddress: string) {
  const { dataClient } = useClients();
  const [pairs, setPairs] = useState<{ id: string }[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (!dataClient) {
        return;
      }
      const allPairs = await getTokenPairs(tokenAddress, dataClient);
      if (allPairs) {
        setPairs(allPairs);
      }
    }
    if (isAddress(tokenAddress)) {
      fetchData();
    }
  }, [dataClient, tokenAddress]);

  return pairs || [];
}
