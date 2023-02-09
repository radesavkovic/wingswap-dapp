import { MouseEvent, useCallback } from 'react';
import { Button, ButtonProps, Text } from 'theme-ui';

interface Props extends Omit<ButtonProps, 'sx'> {
  value: number;
  active: boolean;
  title: string;
  subtitle: string;
  onToggle: (value: number) => void;
}

export default function FeeToggle(props: Props) {
  const { className, value, active, title, subtitle, onToggle } = props;

  const _onClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      onToggle(value);
    },
    [onToggle, value],
  );

  return (
    <Button
      className={className}
      variant="buttons.secondary"
      sx={{
        flex: 1,
        flexDirection: 'column',
        backgroundColor: active ? 'dark.transparent' : 'transparent',
        borderColor: active ? 'rgba(132, 179, 255, 1)' : 'rgba(92, 92, 92, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        paddingY: 0,
        paddingX: 18,
        '&:hover': { backgroundColor: active ? 'dark.transparent' : 'transparent' },
      }}
      onClick={_onClick}
    >
      <Text sx={{ color: active ? 'white.400' : 'white.300' }}>{title}</Text>
      <Text sx={{ color: active ? 'white.300' : 'white.200', fontSize: 0 }}>{subtitle}</Text>
    </Button>
  );
}
