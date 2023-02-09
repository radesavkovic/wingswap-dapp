import { selectors } from '../reducers';
import { useAppSelector } from '../reducers/hooks';

export default function useUserConfig() {
  const multihop = useAppSelector(selectors.user.selectMultihop);
  const slippage = useAppSelector(selectors.user.selectSlippage);
  const transactionDeadline = useAppSelector(selectors.user.selectTransactionDeadline);
  return { multihop, slippage, transactionDeadline };
}
