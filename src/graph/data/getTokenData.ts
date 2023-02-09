import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import dayjs from 'dayjs';

import { TOKEN_DATA } from '../queries';
import { EthPrice } from '../reducers/types';
import { getBlockFromTimestamp } from './getBlocks';
import parseTokenData from './parse/token';

export async function getTokenData(
  address: string,
  prices: EthPrice,
  blockClient: ApolloClient<NormalizedCacheObject>,
  dataClient: ApolloClient<NormalizedCacheObject>,
) {
  const { currentDayEthPrice: ethPrice, lastDayEthPrice: oldEthPrice } = prices;

  const utcCurrentTime = dayjs();
  const utcOneDayBack = utcCurrentTime.subtract(1, 'day').startOf('minute').unix();
  const utcTwoDaysBack = utcCurrentTime.subtract(2, 'day').startOf('minute').unix();

  try {
    const oneDayBlock = await getBlockFromTimestamp(utcOneDayBack, blockClient);
    const twoDayBlock = await getBlockFromTimestamp(utcTwoDaysBack, blockClient);

    // fetch all current and historical data
    const result = await dataClient.query({
      query: TOKEN_DATA(address),
      fetchPolicy: 'cache-first',
    });
    const data = result?.data?.tokens?.[0];

    // get results from 24 hours in past
    const oneDayResult = await dataClient.query({
      query: TOKEN_DATA(address, oneDayBlock),
      fetchPolicy: 'cache-first',
    });
    let oneDayHistory = oneDayResult.data.tokens[0];

    // get results from 48 hours in past
    const twoDayResult = await dataClient.query({
      query: TOKEN_DATA(address, twoDayBlock),
      fetchPolicy: 'cache-first',
    });
    let twoDayHistory = twoDayResult.data.tokens[0];

    // catch the case where token wasnt in top list in previous days
    if (!oneDayHistory) {
      const oneDayResult = await dataClient.query({
        query: TOKEN_DATA(address, oneDayBlock),
        fetchPolicy: 'cache-first',
      });
      oneDayHistory = oneDayResult.data.tokens[0];
    }
    if (!twoDayHistory) {
      const twoDayResult = await dataClient.query({
        query: TOKEN_DATA(address, twoDayBlock),
        fetchPolicy: 'cache-first',
      });
      twoDayHistory = twoDayResult.data.tokens[0];
    }

    return parseTokenData(data, oneDayHistory, twoDayHistory, ethPrice, oldEthPrice);
  } catch (e) {
    console.log(e);
    return undefined;
  }
}
