import { ApolloClient, NormalizedCacheObject } from '@apollo/client';

import { splitQuery } from '../../utils/queries';
import { GET_BLOCK, GET_BLOCKS } from '../queries';

/**
 * @notice Fetches first block after a given timestamp
 * @dev Query speed is optimized by limiting to a 600-second period
 * @param {Int} timestamp in seconds
 */
export async function getBlockFromTimestamp(timestamp: number, blockClient: ApolloClient<NormalizedCacheObject>) {
  const result = await blockClient.query({
    query: GET_BLOCK,
    variables: {
      timestampFrom: timestamp,
      timestampTo: timestamp + 600,
    },
    fetchPolicy: 'cache-first',
  });
  return result?.data?.blocks?.[0]?.number;
}

/**
 * @notice Fetches block objects for an array of timestamps.
 * @dev blocks are returned in chronological order (ASC) regardless of input.
 * @dev blocks are returned at string representations of Int
 * @dev timestamps are returns as they were provided; not the block time.
 * @param {Array} timestamps
 */
export async function getBlocksFromTimestamps(
  timestamps: number[],
  blockClient: ApolloClient<NormalizedCacheObject>,
  skipCount = 500,
) {
  if (timestamps?.length === 0) {
    return [];
  }
  const fetchedData: any = await splitQuery(GET_BLOCKS, blockClient, [], timestamps, skipCount);

  const blocks: any[] = [];
  if (fetchedData) {
    for (const t of timestamps) {
      const key = `t${t}`;
      if (fetchedData[key] && fetchedData[key].length > 0) {
        blocks.push({
          timestamp: t,
          number: fetchedData[key][0]['number'],
        });
      }
    }
  }

  return blocks;
}
