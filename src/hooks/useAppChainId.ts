import { selectors } from '../reducers';
import { useAppSelector } from '../reducers/hooks';

export default function useAppChainId() {
  const chainId = useAppSelector(selectors.user.selectChainId);
  return chainId;
}
