import { MouseEvent, useCallback } from 'react';
import { Button, Text } from 'theme-ui';

interface Props {
  active: boolean;
  label: string;
  onToggle: (value: boolean) => void;
}

export default function Toggle(props: Props) {
  const { active, label, onToggle } = props;

  const _onClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      onToggle(!active);
    },
    [active, onToggle],
  );

  return (
    <Button
      variant="buttons.secondary"
      sx={{
        backgroundColor: active ? 'dark.transparent' : 'transparent',
        borderColor: active ? 'rgba(132, 179, 255, 1)' : 'rgba(92, 92, 92, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        height: 60,
        width: 60,
        '&:hover': { backgroundColor: active ? 'dark.transparent' : 'transparent' },
      }}
      onClick={_onClick}
    >
      <Text sx={{ color: active ? 'white.400' : 'white.300' }}>{label}</Text>
    </Button>
  );
}
