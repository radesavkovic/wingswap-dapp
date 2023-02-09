import { Percent } from '@wingsswap/sdk';
import { useMemo } from 'react';

import { selectors } from '../reducers';
import { useAppSelector } from '../reducers/hooks';

/**
 * Return the user's slippage tolerance, from the redux store, and a function to update the slippage tolerance
 */
export function useUserSlippageTolerance(): Percent | 'auto' {
  const slippage = useAppSelector(selectors.user.selectSlippage);

  return useMemo(() => (slippage === 'auto' ? 'auto' : new Percent(Math.floor(slippage * 100), 10_000)), [slippage]);
}
