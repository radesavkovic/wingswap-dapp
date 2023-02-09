import { Interface } from '@ethersproject/abi';
import { useMemo } from 'react';

import { CallState, toCallState } from '../../reducers/multicall/call';
import { ListenerOptions } from '../../reducers/multicall/types';
import { Call } from '../../reducers/multicall/utils';
import useLatestBlockNumber from '../useLatestBlockNumber';
import useCallsData, { isValidMethodArgs, OptionalMethodInputs } from './useCallsData';

export function useMultipleContractSingleData(
  addresses: (string | undefined)[],
  contractInterface: Interface,
  methodName: string,
  callInputs?: OptionalMethodInputs,
  options?: Partial<ListenerOptions> & { gasRequired?: number },
): CallState[] {
  const fragment = useMemo(() => contractInterface.getFunction(methodName), [contractInterface, methodName]);

  const blocksPerFetch = options?.blocksPerFetch;
  const gasRequired = options?.gasRequired;

  const callData: string | undefined = useMemo(
    () =>
      fragment && isValidMethodArgs(callInputs)
        ? contractInterface.encodeFunctionData(fragment, callInputs)
        : undefined,
    [callInputs, contractInterface, fragment],
  );

  const calls = useMemo(
    () =>
      fragment && addresses && addresses.length > 0 && callData
        ? addresses.map<Call | undefined>((address) => {
            return address && callData
              ? {
                  address,
                  callData,
                  ...(gasRequired ? { gasRequired } : {}),
                }
              : undefined;
          })
        : [],
    [addresses, callData, fragment, gasRequired],
  );

  const results = useCallsData(calls, blocksPerFetch ? { blocksPerFetch } : undefined);

  const latestBlockNumber = useLatestBlockNumber();

  return useMemo(() => {
    return results.map((result) => toCallState(result, contractInterface, fragment, latestBlockNumber));
  }, [fragment, results, contractInterface, latestBlockNumber]);
}
