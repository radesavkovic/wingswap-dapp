import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import routes from '../routes';
import useDerivedMintInfo, { Field } from './useDerivedMintInfo';
import usePairRoute from './usePairRoute';

export default function useMintPair() {
  const navigate = useNavigate();

  const {
    disabledCurrency,
    isSelectingCurrency,
    toggleSelectCurrencyA,
    toggleSelectCurrencyB,
    onSelectCurrency,
    currencies: { CURRENCY_A: currencyA, CURRENCY_B: currencyB },
  } = usePairRoute(['address0', 'address1']);

  const [independentField, setIndependentField] = useState(Field.CURRENCY_A);
  const [typedValue, setTypedValue] = useState('');
  const [otherTypedValue, setOtherTypedValue] = useState('');

  const {
    dependentField,
    currencies,
    pair,
    pairState,
    currencyBalances,
    parsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error,
  } = useDerivedMintInfo(
    {
      independentField,
      typedValue: typedValue,
      otherTypedValue: otherTypedValue,
    },
    currencyA,
    currencyB,
  );

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: noLiquidity ? otherTypedValue : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  };

  const updateCurrencyAValue = useCallback(
    (value: string) => {
      if (noLiquidity) {
        if (independentField === Field.CURRENCY_A) {
          setTypedValue(value);
        } else {
          setTypedValue(value);
          setOtherTypedValue(typedValue);
        }
      } else {
        setTypedValue(value);
        setOtherTypedValue('');
      }
      setIndependentField(Field.CURRENCY_A);
    },
    [independentField, noLiquidity, typedValue],
  );

  const updateCurrencyBValue = useCallback(
    (value: string) => {
      if (noLiquidity) {
        if (independentField === Field.CURRENCY_B) {
          setTypedValue(value);
        } else {
          setTypedValue(value);
          setOtherTypedValue(typedValue);
        }
      } else {
        setTypedValue(value);
        setOtherTypedValue('');
      }
      setIndependentField(Field.CURRENCY_B);
    },
    [independentField, noLiquidity, typedValue],
  );

  const reset = useCallback(() => {
    setTypedValue('');
    setOtherTypedValue('');
    setIndependentField(Field.CURRENCY_A);
    navigate(routes['pool-add']);
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
    currencies,
    pair,
    pairState,
    currencyBalances,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error,
  };
}
