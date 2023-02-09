import { ActionReducerMapBuilder, createAction } from '@reduxjs/toolkit';

import initializeState from '../utils/initializeState';
import { GraphContext, UserState } from './types';

export const getSavedUserState = (): UserState => {
  const key = 'graphs/user';
  const savedUserConfig = localStorage.getItem(key);
  try {
    return savedUserConfig ? JSON.parse(savedUserConfig) : initialState;
  } catch (error) {
    console.error('userConfig malformed', error);
    return initialState;
  }
};

export const initialState: UserState = {
  ofChain: initializeState({
    watchLists: {
      pairs: {},
      tokens: {},
    },
  }),
};

export const actions = {
  updateWatchedPair: createAction<{ pairAddress: string; chainId: number }>('user/updateWatchedPair'),
  updateWatchedToken: createAction<{ tokenAddress: string; chainId: number }>('user/updateWatchedToken'),
};

export const addCases = (builder: ActionReducerMapBuilder<GraphContext>) => {
  builder
    .addCase(actions.updateWatchedPair, (state, { payload: { pairAddress, chainId } }) => {
      if (state.user.ofChain[chainId].watchLists.pairs[pairAddress]) {
        delete state.user.ofChain[chainId].watchLists.pairs[pairAddress];
      } else {
        state.user.ofChain[chainId].watchLists.pairs[pairAddress] = Date.now().valueOf();
      }
    })
    .addCase(actions.updateWatchedToken, (state, { payload: { tokenAddress, chainId } }) => {
      if (state.user.ofChain[chainId].watchLists.tokens[tokenAddress]) {
        delete state.user.ofChain[chainId].watchLists.tokens[tokenAddress];
      } else {
        state.user.ofChain[chainId].watchLists.tokens[tokenAddress] = Date.now().valueOf();
      }
    });
};
