import { Modal, ModalContent, ModalFooter, ModalTitle } from '@mattjennings/react-modal';
import { useEffect } from 'react';
import { Button, Heading, Text } from 'theme-ui';

interface Props {
  active: boolean;
  title: string;
  content: string;
  confirmText: string;
  onOpen?: () => void;
  onClose?: () => void;
}

export default function ConfirmDialog(props: Props) {
  const { active, title, content, confirmText, onClose, onOpen } = props;

  useEffect(() => {
    if (!active) return;
    onOpen && onOpen();
  }, [active, onOpen]);

  return (
    <Modal
      allowClose={false}
      closeOnOutsideClick={true}
      closeOnEscKey={false}
      fullScreen={false}
      onClose={onClose}
      open={active}
      width={512}
      sx={{ backgroundColor: 'white.400' }}
    >
      <ModalTitle sx={{ justifyContent: 'center', color: '#0E0E0E' }}>
        <Heading variant="styles.h4">{title}</Heading>
      </ModalTitle>

      <ModalContent sx={{ justifyContent: 'center', color: '#5C5C5C' }}>
        <Text>{content}</Text>
      </ModalContent>

      <ModalFooter sx={{ justifyContent: 'center' }}>
        <Button variant="buttons.primary" onClick={onClose}>
          {confirmText}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
