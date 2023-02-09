import { Token } from '@wingsswap/sdk';
import { Flex, FlexProps, Text } from 'theme-ui';

import TokenLogo from '../logos/token.logo';

interface Props extends Omit<FlexProps, 'sx'> {
  token0: Token;
  token1: Token;
  pooledToken0: string;
  pooledToken1: string;
}

export default function PoolLockBlock(props: Props) {
  const { className, token0, token1, pooledToken0, pooledToken1 } = props;
  return (
    <Flex className={className} sx={{ paddingX: 16, paddingTop: 16, paddingBottom: 24 }}>
      <Text sx={{ fontWeight: 'bold', color: 'white.200', marginBottom: 'auto' }}>Total Pooled Tokens</Text>
      <Flex sx={{ alignItems: 'center', marginBottom: 16 }}>
        <TokenLogo currency={token0} sx={{ marginRight: 12 }} />
        <Flex sx={{ flex: 1, justifyContent: 'space-between' }}>
          <Text sx={{ color: 'white.300' }}>{token0.symbol}</Text>
          <Text sx={{ color: 'white.300' }}>{pooledToken0}</Text>
        </Flex>
      </Flex>
      <Flex sx={{ alignItems: 'center' }}>
        <TokenLogo currency={token1} sx={{ marginRight: 12 }} />
        <Flex sx={{ flex: 1, justifyContent: 'space-between' }}>
          <Text sx={{ color: 'white.300' }}>{token1.symbol}</Text>
          <Text sx={{ color: 'white.300' }}>{pooledToken1}</Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
