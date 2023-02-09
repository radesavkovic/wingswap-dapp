import { selectors } from '../reducers';
import { useAppSelector } from '../reducers/hooks';

export default function useTheme() {
  const theme = useAppSelector(selectors.user.selectTheme);
  return theme;
}
