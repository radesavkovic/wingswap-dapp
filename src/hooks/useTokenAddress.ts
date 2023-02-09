import { Currency } from '@wingsswap/sdk';
import { useMemo } from 'react';

import { ExtendedNative, isNativeCurrency } from '../constants/extended-native';
import useAppChainId from './useAppChainId';
import useToken from './useToken';

export default function useCurrency(address?: string): Currency | undefined {
  const appChainId = useAppChainId();
  const isNative = isNativeCurrency(address);
  const token = useToken(isNative ? undefined : address);
  const extendedNative = useMemo(() => ExtendedNative.onChain(appChainId), [appChainId]);
  return isNative ? extendedNative : token;
}
