import { isAddress } from '@ethersproject/address';
import { useEffect, useMemo } from 'react';

import useActiveWeb3React from '../../hooks/useActiveWeb3React';
import graphs from '..';
import { getBulkPairData } from '../data/getBulkPairData';
import { PairData } from '../reducers/types';
import { useClients } from './useClients';
import useEthPrice from './useEthPrice';

export default function usePairData(addresses: string[]) {
  const { chainId } = useActiveWeb3React();
  const { blockClient, dataClient } = useClients();

  const prices = useEthPrice();

  const dispatch = graphs.useDispatch();
  const pairnMap = graphs.useSelector((state) => state.pair.ofChain[chainId ?? -1].byAddress);
  const pairData = useMemo(() => {
    return addresses
      .filter((address) => isAddress(address))
      .reduce<PairData[]>((memo, address) => {
        if (pairnMap[address]) return [...memo, pairnMap[address]];
        return memo;
      }, []);
  }, [addresses, pairnMap]);
  const unfetchedAddresses = useMemo(() => {
    return addresses.filter((address) => isAddress(address)).filter((address) => !pairnMap[address]);
  }, [addresses, pairnMap]);

  useEffect(() => {
    async function fetch() {
      if (!chainId || !prices) return;
      for (const address of unfetchedAddresses) {
        const data = await getBulkPairData([address], prices, blockClient!, dataClient!);
        data && dispatch(graphs.actions.pair.updatePair({ pair: data[0] as any, chainId }));
      }
    }

    if (blockClient && dataClient && unfetchedAddresses.length > 0) {
      fetch();
    }
  }, [blockClient, chainId, dataClient, dispatch, prices, unfetchedAddresses]);

  return pairData;
}
