import { AnyAction, createReducer } from '@reduxjs/toolkit';
import { createContext, Dispatch, PropsWithChildren, useContext, useEffect, useReducer } from 'react';

import useAllPairs from './hooks/useAllPairs';
import useAllTokens from './hooks/useAllTokens';
import useChartData from './hooks/useChartData';
import useEthPrice from './hooks/useEthPrice';
import usePairData from './hooks/usePairData';
import usePairListForRender from './hooks/usePairListForRender';
import useTokenData from './hooks/useTokenData';
import useTokenListForRender from './hooks/useTokenListForRender';
import useWatchedData from './hooks/useWatchedData';
import {
  actions as globalActions,
  addCases as addGlobalCases,
  initialState as initialGlobalState,
} from './reducers/global';
import { actions as pairActions, addCases as addPairCases, initialState as initialPairState } from './reducers/pair';
import {
  actions as tokenActions,
  addCases as addTokenCases,
  initialState as initialTokenState,
} from './reducers/token';
import { GraphContext } from './reducers/types';
import { actions as userActions, addCases as addUserCases, getSavedUserState } from './reducers/user';

const initialState = {
  global: initialGlobalState,
  pair: initialPairState,
  token: initialTokenState,
  user: getSavedUserState(),
};

const GraphCtx = createContext({ state: initialState, dispatch: () => {} } as {
  state: GraphContext;
  dispatch: Dispatch<AnyAction>;
});

const actions = {
  global: globalActions,
  pair: pairActions,
  token: tokenActions,
  user: userActions,
};

const reducer = createReducer(initialState, (builder) => {
  addGlobalCases(builder);
  addPairCases(builder);
  addTokenCases(builder);
  addUserCases(builder);
});

const GraphProvider = ({ children }: PropsWithChildren<{}>) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  if (process.env.NODE_ENV !== 'production') {
    console.log('---- GraphProvider ----');
    console.log(state);
  }

  useEffect(() => {
    const key = 'graphs/user';
    localStorage.setItem(key, JSON.stringify({ ...state.user }));
  }, [state.user]);

  return <GraphCtx.Provider value={{ state, dispatch }}>{children}</GraphCtx.Provider>;
};

function useDispatch(): Dispatch<AnyAction> {
  const { dispatch } = useContext(GraphCtx);
  return dispatch;
  
}

function useSelector<T>(selector: (ctx: GraphContext) => T): T {
  const { state } = useContext(GraphCtx);
  return selector(state);
}

const hooks = {
  global: {
    useChartData: useChartData,
    useEthPrice: useEthPrice,
  },
  pair: {
    useAllPairs: useAllPairs,
    usePairData: usePairData,
    usePairListForRender: usePairListForRender,
  },
  token: {
    useAllTokens: useAllTokens,
    useTokenData: useTokenData,
    useTokenListForRender: useTokenListForRender,
  },
  user: {
    useWatchedData: useWatchedData,
  },
};

const graphs = {
  actions,
  hooks,
  useDispatch,
  useSelector,

  Provider: GraphProvider,
} as const;

export default graphs;
