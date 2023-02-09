import { useState } from 'react';
import { FiMenu } from 'react-icons/fi';
import { ButtonProps, IconButton } from 'theme-ui';

import NavMenuModal from '../modals/nav-menu.modal';

type Props = Omit<ButtonProps, 'sx'>;

export default function NavMenuButton(props: Props) {
  const { className } = props;
  const [menuModalActive, setMenuModalActive] = useState(false);

  return (
    <>
      <IconButton
        className={className}
        variant="buttons.small-icon"
        sx={{
          backgroundColor: 'dark.transparent',
          alignItems: 'center',
          justifyContent: 'center',
          height: 40,
          width: 40,
        }}
        onClick={() => {
          setMenuModalActive(true);
        }}
      >
        <FiMenu sx={{ color: 'white.400' }} />
      </IconButton>
      <NavMenuModal
        active={menuModalActive}
        onClose={() => {
          setMenuModalActive(false);
        }}
      />
    </>
  );
}
