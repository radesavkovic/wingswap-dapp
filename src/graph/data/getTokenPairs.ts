import { ApolloClient, NormalizedCacheObject } from '@apollo/client';

import { TOKEN_DATA } from '../queries';

export default async function getTokenPairs(
  tokenAddress: string,
  dataClient: ApolloClient<NormalizedCacheObject>,
): Promise<{ id: string }[] | undefined> {
  try {
    // fetch all current and historical data
    const result = await dataClient.query({
      query: TOKEN_DATA(tokenAddress),
      fetchPolicy: 'cache-first',
    });
    return result.data?.['pairs0'].concat(result.data?.['pairs1']);
  } catch (e) {
    console.log(e);
  }
}
