import { SupportedChainId } from '@wingsswap/sdk';
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../types';
import { UserState } from './types';

const initialState = (function () {
  return {
    theme: 'dark',
    multihop: true,
    slippage: 'auto',
    transactionDeadline: 60 * 30,
    chainId: SupportedChainId.SMART_CHAIN, // for supporting multiple chains in future
  } as UserState;
})();

const { actions, reducer } = createSlice({
  name: 'user',
  initialState,
  reducers: {
    toggleMultihop(state, action: PayloadAction<boolean>) {
      state.multihop = action.payload;
    },
    changeSlippage(state, action: PayloadAction<'auto' | number>) {
      if (action.payload === 'auto' || typeof action.payload === 'number') {
        state.slippage = action.payload;
      }
    },
    changeTransactionDeadline(state, action: PayloadAction<number>) {
      state.transactionDeadline = action.payload;
    },
    changeChainId(state, action: PayloadAction<number>) {
      state.chainId = action.payload;
    },
  },
});

const selectors = (function () {
  const getState = (state: RootState) => state.user;

  const selectTheme = createSelector(getState, (state) => state.theme);
  const selectMultihop = createSelector(getState, (state) => state.multihop);
  const selectSlippage = createSelector(getState, (state) => state.slippage);
  const selectTransactionDeadline = createSelector(getState, (state) => state.transactionDeadline);
  const selectChainId = createSelector(getState, (state) => state.chainId);

  return {
    selectTheme,
    selectMultihop,
    selectSlippage,
    selectTransactionDeadline,
    selectChainId,
  };
})();

export default {
  actions,
  reducer,
  selectors,
};
