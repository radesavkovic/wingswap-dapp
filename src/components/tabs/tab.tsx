import { Button, ButtonProps } from 'theme-ui';

import { combineClassNames } from '../../utils/renders';

interface Props extends ButtonProps {
  active: boolean;
}

export default function Tab(props: Props) {
  const { className, active, children, ...rest } = props;

  return (
    <Button className={combineClassNames(className, active ? 'active' : '')} variant={'buttons.tab'} {...rest}>
      {children}
    </Button>
  );
}
