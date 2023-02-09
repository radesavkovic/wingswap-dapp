import { ApolloClient, NormalizedCacheObject } from '@apollo/client';

import { FILTERED_TRANSACTIONS } from '../queries';
import { Transaction } from './../reducers/types';

export default async function getPairTransactions(
  pairAddress: string,
  dataClient: ApolloClient<NormalizedCacheObject>,
): Promise<Transaction | undefined> {
  try {
    const result = await dataClient.query<Transaction>({
      query: FILTERED_TRANSACTIONS,
      variables: {
        allPairs: [pairAddress],
      },
      fetchPolicy: 'cache-first',
    });

    return result.data;
  } catch (e) {
    console.log(e);
  }
}
