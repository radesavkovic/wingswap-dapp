import { useMemo } from 'react';

import useActiveWeb3React from '../../hooks/useActiveWeb3React';
import graphs from '..';

export default function useAllTokens() {
  const { chainId } = useActiveWeb3React();
  const tokens = graphs.useSelector((state) => state.token.ofChain[chainId ?? -1].byAddress);

  return useMemo(() => {
    return tokens ? Object.values(tokens) : [];
  }, [tokens]);
}
