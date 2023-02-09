import { Percent } from '@wingsswap/sdk';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import routes from '../routes';
import { Field, useDerivedBurnInfo } from './useDerivedBurnInfo';
import usePairRoute from './usePairRoute';

export default function useBurnPair(defaultValue: string) {
  const navigate = useNavigate();

  const {
    currencies: { CURRENCY_A: currencyA, CURRENCY_B: currencyB },
  } = usePairRoute(['address0', 'address1']);

  const [percent, setPercent] = useState(defaultValue);
  const { pair, parsedAmounts, error } = useDerivedBurnInfo(
    { independentField: Field.LIQUIDITY_PERCENT, typedValue: percent },
    currencyA,
    currencyB,
  );

  const formattedAmounts = {
    [Field.LIQUIDITY_PERCENT]: parsedAmounts[Field.LIQUIDITY_PERCENT].equalTo('0')
      ? '0'
      : parsedAmounts[Field.LIQUIDITY_PERCENT].lessThan(new Percent('1', '100'))
      ? '<1'
      : parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0),
    [Field.LIQUIDITY]: parsedAmounts[Field.LIQUIDITY]?.toSignificant(6) ?? '',
    [Field.CURRENCY_A]: parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) ?? '',
    [Field.CURRENCY_B]: parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) ?? '',
  };

  const updateBurnPercent = useCallback((value: string) => {
    setPercent(value);
  }, []);

  useEffect(() => {
    if (!currencyA || !currencyB) navigate(routes.pool, { replace: true });
  }, [navigate, currencyA, currencyB]);

  return {
    updateBurnPercent,
    currencies: {
      [Field.CURRENCY_A]: currencyA,
      [Field.CURRENCY_B]: currencyB,
    },
    formattedAmounts,
    pair,
    parsedAmounts,
    error,
  };
}
