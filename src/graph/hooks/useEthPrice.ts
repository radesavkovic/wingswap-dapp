import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

import useActiveWeb3React from '../../hooks/useActiveWeb3React';
import graphs from '..';
import { getBlockFromTimestamp } from '../data/getBlocks';
import { ETH_PRICE } from '../queries';
import { EthPrice } from '../reducers/types';
import { getPercentChange } from '../utils/percents';
import { useClients } from './useClients';

/**
 * 
 * Gets the current price  of ETH, 24 hour price, and % change between them
 */
export default function useEthPrice() {
  const [fetchError, setFetchError] = useState(false);

  const { chainId } = useActiveWeb3React();

  const { dataClient, blockClient } = useClients();

  const dispatch = graphs.useDispatch();
  const ethPrice = graphs.useSelector((state) => state.global.ofChain[chainId ?? -1].ethPrice);

  useEffect(() => {
    async function fetch() {
      const utcCurrentTime = dayjs();
      const utcOneDayBack = utcCurrentTime.subtract(1, 'day').startOf('minute').unix();
      const oneDayBlock = await getBlockFromTimestamp(utcOneDayBack, blockClient!);
      console.log('oneDayBlock', oneDayBlock);
      const { data: result, error } = await dataClient!.query({
        query: ETH_PRICE(),
        fetchPolicy: 'cache-first',
      });
       
      const { data: resultOneDay, error: errorOneDay } = await dataClient!.query({
        query: ETH_PRICE(oneDayBlock),
        fetchPolicy: 'cache-first',
      });

      const currentDayEthPrice = result?.bundles[0]?.ethPrice;
      const lastDayEthPrice = resultOneDay?.bundles[0]?.ethPrice;

      if (error || errorOneDay) {
        setFetchError(true);
      } else {
        dispatch(
          graphs.actions.global.updateEthPrice({
            ethPrice: {
              currentDayEthPrice,
              lastDayEthPrice,
              ethPriceChange: getPercentChange(currentDayEthPrice, lastDayEthPrice),
            },
            chainId: chainId ?? -1,
          }),
        );
      }
    }

    if (blockClient && dataClient && !ethPrice && !fetchError) {
      fetch();
    }
  }, [blockClient, chainId, dataClient, dispatch, ethPrice, fetchError]);

  return ethPrice ?? ({} as EthPrice);
}
