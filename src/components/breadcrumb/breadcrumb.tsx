import { FiChevronRight } from 'react-icons/fi';
import { Flex, FlexProps, Text } from 'theme-ui';

import Link from '../links/link';

interface Props extends Omit<FlexProps, 'sx'> {
  parentRoute: {
    path: string;
    name: string;
  };
  currentRoute: {
    name: string;
  };
}

export default function Breadcrumb(props: Props) {
  const { className, parentRoute, currentRoute } = props;

  return (
    <Flex className={className} sx={{ alignItems: 'center' }}>
      <Link
        variant="buttons.small-ghost"
        sx={{
          padding: 0,
          height: 20,
          fontSize: 0,
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          fontWeight: 'medium',
          color: 'dark.200',
        }}
        to={parentRoute.path}
      >
        {parentRoute.name}
      </Link>
      <FiChevronRight size={20} sx={{ marginX: '4px' }} />
      <Text
        sx={{
          fontSize: 0,
          fontWeight: 'medium',
          color: 'dark.100',
        }}
      >{`${currentRoute.name}`}</Text>
    </Flex>
  );
}
