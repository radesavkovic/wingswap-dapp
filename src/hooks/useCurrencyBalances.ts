import { Currency, CurrencyAmount, Token } from '@wingsswap/sdk';
import { useMemo } from 'react';

import { useTokenBalances } from './useTokenBalances';
import { useWalletBalances } from './useWalletBalances';

export default function useCurrencyBalances(
  address?: string,
  currencies?: (Currency | undefined)[],
): (CurrencyAmount<Currency> | undefined)[] {
  const tokens = useMemo(
    () => currencies?.filter((currency): currency is Token => currency?.isToken ?? false) ?? [],
    [currencies],
  );

  const tokenBalances = useTokenBalances(address, tokens);
  const containsETH: boolean = useMemo(() => currencies?.some((currency) => currency?.isNative) ?? false, [currencies]);
  const walletBalance = useWalletBalances(containsETH ? [address] : []);

  return useMemo(
    () =>
      currencies?.map((currency) => {
        if (!address || !currency) return undefined;
        if (currency.isToken) return tokenBalances[currency.address];
        if (currency.isNative) return walletBalance[address];
        return undefined;
      }) ?? [],
    [address, currencies, tokenBalances, walletBalance],
  );
}

export function useCurrencyBalance(address?: string, currency?: Currency): CurrencyAmount<Currency> | undefined {
  return useCurrencyBalances(address, [currency])[0];
}
