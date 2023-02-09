import { ApolloClient, NormalizedCacheObject } from '@apollo/client';

import { PAIR_DATA, PAIRS_BULK, PAIRS_HISTORICAL_BULK } from '../queries';
import { EthPrice } from '../reducers/types';
import { getTimestampsForChanges } from '../utils/timestamps';
import { getBlocksFromTimestamps } from './getBlocks';
import { parsePairData } from './parse/pair';

export async function getBulkPairData(
  addresses: string[],
  prices: EthPrice,
  blockClient: ApolloClient<NormalizedCacheObject>,
  dataClient: ApolloClient<NormalizedCacheObject>,
) {
  const { currentDayEthPrice: ethPrice } = prices;
  const [t1, t2, tWeek] = getTimestampsForChanges();

  try {
    // get data for every pair in list
    const [{ number: b1 }, { number: b2 }, { number: bWeek }] = await getBlocksFromTimestamps(
      [t1, t2, tWeek],
      blockClient,
    );

    const currentResult = await dataClient.query({
      query: PAIRS_BULK,
      variables: {
        allPairs: addresses,
      },
      fetchPolicy: 'cache-first',
    });

    const [oneDayResult, twoDayResult, oneWeekResult] = await Promise.all(
      [b1, b2, bWeek].map(async (block) => {
        const result = dataClient.query({
          query: PAIRS_HISTORICAL_BULK(block, addresses),
          fetchPolicy: 'cache-first',
        });
        return result;
      }),
    );

    const currentData = currentResult?.data?.pairs;

    const oneDayData = oneDayResult?.data?.pairs.reduce((obj, cur, i) => {
      return { ...obj, [cur.id]: cur };
    }, {});

    const twoDayData = twoDayResult?.data?.pairs.reduce((obj, cur, i) => {
      return { ...obj, [cur.id]: cur };
    }, {});

    const oneWeekData = oneWeekResult?.data?.pairs.reduce((obj, cur, i) => {
      return { ...obj, [cur.id]: cur };
    }, {});

    const bulkResults =
      !currentData || !oneDayData || !twoDayData || !oneWeekData
        ? await Promise.resolve([])
        : await Promise.all(
            currentData.map(async (pair) => {
              let oneDayHistory = oneDayData?.[pair.id];
              if (!oneDayHistory) {
                const newData = await dataClient.query({
                  query: PAIR_DATA(pair.id, b1),
                  fetchPolicy: 'cache-first',
                });
                oneDayHistory = newData.data.pairs[0];
              }
              let twoDayHistory = twoDayData?.[pair.id];
              if (!twoDayHistory) {
                const newData = await dataClient.query({
                  query: PAIR_DATA(pair.id, b2),
                  fetchPolicy: 'cache-first',
                });
                twoDayHistory = newData.data.pairs[0];
              }
              let oneWeekHistory = oneWeekData?.[pair.id];
              if (!oneWeekHistory) {
                const newData = await dataClient.query({
                  query: PAIR_DATA(pair.id, bWeek),
                  fetchPolicy: 'cache-first',
                });
                oneWeekHistory = newData.data.pairs[0];
              }
              return parsePairData(pair, oneDayHistory, twoDayHistory, oneWeekHistory, ethPrice, b1);
            }),
          );

    return bulkResults;
  } catch (e) {
    console.log(e);
    return [];
  }
}
