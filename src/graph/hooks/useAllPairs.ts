import { useMemo } from 'react';

import useActiveWeb3React from '../../hooks/useActiveWeb3React';
import graphs from '..';

export default function useAllPairs() {
  const { chainId } = useActiveWeb3React();
  const pairs = graphs.useSelector((state) => state.pair.ofChain[chainId ?? -1].byAddress);

  return useMemo(() => {
    return pairs ? Object.values(pairs) : [];
  }, [pairs]);
}
