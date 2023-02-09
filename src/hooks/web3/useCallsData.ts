import { BigNumber } from '@ethersproject/bignumber';
import { useEffect, useMemo } from 'react';

import { actions, selectors } from '../../reducers';
import { useAppDispatch, useAppSelector } from '../../reducers/hooks';
import { CallResult } from '../../reducers/multicall/call';
import { ListenerOptions } from '../../reducers/multicall/types';
import { Call, parseCallKey, toCallKey } from '../../reducers/multicall/utils';
import useActiveWeb3React from '../useActiveWeb3React';

type MethodArg = string | number | BigNumber;
type MethodArgs = Array<MethodArg | MethodArg[]>;

export type OptionalMethodInputs = Array<MethodArg | MethodArg[] | undefined> | undefined;

function isMethodArg(x: unknown): x is MethodArg {
  return BigNumber.isBigNumber(x) || ['string', 'number'].indexOf(typeof x) !== -1;
}

export function isValidMethodArgs(x: unknown): x is MethodArgs | undefined {
  return (
    x === undefined ||
    (Array.isArray(x) && x.every((xi) => isMethodArg(xi) || (Array.isArray(xi) && xi.every(isMethodArg))))
  );
}

export const NEVER_RELOAD: ListenerOptions = {
  blocksPerFetch: Infinity,
} as const;

const INVALID_RESULT: CallResult = { valid: false, blockNumber: undefined, data: undefined };

// the lowest level call for subscribing to contract data
export default function useCallsData(
  calls: (Call | undefined)[],
  { blocksPerFetch }: ListenerOptions = { blocksPerFetch: 1 },
): CallResult[] {
  const { chainId } = useActiveWeb3React();
  const callResults = useAppSelector(selectors.multicall.selectCallResults);
  const dispatch = useAppDispatch();

  const serializedCallKeys: string = useMemo(
    () =>
      JSON.stringify(
        calls
          ?.filter((c): c is Call => Boolean(c))
          ?.map(toCallKey)
          ?.sort() ?? [],
      ),
    [calls],
  );

  // update listeners when there is an actual change that persists for at least 100ms
  useEffect(() => {
    const callKeys: string[] = JSON.parse(serializedCallKeys);
    if (!chainId || callKeys.length === 0) return undefined;
    const calls = callKeys.map((key) => parseCallKey(key));
    dispatch(
      actions.multicall.addMulticallListeners({
        chainId,
        calls,
        options: { blocksPerFetch },
      }),
    );

    return () => {
      dispatch(
        actions.multicall.removeMulticallListeners({
          chainId,
          calls,
          options: { blocksPerFetch },
        }),
      );
    };
  }, [chainId, dispatch, blocksPerFetch, serializedCallKeys]);

  return useMemo(
    () =>
      calls.map<CallResult>((call) => {
        if (!chainId || !call) return INVALID_RESULT;

        const result = callResults[chainId]?.[toCallKey(call)];
        let data;
        if (result?.data && result?.data !== '0x') {
          data = result.data;
        }

        return { valid: true, data, blockNumber: result?.blockNumber };
      }),
    [callResults, calls, chainId],
  );
}
