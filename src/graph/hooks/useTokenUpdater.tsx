import { useEffect } from 'react';

import useActiveWeb3React from '../../hooks/useActiveWeb3React';
import graphs from '..';
import getTopTokens from '../data/getTopTokens';
import { useClients } from '../hooks/useClients';
import useEthPrice from '../hooks/useEthPrice';

export default function useTokenUpdater() {
  const { chainId } = useActiveWeb3React();
  const { blockClient, dataClient } = useClients();

  const dispatch = graphs.useDispatch();

  const prices = useEthPrice();

  useEffect(() => {
    async function fetch() {
      const topTokens = await getTopTokens(prices, blockClient!, dataClient!);
      topTokens &&
        dispatch(graphs.actions.token.updateTopTokens({ topTokens: topTokens as any, chainId: chainId ?? -1 }));
    }

    if (blockClient && dataClient && Object.keys(prices).length > 0) {
      fetch();
    }
  }, [blockClient, chainId, dataClient, dispatch, prices]);
}
