import { ActionReducerMapBuilder, createAction } from '@reduxjs/toolkit';

import { TimeframeOptions } from '../constants';
import initializeState from '../utils/initializeState';
import { EthPrice, FactoryData, GlobalState, GraphContext } from './types';

export const initialState: GlobalState = {
  ofChain: initializeState(),
};

export const actions = {
  updateEthPrice: createAction<{ ethPrice: EthPrice; chainId: number }>('global/updateEthPrice'),
  updateGlobalData: createAction<{ factoryData: FactoryData; chainId: number }>('global/updateGlobalData'),
  updateTimeFrame: createAction<{ timeFrame: TimeframeOptions; chainId: number }>('global/updateTimeFrame'),
  updateChartData: createAction<{
    daily: {
      id: string;
      date: number;
      dailyVolumeETH: string;
      dailyVolumeUSD: string;
      totalLiquidityETH: string;
      totalLiquidityUSD: string;
    }[];
    weekly: { date: number; weeklyVolumeUSD: number }[];
    chainId: number;
  }>('global/updateChartData'),
  updateAllPairs: createAction<{
    allPairs: {
      id: string;
      token0: {
        id: string;
        symbol: string;
        name: string;
      };
      token1: {
        id: string;
        symbol: string;
        name: string;
      };
    }[];
    chainId: number;
  }>('global/updateAllPairs'),
  updateAllTokens: createAction<{
    allTokens: { id: string; name: string; symbol: string; totalLiquidity: string }[];
    chainId: number;
  }>('global/updateAllTokens'),
  updateTransactions: createAction<{
    transactions: {
      mints: {
        transaction: {
          id: string;
          timestamp: string;
        };
        pair: {
          token0: {
            id: string;
            symbol: string;
          };
          token1: {
            id: string;
            symbol: string;
          };
        };
        to: string;
        liquidity: string;
        amount0: string;
        amount1: string;
        amountUSD: string;
      }[];
      burns: {
        transaction: {
          id: string;
          timestamp: string;
        };
        pair: {
          token0: {
            id: string;
            symbol: string;
          };
          token1: {
            id: string;
            symbol: string;
          };
        };
        se: string;
        liquidity: string;
        amount0: string;
        amount1: string;
        amountUSD: string;
      }[];
      swaps: {
        transaction: {
          id: string;
          timestamp: string;
        };
        pair: {
          token0: {
            id: string;
            symbol: string;
          };
          token1: {
            id: string;
            symbol: string;
          };
        };
        amount0In: string;
        amount0Out: string;
        amount1In: string;
        amount1Out: string;
        amountUSD: string;
        to: string;
      }[];
    };
    chainId: number;
  }>('global/updateTransactions'),
};

export const addCases = (builder: ActionReducerMapBuilder<GraphContext>) => {
  builder
    .addCase(actions.updateEthPrice, (state, { payload: { ethPrice, chainId } }) => {
      state.global.ofChain[chainId].ethPrice = ethPrice;
    })
    .addCase(actions.updateGlobalData, (state, { payload: { factoryData, chainId } }) => {
      state.global.ofChain[chainId].factoryData = factoryData;
    })
    .addCase(actions.updateTimeFrame, (state, { payload: { timeFrame, chainId } }) => {
      state.global.ofChain[chainId].timeFrame = timeFrame;
    })
    .addCase(actions.updateChartData, (state, { payload: { daily, weekly, chainId } }) => {
      state.global.ofChain[chainId].chartData = { daily, weekly };
    })
    .addCase(actions.updateAllPairs, (state, { payload: { allPairs, chainId } }) => {
      state.global.ofChain[chainId].allPairs = allPairs;
    })
    .addCase(actions.updateAllTokens, (state, { payload: { allTokens, chainId } }) => {
      state.global.ofChain[chainId].allTokens = allTokens;
    })
    .addCase(actions.updateTransactions, (state, { payload: { transactions, chainId } }) => {
      state.global.ofChain[chainId].transactions = transactions;
    });
};
