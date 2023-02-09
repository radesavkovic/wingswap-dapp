import { Currency, NativeCurrency } from '@wingsswap/sdk';
import { useCallback, useMemo } from 'react';

import { selectors } from '../reducers';
import { useAppSelector } from '../reducers/hooks';

export default function useDefaultLogoURIs(token: Currency) {
  const selectDefaultLogoURIs = useCallback(
    selectors.list.makeSelectDefaultLogoURIs(token instanceof NativeCurrency ? { address: '' } : token),
    [token],
  );
  const logoURIs = useAppSelector(selectDefaultLogoURIs);
  return useMemo(() => logoURIs, [logoURIs]);
}
