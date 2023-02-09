import { Currency, NativeCurrency, SupportedChainId, Token, WETH9, WMATIC } from '@wingsswap/sdk';

export const WETH9_EXTENDED: { [chainId: number]: Token } = {
  ...WETH9,
  [SupportedChainId.RINKEBY]: new Token(
    SupportedChainId.RINKEBY,
    '0x4501e78FA1276fe0d26B1fd8d1C5267B7642cA11',
    18,
    'WETH',
    'Wrapped Ether',
  ),
};

export const WMATIC_EXTENDED: { [chainId: number]: Token } = {
  ...WMATIC,
};

export function getWrapped(appChainId: number) {
  if (appChainId === SupportedChainId.SMART_CHAIN) return WMATIC_EXTENDED;
  return WETH9_EXTENDED;
}

export class ExtendedNative extends NativeCurrency {
  protected constructor(chainId: number) {
    if (chainId === SupportedChainId.SMART_CHAIN) {
      super(chainId, 18, 'BNB', 'BNB');
    } else {
      super(chainId, 18, 'ETH', 'Ether');
    }
  }

  public get wrapped(): Token {
    if (this.symbol === 'BNB') {
      if (this.chainId in WMATIC_EXTENDED) return WMATIC_EXTENDED[this.chainId];
      throw new Error('Unsupported chain ID');
    } else if (this.symbol === 'ETH') {
      if (this.chainId in WETH9_EXTENDED) return WETH9_EXTENDED[this.chainId];
      throw new Error('Unsupported chain ID');
    }
    throw new Error('Unsupported chain ID');
  }

  private static _cache: { [chainId: number]: ExtendedNative } = {};

  public static onChain(chainId: number): ExtendedNative {
    return this._cache[chainId] ?? (this._cache[chainId] = new ExtendedNative(chainId));
  }

  public equals(other: Currency): boolean {
    return other.isNative && other.chainId === this.chainId;
  }
}

export function isNativeCurrency(address?: string) {
  return address?.toUpperCase() === 'ETH' || address?.toUpperCase() === 'BNB';
}
