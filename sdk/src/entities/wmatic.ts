/* eslint-disable prettier/prettier */

import { SupportedChainId } from '..'
import { Token } from './token'

/**
 * Known WMATIC implementation addresses, used in our implementation of Matic#wrapped
 */
export const WMATIC: { [chainId: number]: Token } = {
  // eslint-disable-next-line prettier/prettier
  [SupportedChainId.SMART_CHAIN]: new Token(
    56,
    '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
    18,
    'WBNB',
    'Wrapped BNB'
  ),
  [SupportedChainId.MUMBAI]: new Token(137, '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889', 18, 'WMATIC', 'Wrapped Matic')
}
