import { Currency, Trade, TradeType } from '@wingsswap/sdk';
import { Modal, ModalContent, ModalTitle } from '@mattjennings/react-modal';
import { useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Heading, Text } from 'theme-ui';

import useActiveWeb3React from '../../hooks/useActiveWeb3React';
import { useWindowSize } from '../../hooks/useWindowSize';
import { ExplorerDataType, getExplorerLink } from '../../utils/getExplorerLink';
import Alert from '../alert';
interface Props {
  active: boolean;
  attemptingTxn: boolean;
  description: string;
  txHash: string;
  onClose: () => void;
}

/**
 * Returns true if the trade requires a confirmation of details before we can submit it
 * @param args either a pair of V2 trades or a pair of V3 trades
 */
function tradeMeaningfullyDiffers(
  ...args: [Trade<Currency, Currency, TradeType>, Trade<Currency, Currency, TradeType>]
): boolean {
  const [tradeA, tradeB] = args;
  return (
    tradeA.tradeType !== tradeB.tradeType ||
    !tradeA.inputAmount.currency.equals(tradeB.inputAmount.currency) ||
    !tradeA.inputAmount.equalTo(tradeB.inputAmount) ||
    !tradeA.outputAmount.currency.equals(tradeB.outputAmount.currency) ||
    !tradeA.outputAmount.equalTo(tradeB.outputAmount)
  );
}

export default function TransactionConfirmationModal(props: Props) {
  const { active, attemptingTxn, description, txHash, onClose } = props;
  const { width = 0 } = useWindowSize();
  const { chainId } = useActiveWeb3React();

  const _onClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (attemptingTxn || !active) {
      return;
    }
    // To solve race condition between attemptingTxn and active
    // when active turns to true, attemptingTxn is still false a bit
    const timeout = setTimeout(() => {
      toast.custom((t) => (
        <Alert
          visible={t.visible}
          variant={txHash ? 'success' : 'error'}
          title={txHash ? 'Transaction confirmed' : 'Transaction rejected'}
          description={!txHash ? 'Please try again.' : ''}
          action={
            txHash
              ? {
                  text: 'View on Explorer',
                  url: getExplorerLink(chainId ?? -1, txHash, ExplorerDataType.TRANSACTION),
                }
              : undefined
          }
          onClose={() => toast.dismiss(t.id)}
        />
      ));
      onClose();
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [active, txHash, attemptingTxn, onClose, chainId]);

  return (
    <Modal
      variant="white"
      allowClose={true}
      closeOnOutsideClick={false}
      closeOnEscKey={false}
      fullScreen={false}
      onClose={() => _onClose()}
      open={active}
      width={Math.min(448, width - 32)}
    >
      <ModalTitle />

      <ModalContent sx={{ flexDirection: 'column', alignItems: 'center' }}>
        <Heading variant="styles.h5" sx={{ marginBottom: 16, color: 'velvet.300' }}>
          Waiting for confirmation
        </Heading>
        <Text sx={{ color: 'dark.400', fontWeight: 'bold', fontSize: 0, marginBottom: '4px' }}>{description}</Text>
        <Text sx={{ color: 'dark.200', fontWeight: 'bold', fontSize: 0, marginBottom: 16 }}>
          Please confirm transaction in your wallet
        </Text>
      </ModalContent>
    </Modal>
  );
}
