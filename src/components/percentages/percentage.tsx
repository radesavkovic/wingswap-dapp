import { useMemo } from 'react';
import { Text, TextProps } from 'theme-ui';

import { formattedPercent } from '../../utils/numbers';

interface Props extends Omit<TextProps, 'sx'> {
  value: number | string;
  decimals?: number;
}

export default function Percentage(props: Props) {
  const { className, value, decimals = 2 } = props;
  let floatValue = 0;

  if (typeof value === 'string') {
    floatValue = parseFloat(value.replace('%', ''));
  } else {
    floatValue = parseFloat(value.toFixed(decimals));
  }

  const color = useMemo(() => {
    if (floatValue < 0) return 'red.200';
    else if (floatValue > 0) return 'green.200';
    else return 'white.200';
  }, [floatValue]);

  return (
    <Text className={className} sx={{ color: color }}>
      {floatValue < 0 && '↓ '}
      {floatValue > 0 && '↑ '}
      {(typeof value === 'string' ? value : formattedPercent(value)).replace('-', '').replace('+', '')}
    </Text>
  );
}
