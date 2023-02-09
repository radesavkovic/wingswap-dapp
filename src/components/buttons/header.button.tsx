import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { Button, Flex, FlexProps } from 'theme-ui';

export enum Direction {
  DESC = 1,
  ASC = -1,
}

interface Props extends Omit<FlexProps, 'sx'> {
  direction?: Direction;
  label: string;
  onClick?: () => void;
}

export default function HeaderButton(props: Props) {
  const { className, direction, label, onClick } = props;

  return (
    <Flex className={className} sx={{ flex: 1, justifyContent: 'flex-end' }}>
      <Button
        variant="buttons.ghost"
        sx={{
          height: 'initial',
          width: 'initial',
          paddingX: 0,
          fontSize: 0,
          fontWeight: 'medium',
          color: 'white.200',
        }}
        onClick={onClick}
      >
        {direction === Direction.DESC ? (
          <FiChevronDown sx={{ marginRight: '8px' }} />
        ) : direction === Direction.ASC ? (
          <FiChevronUp sx={{ marginRight: '8px' }} />
        ) : null}
        {label}
      </Button>
    </Flex>
  );
}
