import { Interface } from '@ethersproject/abi';
import { computePairAddress, Currency, CurrencyAmount, FACTORY_ADDRESS, Pair } from '@wingsswap/sdk';
import IUniswapV2PairABI from '@wingsswap/sdk/abis/IUniswapV2Pair.json';
import { useMemo } from 'react';

import useActiveWeb3React from './useActiveWeb3React';
import { useMultipleContractSingleData } from './web3/useMultipleContractSingleData';

const PAIR_INTERFACE = new Interface(IUniswapV2PairABI.abi);

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export function usePairs(currencies: [Currency | undefined, Currency | undefined][]): [PairState, Pair | null][] {
  const { chainId } = useActiveWeb3React();
  const tokens = useMemo(
    () => currencies.map(([currencyA, currencyB]) => [currencyA?.wrapped, currencyB?.wrapped]),
    [currencies],
  );

  const pairAddresses = useMemo(
    () =>
      tokens.map(([tokenA, tokenB]) => {
        return tokenA &&
          tokenB &&
          chainId === tokenA.chainId &&
          tokenA.chainId === tokenB.chainId &&
          !tokenA.equals(tokenB) &&
          FACTORY_ADDRESS[chainId]
          ? computePairAddress({ factoryAddress: FACTORY_ADDRESS[chainId], tokenA, tokenB })
          : undefined;
      }),
    [chainId, tokens],
  );

  const results = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'getReserves');

  return useMemo(() => {
    return results.map((result, i) => {
      const { result: reserves, loading } = result;
      const tokenA = tokens[i][0];
      const tokenB = tokens[i][1];

      if (loading) return [PairState.LOADING, null];
      if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [PairState.INVALID, null];
      if (!reserves) return [PairState.NOT_EXISTS, null];
      const { reserve0, reserve1 } = reserves;
      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA];
      return [
        PairState.EXISTS,
        new Pair(
          CurrencyAmount.fromRawAmount(token0, reserve0.toString()),
          CurrencyAmount.fromRawAmount(token1, reserve1.toString()),
        ),
      ];
    });
  }, [results, tokens]);
}

export function usePair(tokenA?: Currency, tokenB?: Currency): [PairState, Pair | null] {
  const inputs: [[Currency | undefined, Currency | undefined]] = useMemo(() => [[tokenA, tokenB]], [tokenA, tokenB]);
  return usePairs(inputs)[0];
}
