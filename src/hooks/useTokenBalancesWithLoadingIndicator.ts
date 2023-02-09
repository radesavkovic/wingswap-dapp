import { Interface } from '@ethersproject/abi';
import { isAddress } from '@ethersproject/address';
import { CurrencyAmount, JSBI, Token } from '@wingsswap/sdk';
import { useMemo } from 'react';

import ERC20ABI from '../abis/erc20.json';
import useActiveWeb3React from './useActiveWeb3React';
import { useMultipleContractSingleData } from './web3/useMultipleContractSingleData';

const TOKEN_BALANCE_GAS_OVERRIDE: { [chainId: number]: number } = {};

/**
 * Returns a map of token addresses to their eventually consistent token balances for a single account.
 */
export function useTokenBalancesWithLoadingIndicator(
  address?: string,
  tokens?: (Token | undefined)[],
): [{ [tokenAddress: string]: CurrencyAmount<Token> | undefined }, boolean] {
  const { chainId } = useActiveWeb3React();
  const validatedTokens: Token[] = useMemo(
    () => tokens?.filter((t?: Token): t is Token => (t ? isAddress(t?.address) !== false : false)) ?? [],
    [tokens],
  );

  const validatedTokenAddresses = useMemo(() => validatedTokens.map((vt) => vt.address), [validatedTokens]);
  const ERC20Interface = new Interface(ERC20ABI);
  const balances = useMultipleContractSingleData(validatedTokenAddresses, ERC20Interface, 'balanceOf', [address], {
    gasRequired: TOKEN_BALANCE_GAS_OVERRIDE[chainId ?? -1] ?? 100_000,
  });

  const anyLoading: boolean = useMemo(() => balances.some((callState) => callState.loading), [balances]);

  return [
    useMemo(
      () =>
        address && validatedTokens.length > 0
          ? validatedTokens.reduce<{
              [tokenAddress: string]: CurrencyAmount<Token> | undefined;
            }>((memo, token, i) => {
              const value = balances?.[i]?.result?.[0];
              const amount = value ? JSBI.BigInt(value.toString()) : undefined;
              if (amount) {
                memo[token.address] = CurrencyAmount.fromRawAmount(token, amount);
              }
              return memo;
            }, {})
          : {},
      [address, balances, validatedTokens],
    ),
    anyLoading,
  ];
}
