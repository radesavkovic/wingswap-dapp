import { Flex, FlexProps, Heading, Text } from 'theme-ui';

import { formatDollarAmount } from '../../utils/numbers';
import Percentage from '../percentages/percentage';

interface Props extends Omit<FlexProps, 'sx'> {
  liquidityUSD: number;
  liquidityUSDChange: number;
  volumeUSD: number;
  volumeUSDChange: number;
}

export default function TokenLiquidityBlock(props: Props) {
  const { className, liquidityUSD, liquidityUSDChange, volumeUSD, volumeUSDChange } = props;
  return (
    <Flex className={className} sx={{ paddingX: 16, paddingTop: 16, paddingBottom: 24 }}>
      <Flex sx={{ flex: 1, flexDirection: 'column' }}>
        <Text sx={{ fontWeight: 'bold', color: 'white.200', marginBottom: 16 }}>Liquidity</Text>
        <Heading variant="styles.h6" sx={{ marginBottom: 'auto' }}>
          {formatDollarAmount(liquidityUSD)}
        </Heading>
        <Percentage value={liquidityUSDChange} />
      </Flex>

      <Flex sx={{ flex: 1, flexDirection: 'column' }}>
        <Text sx={{ fontWeight: 'bold', color: 'white.200', marginBottom: 16 }}>24h Trading Vol</Text>
        <Heading variant="styles.h6" sx={{ marginBottom: 'auto' }}>
          {formatDollarAmount(volumeUSD)}
        </Heading>
        <Percentage value={volumeUSDChange} />
      </Flex>
    </Flex>
  );
}
