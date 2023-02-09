import { ActionReducerMapBuilder, createAction } from '@reduxjs/toolkit';

import initializeState from '../utils/initializeState';
import { GraphContext, PairData, PairState } from './types';

export const initialState: PairState = {
  ofChain: initializeState({
    byAddress: {},
  }),
};

export const actions = {
  updateTopPairs: createAction<{ topPairs: PairData[]; chainId: number }>('pair/updateTopPairs'),
  updatePair: createAction<{ pair: PairData; chainId: number }>('pair/updatePair'),
};

export const addCases = (builder: ActionReducerMapBuilder<GraphContext>) => {
  builder
    .addCase(actions.updateTopPairs, (state, { payload: { topPairs, chainId } }) => {
      state.pair.ofChain[chainId].byAddress = topPairs.reduce((memo, pair) => {
        return { ...memo, [pair.id]: pair };
      }, {});
    })
    .addCase(actions.updatePair, (state, { payload: { pair, chainId } }) => {
      state.pair.ofChain[chainId].byAddress[pair.id] = {
        ...state.pair.ofChain[chainId].byAddress[pair.id],
        ...pair,
      };
    });
};
