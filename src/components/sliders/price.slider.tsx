import numbro from 'numbro';
import { useState } from 'react';
import { Button, Flex, FlexProps, Text } from 'theme-ui';

import { mediaWidthTemplates } from '../../constants/media';

interface Props extends Omit<FlexProps, 'sx'> {
  basePrice: number;
  title: string;
  numerator?: string;
  denominator?: string;
  fee: number;
}

export default function PriceSlider(props: Props) {
  const { basePrice, className, title, numerator = '', denominator = '', fee } = props;
  const [value, setValue] = useState(0);

  return (
    <Flex
      className={className}
      sx={{
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'transparent',
        border: '1px solid rgba(92, 92, 92, 0.3)',
        borderRadius: 'base',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '8px',
        paddingBottom: 12,
        paddingX: 30,
      }}
    >
      <Text sx={{ color: 'white.300', fontSize: 0 }}>{title}</Text>
      <Text sx={{ color: value > 0 ? 'white.400' : 'white.200', fontSize: 2 }}>
        {numbro((1 + value) * basePrice).format({ thousandSeparated: true, mantissa: 4 })}
      </Text>
      <Text sx={{ color: 'white.200', fontSize: 0 }}>{`${numerator || ''} per ${denominator}`.trim()}</Text>
      <Flex sx={{ marginTop: '8px' }}>
        <Button
          variant="small-link"
          sx={{
            height: 28,
            width: 80,
            backgroundColor: 'dark.400',
            marginRight: 12,
            ...mediaWidthTemplates.upToExtraSmall({ width: 48 }),
          }}
          onClick={() => {
            setValue(value - fee / 100);
          }}
        >
          {`-${fee}%`}
        </Button>
        <Button
          variant="small-link"
          sx={{
            height: 28,
            width: 80,
            backgroundColor: 'dark.400',
            ...mediaWidthTemplates.upToExtraSmall({ width: 48 }),
          }}
          onClick={() => {
            setValue(value + fee / 100);
          }}
        >
          {`+${fee}%`}
        </Button>
      </Flex>
    </Flex>
  );
}
