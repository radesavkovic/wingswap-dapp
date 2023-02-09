import { useEffect } from 'react';

import useAppChainId from '../../hooks/useAppChainId';
import graphs from '..';
import getAllPairs from '../data/getAllPairs';
import getAllTokens from '../data/getAllTokens';
import getGlobalData from '../data/getGlobalData';
import getGlobalTransactions from '../data/getGlobalTransactions';
import { useClients } from './useClients';
import useEthPrice from './useEthPrice';

export default function useGlobalUpdater() {
  const appChainId = useAppChainId();
  const { blockClient, dataClient } = useClients();

  const dispatch = graphs.useDispatch();

  const prices = useEthPrice();

  useEffect(() => {
    async function fetch() {
      const globalData = await getGlobalData(
        appChainId,
        prices.currentDayEthPrice,
        prices.lastDayEthPrice,
        blockClient!,
        dataClient!,
      );
      globalData && dispatch(graphs.actions.global.updateGlobalData({ factoryData: globalData, chainId: appChainId }));

      const allPairs = await getAllPairs(dataClient!);
      allPairs && dispatch(graphs.actions.global.updateAllPairs({ allPairs, chainId: appChainId }));

      const allTokens = await getAllTokens(dataClient!);
      allTokens && dispatch(graphs.actions.global.updateAllTokens({ allTokens, chainId: appChainId }));

      const txns = await getGlobalTransactions(dataClient!);
      txns && dispatch(graphs.actions.global.updateTransactions({ transactions: txns, chainId: appChainId }));
    }

    if (blockClient && dataClient && Object.keys(prices).length > 0) {
      fetch();
    }
  }, [appChainId, blockClient, dataClient, dispatch, prices]);
}
