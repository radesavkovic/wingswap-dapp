import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { useMemo } from 'react';

import useAppChainId from '../../hooks/useAppChainId';
import getClients from '../client';

export function useClients(): {
  dataClient?: ApolloClient<NormalizedCacheObject>;
  blockClient?: ApolloClient<NormalizedCacheObject>;
  healthClients?: ApolloClient<NormalizedCacheObject>;
} {
  const appChainId = useAppChainId();
  return useMemo(() => getClients(appChainId), [appChainId]);
}
