import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import routes from '../routes';
import { getAddress } from '../utils/getAddress';
import useActiveWeb3React from './useActiveWeb3React';
import { Field, useDerivedSwapInfo } from './useDerivedSwapInfo';
import usePairRoute from './usePairRoute';
import useWrapCallback, { WrapType } from './useWrapCallback';

export default function useSwapPair() {
  const navigate = useNavigate();

  const {
    disabledCurrency,
    isSelectingCurrency,
    toggleSelectCurrencyA,
    toggleSelectCurrencyB,
    onSelectCurrency,
    currencies: { CURRENCY_A: currencyA, CURRENCY_B: currencyB },
  } = usePairRoute(['from', 'to']);

  const [independentField, setIndependentField] = useState(Field.INPUT);
  const [typedValue, setTypedValue] = useState('');
  const { account } = useActiveWeb3React();
  const [recipient, setRecipient] = useState(account ?? '');

  const {
    trade,
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: swapInputError,
    allowedSlippage,
  } = useDerivedSwapInfo({
    independentField,
    typedValue,
    [Field.INPUT]: {
      address: getAddress(currencyA),
    },
    [Field.OUTPUT]: {
      address: getAddress(currencyB),
    },
    recipient,
  });

  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(currencies.INPUT, currencies.OUTPUT, typedValue);
  const showWrap = wrapType !== WrapType.NOT_APPLICABLE;

  const parsedAmounts = useMemo(
    () =>
      showWrap
        ? {
            INPUT: parsedAmount,
            OUTPUT: parsedAmount,
          }
        : {
            INPUT: independentField === 'INPUT' ? parsedAmount : trade?.inputAmount,
            OUTPUT: independentField === 'OUTPUT' ? parsedAmount : trade?.outputAmount,
          },
    [independentField, parsedAmount, showWrap, trade?.inputAmount, trade?.outputAmount],
  );

  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT;
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  };

  const updateCurrencyAValue = useCallback((value: string) => {
    setTypedValue(value);
    setIndependentField(Field.INPUT);
  }, []);

  const updateCurrencyBValue = useCallback((value: string) => {
    setTypedValue(value);
    setIndependentField(Field.OUTPUT);
  }, []);

  const reset = useCallback(() => {
    setTypedValue('');
    setIndependentField(Field.INPUT);
    navigate(routes.swapNext);
  }, [navigate]);

  return {
    disabledCurrency,
    isSelectingCurrency,
    toggleSelectCurrencyA,
    toggleSelectCurrencyB,
    onSelectCurrency,
    updateCurrencyAValue,
    updateCurrencyBValue,
    reset,
    formattedAmounts,
    parsedAmounts,
    trade,
    currencyBalances,
    currencies,
    recipient,
    swapInputError,
    allowedSlippage,
    wrapType,
    execute: onWrap,
    wrapInputError,
  };
}
