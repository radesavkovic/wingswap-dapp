import { Token } from '@wingsswap/sdk';
import { useMemo } from 'react';

import { BASES_TO_TRACK_LIQUIDITY_FOR, PINNED_PAIRS } from '../constants/addresses';
import { utils } from '../constants/token';
import { selectors } from '../reducers';
import { useAppSelector } from '../reducers/hooks';
import useActiveWeb3React from './useActiveWeb3React';
import useAllActiveTokens from './useAllActiveTokens';

/**
 * Returns all the pairs of tokens that are tracked by the user for the current chain ID.
 */
export function useTrackedTokenPairs(): [Token, Token][] {
  const { account, chainId } = useActiveWeb3React();
  const tokens = useAllActiveTokens(false);

  // pairs for every token against every base
  const generatedPairs: [Token, Token][] = useMemo(
    () =>
      chainId
        ? Object.keys(tokens).reduce((memo, tokenAddress) => {
            const token = tokens[tokenAddress];
            const pair: [Token, Token][] = (BASES_TO_TRACK_LIQUIDITY_FOR[chainId] ?? [])
              .filter((base) => base.address !== token.address)
              .map((base) => [base, token]);
            return [...memo, ...pair];
          }, [] as [Token, Token][])
        : [],
    [tokens, chainId],
  );

  // pinned pairs
  const pinnedPairs = useMemo(() => (chainId ? PINNED_PAIRS[chainId] ?? [] : []), [chainId]);

  // pairs saved by users
  const savedSerializedPairs = useAppSelector(selectors.token.selectPairs);

  const userPairs: [Token, Token][] = useMemo(() => {
    if (!chainId || !savedSerializedPairs) return [];
    const pairs = savedSerializedPairs[chainId];
    if (!pairs) return [];

    return Object.keys(pairs).map((pairId) => {
      return [utils.fromSerializedToken(pairs[pairId].token0), utils.fromSerializedToken(pairs[pairId].token1)];
    });
  }, [savedSerializedPairs, chainId]);

  const combinedList = useMemo(
    () => userPairs.concat(generatedPairs).concat(pinnedPairs),
    [generatedPairs, pinnedPairs, userPairs],
  );

  return useMemo(() => {
    if (!account) return [];
    // dedupes pairs of tokens in the combined list
    const pairMap = combinedList.reduce<{ [key: string]: [Token, Token] }>((memo, [tokenA, tokenB]) => {
      const sorted = tokenA.sortsBefore(tokenB);
      const key = sorted ? `${tokenA.address}:${tokenB.address}` : `${tokenB.address}:${tokenA.address}`;
      if (memo[key]) return memo;
      memo[key] = sorted ? [tokenA, tokenB] : [tokenB, tokenA];
      return memo;
    }, {} as { [key: string]: [Token, Token] });

    return Object.values(pairMap);
  }, [account, combinedList]);
}
