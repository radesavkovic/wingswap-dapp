import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../types';
import { ApplicationState } from './types';

const initialState = (function () {
  return {
    blockNumber: {},
    subgraphStatus: {
      available: null,
      syncedBlock: undefined,
      headBlock: undefined,
    },
  } as ApplicationState;
})();

const { actions, reducer } = createSlice({
  name: 'application',
  initialState,
  reducers: {
    updateBlockNumber(state, action: PayloadAction<{ chainId: number; blockNumber: number }>) {
      const {
        payload: { chainId, blockNumber },
      } = action;
      if (typeof state.blockNumber[chainId] !== 'number') {
        state.blockNumber[chainId] = blockNumber;
      } else {
        state.blockNumber[chainId] = Math.max(blockNumber, state.blockNumber[chainId]);
      }
    },

    updateSubgraphStatus(
      state,
      action: PayloadAction<{
        available: boolean | null;
        syncedBlock: number | undefined;
        headBlock: number | undefined;
      }>,
    ) {
      const { available, syncedBlock, headBlock } = action.payload;

      state.subgraphStatus = {
        available,
        syncedBlock,
        headBlock,
      };
    },
  },
});

const selectors = (function () {
  const getState = (state: RootState) => state.application;

  const selectBlockNumberMap = createSelector(getState, (state) => state.blockNumber);
  const selectSubgraphStatus = createSelector(getState, (state) => state.subgraphStatus);

  return {
    selectBlockNumberMap,
    selectSubgraphStatus,
  };
})();

export default {
  actions,
  reducer,
  selectors,
};
