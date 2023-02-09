import { useMemo } from 'react';

import useActiveWeb3React from './useActiveWeb3React';
import { useArgentWalletDetectorContract } from './useContract';
import { NEVER_RELOAD } from './web3/useCallsData';
import useSingleCallResult from './web3/useSingleCallResult';

export default function useIsArgentWallet(): boolean {
  const { account } = useActiveWeb3React();
  const argentWalletDetector = useArgentWalletDetectorContract();
  const inputs = useMemo(() => [account ?? undefined], [account]);
  const call = useSingleCallResult(argentWalletDetector, 'isArgentWallet', inputs, NEVER_RELOAD);
  return call?.result?.[0] ?? false;
}
