import { SupportedChainId } from '@wingsswap/sdk';

import { NETWORK_LABELS } from '../../constants/chains';

function toHex(chainId: number) {
  return '0x' + Number(chainId).toString(16);
}

function getChainIdInfo(chainId: number) {
  if (
    chainId === SupportedChainId.MAINNET ||
    chainId === SupportedChainId.ROPSTEN ||
    chainId === SupportedChainId.RINKEBY ||
    chainId === SupportedChainId.GÖRLI ||
    chainId === SupportedChainId.KOVAN
  )
    return {
      chainId: toHex(chainId),
    };

  if (chainId === SupportedChainId.SMART_CHAIN)
    return {
      chainId: toHex(chainId),
     info: {
        chainId: '0x38',
        chainName: 'BSC Mainnet',
        nativeCurrency: {
          name: 'BNB',
          symbol: 'BNB',
          decimals: 18,
        },
        rpcUrls: ['https://bsc-dataseed.binance.org/'],
        blockExplorerUrls: ['https://bscscan.com/'],
        iconUrls: [''],
      },
    };

  throw new Error('Unsupported chain ID');
}

export async function switchChain(newChainId: number) {
  const { chainId, info } = getChainIdInfo(newChainId);

  try {
    await window.ethereum?.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }],
    });
  } catch (error) {
    // This error code indicates that the chain has not been added to MetaMask.
    if ((error as any).code === 4902 && newChainId === SupportedChainId.SMART_CHAIN) {
      try {
        await window.ethereum?.request({
          method: 'wallet_addEthereumChain',
          params: [info],
        });
      } catch (error) {
        // handle "add" error
      }
    }
    // handle other "switch" errors
  }
}

export function getChainName(chainId: number) {
  return NETWORK_LABELS[chainId];
}
