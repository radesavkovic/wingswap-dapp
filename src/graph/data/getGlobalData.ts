import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { FACTORY_ADDRESS } from '@wingsswap/sdk';
import dayjs from 'dayjs';

import { GLOBAL_DATA } from '../queries';
import { FactoryData } from '../reducers/types';
import { get2DayPercentChange, getPercentChange } from '../utils/percents';
import { getBlocksFromTimestamps } from './getBlocks';

type GlobalDataResponse = {
  id: string;
  pairCount: number;
  totalVolumeUSD: string;
  totalVolumeETH: string;
  totalLiquidityUSD: string;
  totalLiquidityETH: string;
  txCount: string;
  untrackedVolumeUSD: string;
};

/**
 * Gets all the global data for the overview page.
 * Needs current eth price and the old eth price to get
 * 24 hour USD changes.
 * @param {*} ethPrice
 * @param {*} oldEthPrice
 */
export default async function getGlobalData(
  chainId: number,
  ethPrice: number,
  oldEthPrice: number,
  blockClient: ApolloClient<NormalizedCacheObject>,
  dataClient: ApolloClient<NormalizedCacheObject>,
) {
  let response: FactoryData | undefined;

  try {
    // get timestamps for the days
    const utcCurrentTime = dayjs();
    const utcOneDayBack = utcCurrentTime.subtract(1, 'day').unix();
    const utcTwoDaysBack = utcCurrentTime.subtract(2, 'day').unix();
    const utcOneWeekBack = utcCurrentTime.subtract(1, 'week').unix();
    const utcTwoWeeksBack = utcCurrentTime.subtract(2, 'week').unix();

    // get the blocks needed for time travel queries
    const [oneDayBlock, twoDayBlock, oneWeekBlock, twoWeekBlock] = await getBlocksFromTimestamps(
      [utcOneDayBack, utcTwoDaysBack, utcOneWeekBack, utcTwoWeeksBack],
      blockClient,
    );

    // fetch the global data
    const result = await dataClient.query({
      query: GLOBAL_DATA(FACTORY_ADDRESS[chainId]),
      fetchPolicy: 'cache-first',
    });
    const data: GlobalDataResponse = result.data.uniswapFactories[0];

    // fetch the historical data
    const oneDayResult = await dataClient.query({
      query: GLOBAL_DATA(FACTORY_ADDRESS[chainId], oneDayBlock?.number),
      fetchPolicy: 'cache-first',
    });
    const oneDayData: GlobalDataResponse = oneDayResult.data.uniswapFactories[0];

    const twoDayResult = await dataClient.query({
      query: GLOBAL_DATA(FACTORY_ADDRESS[chainId], twoDayBlock?.number),
      fetchPolicy: 'cache-first',
    });
    const twoDayData: GlobalDataResponse = twoDayResult.data.uniswapFactories[0];

    const oneWeekResult = await dataClient.query({
      query: GLOBAL_DATA(FACTORY_ADDRESS[chainId], oneWeekBlock?.number),
      fetchPolicy: 'cache-first',
    });
    const oneWeekData = oneWeekResult.data.uniswapFactories[0];

    const twoWeekResult = await dataClient.query({
      query: GLOBAL_DATA(FACTORY_ADDRESS[chainId], twoWeekBlock?.number),
      fetchPolicy: 'cache-first',
    });
    const twoWeekData = twoWeekResult.data.uniswapFactories[0];

    if (data && oneDayData && twoDayData && oneWeekData && twoWeekData) {
      const [oneDayVolumeUSD, volumeChangeUSD] = get2DayPercentChange(
        data.totalVolumeUSD,
        oneDayData.totalVolumeUSD,
        twoDayData.totalVolumeUSD,
      );

      const [oneWeekVolume, weeklyVolumeChange] = get2DayPercentChange(
        data.totalVolumeUSD,
        oneWeekData.totalVolumeUSD,
        twoWeekData.totalVolumeUSD,
      );

      const [oneDayTxns, txnChange] = get2DayPercentChange(
        data.txCount,
        oneDayData.txCount ? oneDayData.txCount : 0,
        twoDayData.txCount ? twoDayData.txCount : 0,
      );

      // format the total liquidity in USD
      const liquidityChangeUSD = getPercentChange(
        parseFloat(data.totalLiquidityETH) * ethPrice,
        parseFloat(oneDayData.totalLiquidityETH) * oldEthPrice,
      );

      response = {
        pairCount: data.pairCount,
        totalVolumeUSD: data.totalVolumeUSD,
        totalVolumeETH: data.totalVolumeETH,
        txCount: data.txCount,
        untrackedVolumeUSD: data.untrackedVolumeUSD,
        totalLiquidityUSD: parseFloat(data.totalLiquidityETH) * ethPrice,
        totalLiquidityETH: parseFloat(data.totalLiquidityETH),

        // add relevant fields with the calculated amounts
        oneDayVolumeUSD: oneDayVolumeUSD,
        oneWeekVolume: oneWeekVolume,
        weeklyVolumeChange: weeklyVolumeChange,
        volumeChangeUSD: volumeChangeUSD,
        liquidityChangeUSD: liquidityChangeUSD,
        oneDayTxns: oneDayTxns,
        txnChange: txnChange,
      };
    }
  } catch (e) {
    console.log(e);
  }

  return response;
}
