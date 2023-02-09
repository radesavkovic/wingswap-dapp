import { Currency } from '@wingsswap/sdk';
import { Modal, ModalContent, ModalTitle } from '@mattjennings/react-modal';
import DOMPurify from 'dompurify';
import { Heading, Text } from 'theme-ui';

interface Props {
  active: boolean;
  onClose: () => void;
  token: Currency;
  description?: string;
}

export default function TokenInfoModal(props: Props) {
  const { active, onClose, token, description } = props;

  return (
    <Modal
      allowClose={true}
      closeOnOutsideClick={true}
      fullScreen={false}
      onClose={onClose}
      open={active}
      sx={{
        maxWidth: 448,
        marginY: 16,
        alignSelf: 'center',
        maxHeight: 'calc(100% - 32px)',
      }}
    >
      <ModalTitle>
        <Heading variant={'styles.h5'}>{token.symbol}</Heading>
      </ModalTitle>
      <ModalContent
        sx={{
          flexDirection: 'column',
          maxHeight: 400,
          overflow: 'auto',
          color: 'dark.100',
          '& a': {
            color: 'blue.300',
          },
          '&::-webkit-scrollbar-track': {},
          '&::-webkit-scrollbar': { width: '4px' },
          '&::-webkit-scrollbar-thumb': {
            borderRadius: '8px',
            height: '80px',
            backgroundColor: 'rgba(92, 92, 92, 0.3)',
          },
        }}
      >
        <Text variant="body100" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description ?? '') }}></Text>
      </ModalContent>
    </Modal>
  );
}
