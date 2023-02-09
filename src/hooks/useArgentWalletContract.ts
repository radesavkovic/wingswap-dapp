import ArgentWalletContractABI from '../abis/argent-wallet.json';
import { ArgentWallet } from '../abis/types';
import useActiveWeb3React from './useActiveWeb3React';
import { useContract } from './useContract';
import useIsArgentWallet from './useIsArgentWallet';

export function useArgentWalletContract(): ArgentWallet | null {
  const { account } = useActiveWeb3React();
  const isArgentWallet = useIsArgentWallet();
  return useContract<ArgentWallet>(isArgentWallet ? account ?? undefined : undefined, ArgentWalletContractABI, true);
}
