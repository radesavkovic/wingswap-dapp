import { Token } from '@wingsswap/sdk';
import { useMemo } from 'react';

import { utils } from '../constants/token';
import { selectors } from '../reducers';
import { useAppSelector } from '../reducers/hooks';
import { SerializedToken } from '../reducers/token/types';
import useActiveWeb3React from './useActiveWeb3React';
import useAppChainId from './useAppChainId';

export default function useAllActiveTokens(withAppChainId = true): { [address: string]: Token } {
  const appChainId = useAppChainId();
  const { chainId } = useActiveWeb3React();

  const activeTokenMap = useAppSelector(selectors.list.selectActiveTokenMap);
  const tokens = useAppSelector(selectors.token.selectTokens);

  const activeChainId = withAppChainId ? appChainId : chainId ?? -1;

  const addedSerializedTokens = useMemo(
    () => tokens[activeChainId] || ({} as { [address: string]: SerializedToken }),
    [activeChainId, tokens],
  );

  return useMemo(() => {
    const addedTokens = Object.values(addedSerializedTokens).map((token) => utils.fromSerializedToken(token));
    const listsTokens = Object.values(activeTokenMap)
      .filter((token) => token.chainId === activeChainId)
      .map((token) => utils.fromTokenInfo(token));
    return [...listsTokens, ...addedTokens].reduce((memo, token) => {
      if (!memo[token.address]) memo[token.address] = token;
      return memo;
    }, {});
  }, [activeChainId, activeTokenMap, addedSerializedTokens]);
}
