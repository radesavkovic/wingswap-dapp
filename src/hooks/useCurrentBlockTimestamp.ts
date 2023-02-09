import { BigNumber } from '@ethersproject/bignumber';

import { useMulticall2Contract } from './useContract';
import useSingleCallResult from './web3/useSingleCallResult';

// gets the current timestamp from the blockchain
export default function useCurrentBlockTimestamp(): BigNumber | undefined {
  const multicall = useMulticall2Contract();
  return useSingleCallResult(multicall, 'getCurrentBlockTimestamp')?.result?.[0];
}
