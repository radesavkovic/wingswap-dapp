import { PropsWithChildren, ReactElement, ReactPropTypes } from 'react';
import { Position, Tooltip as TippyTooltip, Trigger } from 'react-tippy';
import { Text } from 'theme-ui';

interface Props {
  className?: string;
  title?: string;
  html?: ReactElement;
  position?: Position;
  trigger?: Trigger;
}

export default function Tooltip({
  children,
  className,
  title,
  html,
  position = 'bottom',
  trigger,
}: PropsWithChildren<Props>) {
  const content = html ? (
    html
  ) : (
    <Text variant="caps100" sx={{ color: 'dark.500', display: 'block', textAlign: 'left', maxWidth: 300 }}>
      {title}
    </Text>
  );
  return (
    <TippyTooltip
      sx={{
        display: 'inline-flex',
        lineHeight: '0px',
      }}
      useContext
      className={className}
      html={content}
      position={position}
      trigger={trigger}
      arrow={true}
    >
      {children}
    </TippyTooltip>
  );
}
