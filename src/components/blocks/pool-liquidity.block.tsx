import { Flex, FlexProps, Heading, Text } from 'theme-ui';

import { mediaWidthTemplates } from '../../constants/media';
import Percentage from '../percentages/percentage';

interface Props extends Omit<FlexProps, 'sx'> {
  liquidity: string;
  liquidityChange: string;
  volume: string;
  volumeChange: string;
  fees: string;
}

export default function PoolLiquidityBlock(props: Props) {
  const { className, liquidity, liquidityChange, volume, volumeChange, fees } = props;
  return (
    <Flex
      className={className}
      sx={{
        flexDirection: 'row',
        paddingX: 16,
        paddingTop: 16,
        paddingBottom: 24,
        ...mediaWidthTemplates.upToExtraSmall({ flexDirection: 'column' }),
      }}
    >
      <Flex
        sx={{
          flex: 0.66,
          ...mediaWidthTemplates.upToExtraSmall({ flex: 1 }),
        }}
      >
        <Flex sx={{ flex: 1, flexDirection: 'column' }}>
          <Text sx={{ fontWeight: 'bold', color: 'white.200', marginBottom: 16 }}>Liquidity</Text>
          <Heading variant="styles.h6" sx={{ marginBottom: 'auto' }}>
            {liquidity}
          </Heading>
          <Percentage value={liquidityChange} />
        </Flex>

        <Flex sx={{ flex: 1, flexDirection: 'column' }}>
          <Text sx={{ fontWeight: 'bold', color: 'white.200', marginBottom: 16 }}>Volume 24h</Text>
          <Heading variant="styles.h6" sx={{ marginBottom: 'auto' }}>
            {volume}
          </Heading>
          <Percentage value={volumeChange} />
        </Flex>
      </Flex>

      <Flex
        sx={{ flex: 0.34, flexDirection: 'column', ...mediaWidthTemplates.upToExtraSmall({ flex: 1, marginTop: 36 }) }}
      >
        <Text sx={{ fontWeight: 'bold', color: 'white.200', marginBottom: 16 }}>Fees</Text>
        <Heading variant="styles.h6">{fees}</Heading>
        <Percentage value={volumeChange} />
      </Flex>
    </Flex>
  );
}
