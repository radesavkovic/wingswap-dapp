import { ActionReducerMapBuilder, createAction } from '@reduxjs/toolkit';

import initializeState from '../utils/initializeState';
import { GraphContext, TokenData, TokenState } from './types';

export const initialState: TokenState = {
  ofChain: initializeState({
    byAddress: {},
  }),
};

export const actions = {
  updateTopTokens: createAction<{ topTokens: TokenData[]; chainId: number }>('token/updateTopTokens'),
  updateToken: createAction<{ token: TokenData; chainId: number }>('token/updateToken'),
};

export const addCases = (builder: ActionReducerMapBuilder<GraphContext>) => {
  builder
    .addCase(actions.updateTopTokens, (state, { payload: { topTokens, chainId } }) => {
      state.token.ofChain[chainId].byAddress = topTokens.reduce((memo, token) => {
        return { ...memo, [token.id]: token };
      }, {});
    })
    .addCase(actions.updateToken, (state, { payload: { token, chainId } }) => {
      state.token.ofChain[chainId].byAddress[token.id] = {
        ...state.token.ofChain[chainId].byAddress[token.id],
        ...token,
      };
    });
};
