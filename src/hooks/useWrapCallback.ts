import { Currency } from '@wingsswap/sdk';
import { useMemo } from 'react';

import { getWrapped } from '../constants/extended-native';
import tryParseAmount from '../utils/tryParseAmount';
import useActiveWeb3React from './useActiveWeb3React';
import useAppChainId from './useAppChainId';
import { useWrappedContract } from './useContract';
import { useCurrencyBalance } from './useCurrencyBalances';
import useTransactionAdder from './useTransactionAdder';

export enum WrapType {
  NOT_APPLICABLE,
  WRAP,
  UNWRAP,
}

const NOT_APPLICABLE = { wrapType: WrapType.NOT_APPLICABLE };

/**
 * Given the selected input and output currency, return a wrap callback
 * @param inputCurrency the selected input currency
 * @param outputCurrency the selected output currency
 * @param typedValue the user input value
 */
export default function useWrapCallback(
  inputCurrency?: Currency,
  outputCurrency?: Currency,
  typedValue?: string,
): { wrapType: WrapType; execute?: () => Promise<void>; inputError?: string } {
  const appChainId = useAppChainId();
  const { chainId, account } = useActiveWeb3React();

  const wrappedContract = useWrappedContract();
  const balance = useCurrencyBalance(account ?? undefined, inputCurrency);

  // we can always parse the amount typed as the input currency, since wrapping is 1:1
  const inputAmount = useMemo(() => tryParseAmount(typedValue, inputCurrency), [inputCurrency, typedValue]);
  const addTransaction = useTransactionAdder();

  return useMemo(() => {
    if (!wrappedContract || !chainId || !inputCurrency || !outputCurrency) return NOT_APPLICABLE;

    const wrapped = getWrapped(appChainId)[chainId];
    if (!wrapped) return NOT_APPLICABLE;

    const wrappedSymbol = wrapped.symbol;
    const nativeSymbol = wrappedSymbol?.slice(1);

    const hasInputAmount = Boolean(inputAmount?.greaterThan('0'));
    const sufficientBalance = inputAmount && balance && !balance.lessThan(inputAmount);

    if (inputCurrency.isNative && wrapped.equals(outputCurrency)) {
      return {
        wrapType: WrapType.WRAP,
        execute:
          sufficientBalance && inputAmount
            ? async () => {
                try {
                  const txReceipt = await wrappedContract.deposit({ value: `0x${inputAmount.quotient.toString(16)}` });
                  addTransaction(txReceipt, {
                    summary: `Wrap ${inputAmount.toSignificant(6)} ${nativeSymbol} to ${wrappedSymbol}`,
                  });
                } catch (error) {
                  console.error('Could not deposit', error);
                }
              }
            : undefined,
        inputError: sufficientBalance
          ? undefined
          : hasInputAmount
          ? `Insufficient ${nativeSymbol} balance`
          : `Enter ${nativeSymbol} amount`,
      };
    } else if (wrapped.equals(inputCurrency) && outputCurrency.isNative) {
      return {
        wrapType: WrapType.UNWRAP,
        execute:
          sufficientBalance && inputAmount
            ? async () => {
                try {
                  const txReceipt = await wrappedContract.withdraw(`0x${inputAmount.quotient.toString(16)}`);
                  addTransaction(txReceipt, {
                    summary: `Unwrap ${inputAmount.toSignificant(6)} ${wrappedSymbol} to ${nativeSymbol}`,
                  });
                } catch (error) {
                  console.error('Could not withdraw', error);
                }
              }
            : undefined,
        inputError: sufficientBalance
          ? undefined
          : hasInputAmount
          ? `Insufficient ${wrappedSymbol} balance`
          : `Enter ${wrappedSymbol} amount`,
      };
    } else {
      return NOT_APPLICABLE;
    }
  }, [addTransaction, appChainId, balance, chainId, inputAmount, inputCurrency, outputCurrency, wrappedContract]);
}
