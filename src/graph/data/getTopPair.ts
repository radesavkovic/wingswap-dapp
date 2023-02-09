import { ApolloClient, NormalizedCacheObject } from '@apollo/client';

import { PAIRS_CURRENT } from '../queries';
import { EthPrice } from '../reducers/types';
import { getBulkPairData } from './getBulkPairData';

export default async function getTopPairs(
  prices: EthPrice,
  blockClient: ApolloClient<NormalizedCacheObject>,
  dataClient: ApolloClient<NormalizedCacheObject>,
) {
  try {
    const result = await dataClient.query({
      query: PAIRS_CURRENT,
      fetchPolicy: 'network-only',
    });

    // format as array of addresses
    const pairList = result?.data?.pairs.map((pair) => pair.id);

    return getBulkPairData(pairList, prices, blockClient, dataClient);
  } catch (e) {
    console.log(e);
    return [];
  }
}
