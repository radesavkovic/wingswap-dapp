import useActiveWeb3React from '../../hooks/useActiveWeb3React';
import graphs from '..';

export default function useWatchedData() {
  const { chainId } = useActiveWeb3React();
  const { pairs, tokens } = graphs.useSelector((state) => state.user.ofChain[chainId ?? -1].watchLists);
  return { pairs, tokens };
}
