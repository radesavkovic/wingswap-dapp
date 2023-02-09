import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../types';
import { MulticallState } from './types';
import { Call, toCallKey } from './utils';

const initialState = (function () {
  return {
    callResults: {},
    callListeners: {},
  } as MulticallState;
})();

const { actions, reducer } = createSlice({
  name: 'multicall',
  initialState,
  reducers: {
    addMulticallListeners(
      state,
      action: PayloadAction<{
        calls: Call[];
        chainId: number;
        options: { blocksPerFetch: number };
      }>,
    ) {
      const {
        payload: {
          calls,
          chainId,
          options: { blocksPerFetch },
        },
      } = action;
      state.callListeners[chainId] = state.callListeners[chainId] ?? {};

      calls.forEach((call) => {
        const callKey = toCallKey(call);
        state.callListeners[chainId][callKey] = state.callListeners[chainId][callKey] ?? {};
        state.callListeners[chainId][callKey][blocksPerFetch] =
          (state.callListeners[chainId][callKey][blocksPerFetch] ?? 0) + 1;
      });
    },
    removeMulticallListeners(
      state,
      action: PayloadAction<{
        calls: Call[];
        chainId: number;
        options: { blocksPerFetch: number };
      }>,
    ) {
      const {
        payload: {
          calls,
          chainId,
          options: { blocksPerFetch },
        },
      } = action;
      if (!state.callListeners[chainId]) return;

      calls.forEach((call) => {
        const callKey = toCallKey(call);
        if (!state.callListeners[chainId][callKey] || !state.callListeners[chainId][callKey][blocksPerFetch]) return;

        if (state.callListeners[chainId][callKey][blocksPerFetch] === 1) {
          delete state.callListeners[chainId][callKey][blocksPerFetch];
        } else {
          state.callListeners[chainId][callKey][blocksPerFetch]--;
        }
      });
    },
    fetchingMulticallResults(
      state,
      action: PayloadAction<{ chainId: number; fetchingBlockNumber: number; calls: Call[] }>,
    ) {
      const {
        payload: { chainId, fetchingBlockNumber, calls },
      } = action;
      state.callResults[chainId] = state.callResults[chainId] ?? {};

      calls.forEach((call) => {
        const callKey = toCallKey(call);
        const current = state.callResults[chainId][callKey];
        if (!current) {
          state.callResults[chainId][callKey] = { fetchingBlockNumber };
        } else {
          if ((current.fetchingBlockNumber ?? 0) >= fetchingBlockNumber) return;
          state.callResults[chainId][callKey].fetchingBlockNumber = fetchingBlockNumber;
        }
      });
    },
    errorFetchingMulticallResults(
      state,
      action: PayloadAction<{ chainId: number; fetchingBlockNumber: number; calls: Call[] }>,
    ) {
      const {
        payload: { chainId, fetchingBlockNumber, calls },
      } = action;
      state.callResults[chainId] = state.callResults[chainId] ?? {};

      calls.forEach((call) => {
        const callKey = toCallKey(call);
        const current = state.callResults[chainId][callKey];
        if (!current) return; // only should be dispatched if we are already fetching
        if (current.fetchingBlockNumber === fetchingBlockNumber) {
          delete current.fetchingBlockNumber;
          current.data = null;
          current.blockNumber = fetchingBlockNumber;
        }
      });
    },
    updateMulticallResults(
      state,
      action: PayloadAction<{ chainId: number; results: { [callKey: string]: string | null }; blockNumber: number }>,
    ) {
      const {
        payload: { chainId, results, blockNumber },
      } = action;
      state.callResults[chainId] = state.callResults[chainId] ?? {};
      Object.keys(results).forEach((callKey) => {
        const current = state.callResults[chainId][callKey];
        if ((current?.blockNumber ?? 0) > blockNumber) return;
        state.callResults[chainId][callKey] = { data: results[callKey], blockNumber };
      });
    },
  },
});

const selectors = (function () {
  const getState = (state: RootState) => state.multicall;

  const selectCallListeners = createSelector(getState, (state) => state.callListeners);
  const selectCallResults = createSelector(getState, (state) => state.callResults);

  return {
    selectCallListeners,
    selectCallResults,
  };
})();

export default {
  actions,
  reducer,
  selectors,
};
