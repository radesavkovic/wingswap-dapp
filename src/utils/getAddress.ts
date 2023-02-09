import { Token } from '@wingsswap/sdk';

import { parseAddress } from './addresses';

export function getAddress(token?: { address?: string; symbol?: string }) {
  if (!token) return undefined;
  if (token.symbol?.toUpperCase() === 'ETH') return 'ETH';
  if (token.symbol?.toUpperCase() === 'BNB') return 'BNB';
  return parseAddress((token as Token).address);
}

export function parseAddressFromURLParameter(urlParam: any): string {
  if (typeof urlParam === 'string') {
    const address = parseAddress(urlParam);
    if (address) return address;
    if (urlParam.toUpperCase() === 'ETH') return 'ETH';
    if (urlParam.toUpperCase() === 'BNB') return 'BNB';
  }
  return '';
}
