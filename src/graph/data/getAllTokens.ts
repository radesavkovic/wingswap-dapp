import { ApolloClient, NormalizedCacheObject } from '@apollo/client';

import { ALL_TOKENS } from '../queries';

type AllTokensResponse = {
  id: string;
  name: string;
  symbol: string;
  totalLiquidity: string;
};

const TOKENS_TO_FETCH = 500;

/**
 * Loop through every token on uniswap, used for search
 */
export default async function getAllTokens(dataClient: ApolloClient<NormalizedCacheObject>) {
  try {
    let allFound = false;
    let skipCount = 0;
    let tokens: AllTokensResponse[] = [];
    while (!allFound) {
      const result = await dataClient.query({
        query: ALL_TOKENS,
        variables: {
          skip: skipCount,
        },
        fetchPolicy: 'network-only',
      });
      tokens = tokens.concat(result?.data?.tokens);
      if (result?.data?.tokens?.length < TOKENS_TO_FETCH || tokens.length > TOKENS_TO_FETCH) {
        allFound = true;
      }
      skipCount = skipCount += TOKENS_TO_FETCH;
    }
    return tokens;
  } catch (e) {
    console.log(e);
  }
}
