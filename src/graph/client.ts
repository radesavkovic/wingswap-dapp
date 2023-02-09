import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { SupportedChainId } from '@wingsswap/sdk';

export default function getClients(chainId?: number): {
  blockClient?: ApolloClient<NormalizedCacheObject>;
  dataClient?: ApolloClient<NormalizedCacheObject>;
  healthClient?: ApolloClient<NormalizedCacheObject>;
} {
  if (chainId === SupportedChainId.RINKEBY) {
    return {
      blockClient: new ApolloClient({
        uri: 'https://api.thegraph.com/subgraphs/name/blocklytics/rinkeby-blocks',
        cache: new InMemoryCache(),
        queryDeduplication: true,
      }),
      dataClient: new ApolloClient({
        uri: 'https://api.thegraph.com/subgraphs/name/croccifixio-maneki/manekirinkeby',
        cache: new InMemoryCache(),
        queryDeduplication: true,
      }),
    };
  } else if (chainId === SupportedChainId.SMART_CHAIN) {
    return {
      blockClient: new ApolloClient({
        uri: 'https://api.thegraph.com/subgraphs/name/blockartist/cheeseblock',
        cache: new InMemoryCache(),
        queryDeduplication: true,
      }),
      dataClient: new ApolloClient({
        uri: 'https://api.thegraph.com/subgraphs/name/slowworks/wingswap',
        cache: new InMemoryCache(),
        queryDeduplication: true,
      }),
    };
  }

  return {};
}
