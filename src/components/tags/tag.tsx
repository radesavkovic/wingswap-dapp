import { ReactNode } from 'react';
import { Button, ButtonProps, Text } from 'theme-ui';

interface Props extends Omit<ButtonProps, 'sx'> {
  leftIcon?: ReactNode;
  children?: string | number;
}

export default function Tag(props: Props) {
  const { className, leftIcon, children, ...rest } = props;

  return (
    <Button
      className={className}
      variant="buttons.small-secondary"
      sx={{
        height: 28,
        paddingX: '8px',
        margin: '4px',
        borderRadius: 'lg',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      {...rest}
    >
      {leftIcon && leftIcon}
      <Text variant="caps" sx={{ marginLeft: !!leftIcon ? '4px' : 0, fontWeight: 'medium' }}>
        {children}
      </Text>
    </Button>
  );
}
