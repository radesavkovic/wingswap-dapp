import { isAddress } from '@ethersproject/address';
import { Currency, CurrencyAmount, JSBI } from '@wingsswap/sdk';
import { useMemo } from 'react';

import { ExtendedNative } from '../constants/extended-native';
import useAppChainId from './useAppChainId';
import { useMulticall2Contract } from './useContract';
import { useSingleContractMultipleData } from './web3/useSingleContractMultipleData';

export function useWalletBalances(uncheckedAddresses?: (string | undefined)[]): {
  [address: string]: CurrencyAmount<Currency> | undefined;
} {
  const appChainId = useAppChainId();
  const multicallContract = useMulticall2Contract();

  const addresses: string[] = useMemo(
    () =>
      uncheckedAddresses
        ?.filter((a) => a && isAddress(a))
        .map((a) => a as string)
        .sort() ?? [],
    [uncheckedAddresses],
  );

  const results = useSingleContractMultipleData(
    multicallContract,
    'getEthBalance',
    addresses.map((address) => [address]),
  );

  return useMemo(
    () =>
      addresses.reduce<{ [address: string]: CurrencyAmount<Currency> }>((memo, address, i) => {
        const value = results?.[i]?.result?.[0];
        if (value) {
          memo[address] = CurrencyAmount.fromRawAmount(
            ExtendedNative.onChain(appChainId),
            JSBI.BigInt(value.toString()),
          );
        }
        return memo;
      }, {}),
    [addresses, appChainId, results],
  );
}
