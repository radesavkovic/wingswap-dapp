import { Currency } from '@wingsswap/sdk';
import { useMemo } from 'react';

import useUnsupportedTokens from './useUnsupportedTokens';

/**
 * Returns true if the input currency or output currency cannot be traded in the interface
 * @param currencyIn the input currency to check
 * @param currencyOut the output currency to check
 */
export function useIsPairUnsupported(currencyIn?: Currency, currencyOut?: Currency): boolean {
  const unsupportedTokens = useUnsupportedTokens();

  return useMemo(() => {
    // if unsupported list loaded & either token on list, mark as unsupported
    return Boolean(
      unsupportedTokens &&
        ((currencyIn?.isToken && unsupportedTokens[currencyIn.address]) ||
          (currencyOut?.isToken && unsupportedTokens[currencyOut.address])),
    );
  }, [currencyIn, currencyOut, unsupportedTokens]);
}
