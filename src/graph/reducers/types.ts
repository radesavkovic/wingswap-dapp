import { TimeframeOptions } from '../constants';

export interface EthPrice {
  currentDayEthPrice: number;
  lastDayEthPrice: number;
  ethPriceChange: number;
}

export interface FactoryData {
  pairCount: number;
  totalVolumeUSD: string;
  totalVolumeETH: string;
  totalLiquidityUSD: number;
  totalLiquidityETH: number;
  txCount: string;
  untrackedVolumeUSD: string;

  oneDayVolumeUSD: number;
  oneWeekVolume: number;
  weeklyVolumeChange: number;
  volumeChangeUSD: number;
  liquidityChangeUSD: number;
  oneDayTxns: number;
  txnChange: number;
}

export interface GlobalState {
  ofChain: {
    [chainId: number]: {
      ethPrice: EthPrice;
      timeFrame: TimeframeOptions;
      chartData: {
        daily: {
          id: string;
          date: number;
          dailyVolumeETH: string;
          dailyVolumeUSD: string;
          totalLiquidityETH: string;
          totalLiquidityUSD: string;
        }[];
        weekly: {
          date: number;
          weeklyVolumeUSD: number;
        }[];
      };
      factoryData: FactoryData;
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
      allTokens: { id: string; name: string; symbol: string; totalLiquidity: string }[];
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
    };
  };
}

export type TokenInfo = {
  id: string;
  name: string;
  symbol: string;
  decimals: number;
  derivedETH: number;
  totalLiquidity: number;
};

export type PairData = {
  id: string;
  createdAtTimestamp: number;
  liquidityChangeUSD: number;
  oneDayVolumeUSD: number;
  oneDayVolumeUntracked: number;
  oneWeekVolumeUSD: number;
  oneWeekVolumeUntracked: number;
  reserve0: number;
  reserve1: number;
  reserveETH: number;
  reserveUSD: number;
  token0Price: number;
  token1Price: number;
  totalSupply: number;
  trackedReserveETH: number;
  trackedReserveUSD: number;
  txCount: number;
  untrackedVolumeUSD: number;
  volumeChangeUSD: number;
  volumeChangeUntracked: number;
  volumeUSD: number;
  token0: TokenInfo;
  token1: TokenInfo;
};

export interface PairState {
  ofChain: {
    [chainId: number]: {
      byAddress: {
        [address: string]: PairData;
      };
    };
  };
}

export type TokenDayData = {
  id: string;
  name: string;
  symbol: string;
  derivedETH: number;
  totalLiquidity: number;
  tradeVolume: number;
  tradeVolumeUSD: number;
  txCount: number;
  untrackedVolumeUSD: number;
};

export type TokenData = {
  id: string;
  name: string;
  symbol: string;
  decimals: number;
  derivedETH: number;
  liquidityChangeUSD: number;
  oneDayTxns: number;
  oneDayVolumeUSD: number;
  oneDayVolumeETH: number;
  priceChangeUSD: number;
  priceUSD: number;
  totalLiquidity: number;
  totalLiquidityUSD: number;
  tradeVolume: number;
  tradeVolumeUSD: number;
  txCount: number;
  txnChange: number;
  untrackedVolumeUSD: number;
  volumeChangeUSD: number;
  oneDayVolumeUT: number;
  volumeChangeUT: number;
  oneDayData: TokenDayData;
  twoDayData: TokenDayData;
};

export interface TokenState {
  ofChain: {
    [chainId: number]: {
      byAddress: {
        [address: string]: TokenData;
      };
    };
  };
}

export interface UserState {
  ofChain: {
    [chainId: number]: {
      watchLists: {
        pairs: {
          [address: string]: number;
        };
        tokens: {
          [address: string]: number;
        };
      };
    };
  };
}

export interface GraphContext {
  global: GlobalState;
  pair: PairState;
  token: TokenState;
  user: UserState;
}

export type Transaction = {
  mints: Mint[];
  burns: Burn[];
  swaps: Swap[];
};

export type Mint = {
  transaction: {
    id: string;
    timestamp: string;
  };
  pair: {
    token0: {
      id: string;
      symbol: string;
      name: string;
      decimals: number;
    };
    token1: {
      id: string;
      symbol: string;
      name: string;
      decimals: number;
    };
  };
  to: string;
  liquidity: string;
  amount0: string;
  amount1: string;
  amountUSD: string;
};

export type Burn = {
  transaction: {
    id: string;
    timestamp: string;
  };
  pair: {
    token0: {
      id: string;
      symbol: string;
      name: string;
      decimals: number;
    };
    token1: {
      id: string;
      symbol: string;
      name: string;
      decimals: number;
    };
  };
  sender: string;
  liquidity: string;
  amount0: string;
  amount1: string;
  amountUSD: string;
};

export type Swap = {
  transaction: {
    id: string;
    timestamp: string;
  };
  pair: {
    token0: {
      id: string;
      symbol: string;
      name: string;
      decimals: number;
    };
    token1: {
      id: string;
      symbol: string;
      name: string;
      decimals: number;
    };
  };
  amount0In: string;
  amount0Out: string;
  amount1In: string;
  amount1Out: string;
  amountUSD: string;
  to: string;
};

export enum TransactionType {
  ALL = 'ALL',
  SWAP = 'SWAP',
  ADD = 'ADD',
  REMOVE = 'REMOVE',
}

export type TransactionRender = {
  hash: string;
  timestamp: string;
  type: TransactionType;
  token0Amount: string;
  token1Amount: string;
  account: string;
  amountUSD: string;
  token0Symbol: string;
  token1Symbol: string;
};
