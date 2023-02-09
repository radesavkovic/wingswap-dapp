import { Currency, Token } from '@wingsswap/sdk';
import flatMap from 'lodash/flatMap';
import { useMemo } from 'react';

import { ADDITIONAL_BASES, BASES_TO_CHECK_TRADES_AGAINST, CUSTOM_BASES } from '../constants/routing';
import useAppChainId from './useAppChainId';

export function useAllCurrencyCombinations(currencyA?: Currency, currencyB?: Currency): [Token, Token][] {
  const appChainId = useAppChainId();

  const [tokenA, tokenB] = appChainId ? [currencyA?.wrapped, currencyB?.wrapped] : [undefined, undefined];

  const bases: Token[] = useMemo(() => {
    const common = BASES_TO_CHECK_TRADES_AGAINST[appChainId] ?? [];
    const additionalA = tokenA ? ADDITIONAL_BASES[appChainId]?.[tokenA.address] ?? [] : [];
    const additionalB = tokenB ? ADDITIONAL_BASES[appChainId]?.[tokenB.address] ?? [] : [];

    return [...common, ...additionalA, ...additionalB];
  }, [appChainId, tokenA, tokenB]);

  const basePairs: [Token, Token][] = useMemo(
    () => flatMap(bases, (base): [Token, Token][] => bases.map((otherBase) => [base, otherBase])),
    [bases],
  );

  return useMemo(
    () =>
      tokenA && tokenB
        ? [
            // the direct pair
            [tokenA, tokenB],
            // token A against all bases
            ...bases.map((base): [Token, Token] => [tokenA, base]),
            // token B against all bases
            ...bases.map((base): [Token, Token] => [tokenB, base]),
            // each base against all bases
            ...basePairs,
          ]
            .filter((tokens): tokens is [Token, Token] => Boolean(tokens[0] && tokens[1]))
            .filter(([t0, t1]) => t0.address !== t1.address)
            .filter(([tokenA, tokenB]) => {
              const customBases = CUSTOM_BASES[appChainId];

              const customBasesA: Token[] | undefined = customBases?.[tokenA.address];
              const customBasesB: Token[] | undefined = customBases?.[tokenB.address];

              if (!customBasesA && !customBasesB) return true;

              if (customBasesA && !customBasesA.find((base) => tokenB.equals(base))) return false;
              if (customBasesB && !customBasesB.find((base) => tokenA.equals(base))) return false;

              return true;
            })
        : [],
    [appChainId, bases, basePairs, tokenA, tokenB],
  );
}
