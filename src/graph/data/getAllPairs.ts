import { ApolloClient, NormalizedCacheObject } from '@apollo/client';

import { ALL_PAIRS } from '../queries';

type AllPairsResponse = {
  id: string;
  token0: {
    id: string;
    symbol: string;
    name: string;
  };
  token1: {
    id: string;
    symbol: string;
    name: string;
  };
};

const PAIRS_TO_FETCH = 500;

/**
 * Loop through every pair on uniswap, used for search
 */
export default async function getAllPairs(dataClient: ApolloClient<NormalizedCacheObject>) {
  try {
    let allFound = false;
    let pairs: AllPairsResponse[] = [];
    let skipCount = 0;
    while (!allFound) {
      const result = await dataClient.query({
        query: ALL_PAIRS,
        variables: {
          skip: skipCount,
        },
        fetchPolicy: 'network-only',
      });
      skipCount = skipCount + PAIRS_TO_FETCH;
      pairs = pairs.concat(result?.data?.pairs);
      if (result?.data?.pairs.length < PAIRS_TO_FETCH || pairs.length > PAIRS_TO_FETCH) {
        allFound = true;
      }
    }
    return pairs;
  } catch (e) {
    console.log(e);
  }
}
