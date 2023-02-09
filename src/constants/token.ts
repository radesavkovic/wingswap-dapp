import { SupportedChainId, Token } from '@wingsswap/sdk';
import { TokenInfo } from '@manekiswap/token-lists';

import { SerializedToken } from '../reducers/token/types';

export const utils = (function () {
  const fromSerializedToken = (token: SerializedToken): Token => {
    return new Token(token.chainId, token.address, token.decimals, token.symbol, token.name);
  };

  const fromTokenInfo = (token: TokenInfo): Token => {
    return new Token(token.chainId, token.address, token.decimals, token.symbol, token.name);
  };

  const toSerializedToken = (token: Token): SerializedToken => {
    return {
      chainId: token.chainId,
      address: token.address,
      decimals: token.decimals,
      symbol: token.symbol,
      name: token.name,
      logoURI: undefined,
    };
  };

  return {
    fromSerializedToken,
    fromTokenInfo,
    toSerializedToken,
  };
})();

export const DAI = {
  [SupportedChainId.MAINNET]: new Token(
    SupportedChainId.MAINNET,
    '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    18,
    'DAI',
    'Dai Stablecoin',
  ),
  [SupportedChainId.RINKEBY]: new Token(
    SupportedChainId.RINKEBY,
    '0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735',
    18,
    'DAI',
    'Dai Stablecoin',
  ),
  [SupportedChainId.SMART_CHAIN]: new Token(
    SupportedChainId.SMART_CHAIN,
    '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
    18,
    'DAI',
    'Dai Stablecoin',
  ),
};

export const USDC = {
  [SupportedChainId.MAINNET]: new Token(
    SupportedChainId.MAINNET,
    '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    6,
    'USDC',
    'USD//C',
  ),
  [SupportedChainId.RINKEBY]: new Token(
    SupportedChainId.RINKEBY,
    '0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b',
    6,
    'USDC',
    'USD//C',
  ),
  [SupportedChainId.SMART_CHAIN]: new Token(
    SupportedChainId.SMART_CHAIN,
    '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
    18,
    'USDC',
    'Binance-Peg USD Coin',
  ),
};

export const WING = {
  [SupportedChainId.SMART_CHAIN]: new Token(
    SupportedChainId.SMART_CHAIN,
    '0xc0fe33B654d13AF5a72C47Dc5a370674ba85b3E6',
    18,
    'XWIP',
    'WingsProtocol',
  )
}

export const USDT = {
  [SupportedChainId.MAINNET]: new Token(
    SupportedChainId.MAINNET,
    '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    6,
    'USDT',
    'Tether USD',
  ),
  [SupportedChainId.RINKEBY]: new Token(
    SupportedChainId.RINKEBY,
    '0xD9BA894E0097f8cC2BBc9D24D308b98e36dc6D02',
    6,
    'USDT',
    'Tether USD',
  ),
  [SupportedChainId.SMART_CHAIN]: new Token(
    SupportedChainId.SMART_CHAIN,
    '0x55d398326f99059fF775485246999027B3197955',
    18,
    'USDT',
    'Tether USD',
  ),
};

export const WBTC = {
  [SupportedChainId.MAINNET]: new Token(
    SupportedChainId.MAINNET,
    '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    8,
    'WBTC',
    'Wrapped BTC',
  ),
  [SupportedChainId.RINKEBY]: new Token(
    SupportedChainId.RINKEBY,
    '0x577D296678535e4903D59A4C929B718e1D575e0A',
    8,
    'WBTC',
    'Wrapped BTC',
  ),
  [SupportedChainId.SMART_CHAIN]: new Token(
    SupportedChainId.SMART_CHAIN,
    '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c',
    18,
    'BTCB',
    'Binance-Peg BTCB Token',
  ),
};

export const CDAI = {
  [SupportedChainId.MAINNET]: new Token(
    SupportedChainId.MAINNET,
    '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643',
    8,
    'cDAI',
    'Compound Dai',
  ),
  [SupportedChainId.RINKEBY]: new Token(
    SupportedChainId.RINKEBY,
    '0x6D7F0754FFeb405d23C51CE938289d4835bE3b14',
    8,
    'cDAI',
    'Compound Dai',
  ),
};

export const CUSDC = {
  [SupportedChainId.MAINNET]: new Token(
    SupportedChainId.MAINNET,
    '0x39AA39c021dfbaE8faC545936693aC917d5E7563',
    8,
    'cUSDC',
    'Compound USD Coin',
  ),
  [SupportedChainId.RINKEBY]: new Token(
    SupportedChainId.RINKEBY,
    '0x5B281A6DdA0B271e91ae35DE655Ad301C976edb1',
    8,
    'cUSDC',
    'Compound USD Coin',
  ),
};
