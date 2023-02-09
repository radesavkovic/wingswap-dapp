import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import dayjs from 'dayjs';

import { TOKEN_DATA, TOKEN_TOP_DAY_DATAS, TOKENS_HISTORICAL_BULK } from '../queries';
import { EthPrice } from '../reducers/types';
import { getBlockFromTimestamp } from './getBlocks';
import parseTokenData from './parse/token';

export default async function getTopTokens(
  prices: EthPrice,
  blockClient: ApolloClient<NormalizedCacheObject>,
  dataClient: ApolloClient<NormalizedCacheObject>,
) {
  const { currentDayEthPrice: ethPrice, lastDayEthPrice: oldEthPrice } = prices;

  const utcCurrentTime = dayjs();
  const utcOneDayBack = utcCurrentTime.subtract(1, 'day').unix();
  const utcTwoDaysBack = utcCurrentTime.subtract(2, 'day').unix();

  try {
    const oneDayBlock = await getBlockFromTimestamp(utcOneDayBack, blockClient);
    const twoDayBlock = await getBlockFromTimestamp(utcTwoDaysBack, blockClient);

    // need to get the top tokens by liquidity by need token day datas
    const currentDate = parseInt((dayjs().unix() / 86400 / 1000) as any) * 86400 - 86400;

    const tokenIds = await dataClient.query({
      query: TOKEN_TOP_DAY_DATAS,
      fetchPolicy: 'network-only',
      variables: { date: currentDate },
    });

    const ids = tokenIds?.data?.tokenDayDatas?.reduce((accum, entry) => {
      accum.push(entry.id.slice(0, 42));
      return accum;
    }, []);

    const currentResult = await dataClient.query({
      query: TOKENS_HISTORICAL_BULK(ids),
      fetchPolicy: 'network-only',
    });

    const oneDayResult = await dataClient.query({
      query: TOKENS_HISTORICAL_BULK(ids, oneDayBlock),
      fetchPolicy: 'network-only',
    });

    const twoDayResult = await dataClient.query({
      query: TOKENS_HISTORICAL_BULK(ids, twoDayBlock),
      fetchPolicy: 'network-only',
    });

    const currentData = currentResult?.data?.tokens;

    const oneDayData = oneDayResult?.data?.tokens.reduce((obj, cur, i) => {
      return { ...obj, [cur.id]: cur };
    }, {});

    const twoDayData = twoDayResult?.data?.tokens.reduce((obj, cur, i) => {
      return { ...obj, [cur.id]: cur };
    }, {});

    const bulkResults =
      !currentData || !oneDayData || !twoDayData
        ? await Promise.resolve([])
        : await Promise.all(
            currentData.map(async (data) => {
              let oneDayHistory = oneDayData[data.id];
              let twoDayHistory = twoDayData[data.id];

              // catch the case where token wasnt in top list in previous days
              if (!oneDayHistory) {
                const oneDayResult = await dataClient.query({
                  query: TOKEN_DATA(data.id, oneDayBlock),
                  fetchPolicy: 'network-only',
                });
                oneDayHistory = oneDayResult.data.tokens[0];
              }

              if (!twoDayHistory) {
                const twoDayResult = await dataClient.query({
                  query: TOKEN_DATA(data.id, twoDayBlock),
                  fetchPolicy: 'network-only',
                });
                twoDayHistory = twoDayResult.data.tokens[0];
              }

              return parseTokenData(data, oneDayHistory, twoDayHistory, ethPrice, oldEthPrice);
            }),
          );

    return bulkResults;
  } catch (e) {
    console.log(e);
    return [];
  }
}
