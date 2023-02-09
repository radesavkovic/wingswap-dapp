import { ApolloClient, NormalizedCacheObject } from '@apollo/client';

import { GLOBAL_TXNS } from '../queries';

/**
 * Get and format transactions for global page
 */
export default async function getGlobalTransactions(dataClient: ApolloClient<NormalizedCacheObject>) {
  const transactions = {} as any;

  try {
    const result = await dataClient.query({
      query: GLOBAL_TXNS,
      fetchPolicy: 'cache-first',
    });

    transactions.mints = [];
    transactions.burns = [];
    transactions.swaps = [];
    result?.data?.transactions &&
      result.data.transactions.map((transaction) => {
        if (transaction.mints.length > 0) {
          transaction.mints.map((mint) => {
            return transactions.mints.push(mint);
          });
        }
        if (transaction.burns.length > 0) {
          transaction.burns.map((burn) => {
            return transactions.burns.push(burn);
          });
        }
        if (transaction.swaps.length > 0) {
          transaction.swaps.map((swap) => {
            return transactions.swaps.push(swap);
          });
        }
        return true;
      });
  } catch (e) {
    console.log(e);
  }

  return transactions;
}
