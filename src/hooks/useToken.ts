import { arrayify } from '@ethersproject/bytes';
import { parseBytes32String } from '@ethersproject/strings';
import { Token } from '@wingsswap/sdk';
import { useMemo } from 'react';

import { parseAddress } from '../utils/addresses';
import useActiveWeb3React from './useActiveWeb3React';
import useAllActiveTokens from './useAllActiveTokens';
import { useBytes32TokenContract, useTokenContract } from './useContract';
import { NEVER_RELOAD } from './web3/useCallsData';
import useSingleCallResult from './web3/useSingleCallResult';

// parse a name or symbol from a token response
const BYTES32_REGEX = /^0x[a-fA-F0-9]{64}$/;

function parseStringOrBytes32(str: string | undefined, bytes32: string | undefined, defaultValue: string): string {
  return str && str.length > 0
    ? str
    : // need to check for proper bytes string and valid terminator
    bytes32 && BYTES32_REGEX.test(bytes32) && arrayify(bytes32)[31] === 0
    ? parseBytes32String(bytes32)
    : defaultValue;
}

export default function useToken(address?: string): Token | undefined {
  const { chainId } = useActiveWeb3React();
  const parsedAddress = parseAddress(address);

  const tokens = useAllActiveTokens();

  const tokenContract = useTokenContract(parsedAddress, false);
  const tokenContractBytes32 = useBytes32TokenContract(parsedAddress, false);
  const token = parsedAddress ? tokens[parsedAddress] : undefined;

  const tokenName = useSingleCallResult(token ? undefined : tokenContract, 'name', undefined, NEVER_RELOAD);
  const tokenNameBytes32 = useSingleCallResult(
    token ? undefined : tokenContractBytes32,
    'name',
    undefined,
    NEVER_RELOAD,
  );
  const symbol = useSingleCallResult(token ? undefined : tokenContract, 'symbol', undefined, NEVER_RELOAD);
  const symbolBytes32 = useSingleCallResult(
    token ? undefined : tokenContractBytes32,
    'symbol',
    undefined,
    NEVER_RELOAD,
  );
  const decimals = useSingleCallResult(token ? undefined : tokenContract, 'decimals', undefined, NEVER_RELOAD);

  return useMemo(() => {
    if (token) return token;
    if (!chainId || !parsedAddress) return undefined;
    if (decimals.loading || symbol.loading || tokenName.loading) return undefined;
    if (decimals.result) {
      return new Token(
        chainId,
        parsedAddress,
        decimals.result[0],
        parseStringOrBytes32(symbol.result?.[0], symbolBytes32.result?.[0], 'UNKNOWN'),
        parseStringOrBytes32(tokenName.result?.[0], tokenNameBytes32.result?.[0], 'Unknown Token'),
      );
    }
    return undefined;
  }, [
    chainId,
    decimals.loading,
    decimals.result,
    parsedAddress,
    symbol.loading,
    symbol.result,
    symbolBytes32.result,
    token,
    tokenName.loading,
    tokenName.result,
    tokenNameBytes32.result,
  ]);
}
