import { isAddress } from '@ethersproject/address';
import { useEffect, useMemo } from 'react';

import useActiveWeb3React from '../../hooks/useActiveWeb3React';
import graphs from '..';
import { getTokenData } from '../data/getTokenData';
import { TokenData } from '../reducers/types';
import { useClients } from './useClients';
import useEthPrice from './useEthPrice';

export default function useTokenData(addresses: string[]) {
  const { chainId } = useActiveWeb3React();
  const { blockClient, dataClient } = useClients();

  const prices = useEthPrice();

  const dispatch = graphs.useDispatch();
  const tokenMap = graphs.useSelector((state) => state.token.ofChain[chainId ?? -1].byAddress);
  const tokenData = useMemo(() => {
    return addresses
      .filter((address) => isAddress(address))
      .reduce<TokenData[]>((memo, address) => {
        if (tokenMap[address]) return [...memo, tokenMap[address]];
        return memo;
      }, []);
  }, [addresses, tokenMap]);
  const unfetchedAddresses = useMemo(() => {
    return addresses.filter((address) => isAddress(address)).filter((address) => !tokenMap[address]);
  }, [addresses, tokenMap]);

  useEffect(() => {
    async function fetch() {
      if (!chainId || !prices) return;
      for (const address of unfetchedAddresses) {
        const data = await getTokenData(address, prices, blockClient!, dataClient!);
        data && dispatch(graphs.actions.token.updateToken({ token: data, chainId }));
      }
    }

    if (blockClient && dataClient && unfetchedAddresses.length > 0) {
      fetch();
    }
  }, [blockClient, chainId, dataClient, dispatch, prices, unfetchedAddresses]);

  return tokenData;
}
