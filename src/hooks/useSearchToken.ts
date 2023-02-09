import { getAddress, isAddress } from '@ethersproject/address';
import { Token } from '@wingsswap/sdk';
import { TokenInfo } from '@manekiswap/token-lists';
import { useCallback, useMemo } from 'react';

import { utils } from '../constants/token';
import { selectors } from '../reducers';
import { useAppSelector } from '../reducers/hooks';
import { SerializedToken } from '../reducers/token/types';
import useAllActiveTokens from './useAllActiveTokens';
import useAppChainId from './useAppChainId';

export default function useSearchToken(input: string): Token[] {
  const appChainId = useAppChainId();
  const allTokenMap = useAppSelector(selectors.list.selectAllTokenMap);
  const tokens = useAppSelector(selectors.token.selectTokens);

  const activeUniqueTokens = useAllActiveTokens();

  const search = useCallback(
    (tokenMap: { [address: string]: TokenInfo } | { [address: string]: SerializedToken }) => {
      return Object.values(tokenMap)
        .filter((token) => {
          if (token.chainId !== appChainId) return false;

          const matchedName = token.name?.toLowerCase().includes(input.toLowerCase());
          const matchedSymbol = token.symbol?.toLowerCase().includes(input.toLowerCase());
          const matchedTags = token.tags?.filter((tag) => tag.toLowerCase().includes(input.toLowerCase()));

          if (matchedName) return true;
          if (matchedSymbol) return true;
          if (!!matchedTags) return matchedTags.length > 0;
          return false;
        })
        .map((token) => utils.fromSerializedToken(token))
        .sort((a, b) => (a.sortsBefore(b) ? 1 : 0));
    },
    [appChainId, input],
  );

  return useMemo(() => {
    if (input === '') return Object.values(activeUniqueTokens).sort((a, b) => (a.sortsBefore(b) ? 1 : 0));

    let checksumedAddress: string | undefined;
    if (isAddress(input)) {
      checksumedAddress = getAddress(input.trim());
    }

    if (!!checksumedAddress && allTokenMap[checksumedAddress]) {
      return [utils.fromSerializedToken(allTokenMap[checksumedAddress])];
    }

    return [...search(tokens[appChainId] ?? {}), ...search(allTokenMap)];
  }, [activeUniqueTokens, allTokenMap, appChainId, input, search, tokens]);
}
