import { Contract } from '@ethersproject/contracts';
import { useMemo } from 'react';

import { CallState, toCallState } from '../../reducers/multicall/call';
import { ListenerOptions } from '../../reducers/multicall/types';
import { Call } from '../../reducers/multicall/utils';
import useLatestBlockNumber from '../useLatestBlockNumber';
import useCallsData, { isValidMethodArgs, OptionalMethodInputs } from './useCallsData';

export function useSingleContractMultipleData(
  contract: Contract | null | undefined,
  methodName: string,
  callInputs: OptionalMethodInputs[],
  options: Partial<ListenerOptions> & { gasRequired?: number } = {},
): CallState[] {
  const fragment = useMemo(() => contract?.interface?.getFunction(methodName), [contract, methodName]);

  const blocksPerFetch = options?.blocksPerFetch;
  const gasRequired = options?.gasRequired;

  const calls = useMemo(
    () =>
      contract && fragment && callInputs?.length > 0 && callInputs.every((inputs) => isValidMethodArgs(inputs))
        ? callInputs.map<Call>((inputs) => {
            return {
              address: contract.address,
              callData: contract.interface.encodeFunctionData(fragment, inputs),
              ...(gasRequired ? { gasRequired } : {}),
            };
          })
        : [],
    [contract, fragment, callInputs, gasRequired],
  );

  const results = useCallsData(calls, blocksPerFetch ? { blocksPerFetch } : undefined);

  const latestBlockNumber = useLatestBlockNumber();

  return useMemo(() => {
    return results.map((result) => toCallState(result, contract?.interface, fragment, latestBlockNumber));
  }, [fragment, contract, results, latestBlockNumber]);
}
