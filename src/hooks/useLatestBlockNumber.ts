import { selectors } from '../reducers';
import { useAppSelector } from '../reducers/hooks';
import useActiveWeb3React from './useActiveWeb3React';

export default function useLatestBlockNumber() {
  const { chainId } = useActiveWeb3React();
  return useAppSelector(selectors.application.selectBlockNumberMap)[chainId ?? -1];
}
