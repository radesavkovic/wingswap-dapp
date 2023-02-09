import { ApolloClient, NormalizedCacheObject } from '@apollo/client';

import { FILTERED_TRANSACTIONS } from '../queries';
import { Transaction } from './../reducers/types';

export default async function getTokenTransactions(
  allPairsFormatted: string[],
  dataClient: ApolloClient<NormalizedCacheObject>,
): Promise<Transaction | undefined> {
  if (!allPairsFormatted.length) {
    return;
  }
  try {
    const result = await dataClient.query<Transaction>({
      query: FILTERED_TRANSACTIONS,
      variables: {
        allPairs: allPairsFormatted,
      },
      fetchPolicy: 'cache-first',
    });

    return result.data;
  } catch (e) {
    console.log(e);
  }
}
