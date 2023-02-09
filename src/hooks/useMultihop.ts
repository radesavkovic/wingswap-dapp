import { selectors } from '../reducers';
import { useAppSelector } from '../reducers/hooks';

export default function useMultihop() {
  return useAppSelector(selectors.user.selectMultihop);
}
