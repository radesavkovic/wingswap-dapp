import { Token } from '@wingsswap/sdk';
import { Flex, FlexProps, Text } from 'theme-ui';

import TokenLogo from '../logos/token.logo';

interface Props extends Omit<FlexProps, 'sx'> {
  token0: Token;
  token1: Token;
  token0Price: string;
  token1Price: string;
}

export default function PoolPriceBlock(props: Props) {
  const { className, token0, token1, token0Price, token1Price } = props;
  return (
    <Flex className={className} sx={{ flexDirection: 'column' }}>
      <Flex
        sx={{
          paddingX: 16,
          marginBottom: 16,
          alignItems: 'center',
          borderRadius: 'lg',
          backgroundColor: 'dark.transparent',
        }}
      >
        <TokenLogo currency={token0} sx={{ marginRight: 12 }} />
        <Text>{`${token0Price}`}</Text>
      </Flex>
      <Flex
        sx={{
          paddingX: 16,
          alignItems: 'center',
          borderRadius: 'lg',
          backgroundColor: 'dark.transparent',
        }}
      >
        <TokenLogo currency={token1} sx={{ marginRight: 12 }} />
        <Text>{`${token1Price}`}</Text>
      </Flex>
    </Flex>
  );
}
