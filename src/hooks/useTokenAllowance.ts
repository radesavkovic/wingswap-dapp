import { CurrencyAmount, Token } from '@wingsswap/sdk';
import { useMemo } from 'react';

import { useTokenContract } from './useContract';
import useSingleCallResult from './web3/useSingleCallResult';

export function useTokenAllowance(token?: Token, owner?: string, spender?: string): CurrencyAmount<Token> | undefined {
  const contract = useTokenContract(token?.address, false);

  const inputs = useMemo(() => [owner, spender], [owner, spender]);
  const allowance = useSingleCallResult(contract, 'allowance', inputs).result;

  return useMemo(
    () => (token && allowance ? CurrencyAmount.fromRawAmount(token, allowance.toString()) : undefined),
    [token, allowance],
  );
}
