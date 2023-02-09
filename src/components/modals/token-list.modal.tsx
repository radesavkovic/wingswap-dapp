import { Currency } from '@wingsswap/sdk';
import { Modal, ModalContent, ModalTitle } from '@mattjennings/react-modal';
import { useState } from 'react';
import { Flex, Heading } from 'theme-ui';

import { useMediaQueryMaxWidth } from '../../hooks/useMediaQuery';
import { useWindowSize } from '../../hooks/useWindowSize';
import Tab from '../tabs/tab';
import ManageList from './token-list/manage-list';
import ManageToken from './token-list/manage-token';

interface Props {
  active: boolean;
  onClose: () => void;
  onSelectToken: (token: Currency | undefined) => void;
}

export default function TokenListModal(props: Props) {
  const { active, onClose, onSelectToken } = props;
  const { width = 0 } = useWindowSize();
  const [activeTab, setActiveTab] = useState<'list' | 'token'>('list');
  const isUpToExtraSmall = useMediaQueryMaxWidth('upToExtraSmall');

  const _onClose = () => {
    onClose();
  };

  return (
    <Modal
      allowClose={true}
      closeOnOutsideClick={false}
      closeOnEscKey={false}
      fullScreen={false}
      onClose={() => _onClose()}
      open={active}
      width={Math.min(448, width - 32)}
    >
      <ModalTitle>
        <Heading variant={isUpToExtraSmall ? 'styles.h6' : 'styles.h5'}>Tokens list</Heading>
      </ModalTitle>

      <ModalContent sx={{ flexDirection: 'column' }}>
        <Flex sx={{ marginBottom: '2px' }}>
          <Tab
            active={activeTab === 'list'}
            sx={{ flex: 1 }}
            onClick={() => {
              setActiveTab('list');
            }}
          >
            List
          </Tab>

          <Tab
            active={activeTab === 'token'}
            sx={{ flex: 1 }}
            onClick={() => {
              setActiveTab('token');
            }}
          >
            Token
          </Tab>
        </Flex>
        <ManageList active={activeTab === 'list'} onClose={_onClose} />
        <ManageToken active={activeTab === 'token'} onClose={_onClose} onSelectToken={onSelectToken} />
      </ModalContent>
    </Modal>
  );
}
