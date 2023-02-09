export type SerializedToken = {
  chainId: number;
  address: string;
  decimals: number;
  symbol?: string;
  name?: string;
  logoURI?: string;
  tags?: string[];
};

export type SerializedPair = {
  token0: SerializedToken;
  token1: SerializedToken;
};

export interface TokenState {
  tokens: {
    [chainId: number]: {
      [address: string]: SerializedToken;
    };
  };

  pairs: {
    [chainId: number]: {
      [address01: string]: SerializedPair;
    };
  };

  timestamp: number;
}
