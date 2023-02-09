import { SupportedChainId, Token } from '@wingsswap/sdk';

import { ExtendedNative, WETH9_EXTENDED, WMATIC_EXTENDED } from './extended-native';
import { DAI, USDC, USDT, WBTC, WING } from './token';

type ChainTokenList = {
  readonly [chainId: number]: Token[];
};

const WETH_ONLY: ChainTokenList = Object.fromEntries(
  Object.entries(WETH9_EXTENDED).map(([key, value]) => [key, [value]]),
);

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WETH_ONLY,
  [SupportedChainId.MAINNET]: [
    WETH9_EXTENDED[SupportedChainId.MAINNET],
    DAI[SupportedChainId.MAINNET],
    USDC[SupportedChainId.MAINNET],
    USDT[SupportedChainId.MAINNET],
    WBTC[SupportedChainId.MAINNET],
  ],
  [SupportedChainId.RINKEBY]: [
    WETH9_EXTENDED[SupportedChainId.RINKEBY],
    DAI[SupportedChainId.RINKEBY],
    USDC[SupportedChainId.RINKEBY],
    USDT[SupportedChainId.RINKEBY],
    WBTC[SupportedChainId.RINKEBY],
    WETH9_EXTENDED[SupportedChainId.RINKEBY],
  ],
  [SupportedChainId.SMART_CHAIN]: [
    WMATIC_EXTENDED[SupportedChainId.SMART_CHAIN],
    DAI[SupportedChainId.SMART_CHAIN],
    USDC[SupportedChainId.SMART_CHAIN],
    USDT[SupportedChainId.SMART_CHAIN],
    WBTC[SupportedChainId.SMART_CHAIN],
  ],
};

export const ADDITIONAL_BASES: { [chainId: number]: { [tokenAddress: string]: Token[] } } = {
  [SupportedChainId.MAINNET]: {},
  [SupportedChainId.SMART_CHAIN]: {},
};

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId: number]: { [tokenAddress: string]: Token[] } } = {
  [SupportedChainId.MAINNET]: {},
  [SupportedChainId.SMART_CHAIN]: {},
};

/**
 * Shows up in the currency select for swap and add liquidity
 */
export const COMMON_BASES = {
  [SupportedChainId.MAINNET]: [
    ExtendedNative.onChain(SupportedChainId.MAINNET),
    DAI[SupportedChainId.MAINNET],
    USDC[SupportedChainId.MAINNET],
    USDT[SupportedChainId.MAINNET],
    WBTC[SupportedChainId.MAINNET],
    WETH9_EXTENDED[SupportedChainId.MAINNET],
  ],
  [SupportedChainId.ROPSTEN]: [
    ExtendedNative.onChain(SupportedChainId.ROPSTEN),
    WETH9_EXTENDED[SupportedChainId.ROPSTEN],
  ],
  [SupportedChainId.RINKEBY]: [
    ExtendedNative.onChain(SupportedChainId.RINKEBY),
    DAI[SupportedChainId.RINKEBY],
    USDC[SupportedChainId.RINKEBY],
    USDT[SupportedChainId.RINKEBY],
    WBTC[SupportedChainId.RINKEBY],
    WETH9_EXTENDED[SupportedChainId.RINKEBY],
  ],
  [SupportedChainId.GÖRLI]: [ExtendedNative.onChain(SupportedChainId.GÖRLI), WETH9_EXTENDED[SupportedChainId.GÖRLI]],
  [SupportedChainId.KOVAN]: [ExtendedNative.onChain(SupportedChainId.KOVAN), WETH9_EXTENDED[SupportedChainId.KOVAN]],
  [SupportedChainId.SMART_CHAIN]: [
    ExtendedNative.onChain(SupportedChainId.SMART_CHAIN),
    WING[SupportedChainId.SMART_CHAIN],
    DAI[SupportedChainId.SMART_CHAIN],
    USDC[SupportedChainId.SMART_CHAIN],
    USDT[SupportedChainId.SMART_CHAIN],
    WBTC[SupportedChainId.SMART_CHAIN],
    WMATIC_EXTENDED[SupportedChainId.SMART_CHAIN],
  ],
};
