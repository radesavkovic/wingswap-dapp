import { Currency, CurrencyAmount } from '@wingsswap/sdk';
import { Modal, ModalContent, ModalFooter, ModalTitle } from '@mattjennings/react-modal';
import { useCallback } from 'react';
import { Button, Divider, Flex, Heading, Text } from 'theme-ui';

import { useMediaQueryMaxWidth } from '../../hooks/useMediaQuery';
import { useWindowSize } from '../../hooks/useWindowSize';
import TokenLogo from '../logos/token.logo';

interface Props {
  active: boolean;
  currencyA?: CurrencyAmount<Currency>;
  currencyB?: CurrencyAmount<Currency>;
  onClose: (confirm: boolean) => void;
}

export default function ReviewSwapModal(props: Props) {
  const { active, currencyA: token0, currencyB: token1, onClose } = props;
  const isUpToExtraSmall = useMediaQueryMaxWidth('upToExtraSmall');
  const { width = 0 } = useWindowSize();

  const _onClose = useCallback(
    (confirm: boolean) => {
      onClose(confirm);
    },
    [onClose],
  );

  return (
    <Modal
      allowClose={true}
      closeOnOutsideClick={false}
      closeOnEscKey={false}
      fullScreen={false}
      onClose={() => _onClose(false)}
      open={active}
      width={Math.min(448, width - 32)}
    >
      <ModalTitle>
        <Heading variant={isUpToExtraSmall ? 'styles.h6' : 'styles.h5'}>Review your transaction</Heading>
      </ModalTitle>

      <ModalContent sx={{ flexDirection: 'column', backgroundColor: 'dark.500', borderRadius: 'base' }}>
        {token0 && token1 && (
          <>
            <Flex sx={{ paddingX: 16, paddingY: 12 }}>
              <TokenLogo currency={token0.currency} />
              <Text sx={{ color: 'white.300', marginLeft: 12 }}>{token0.currency.symbol}</Text>
              <Text sx={{ marginLeft: 'auto', color: 'white.300' }}>{token0.toSignificant(3)}</Text>
            </Flex>
            <Flex sx={{ paddingX: 16, paddingY: 12 }}>
              <TokenLogo currency={token1.currency} />
              <Text sx={{ color: 'white.300', marginLeft: 12 }}>{token1.currency.symbol}</Text>
              <Text sx={{ marginLeft: 'auto', color: 'white.300' }}>{token1.toSignificant(3)}</Text>
            </Flex>
            <Divider sx={{ marginX: 16 }} />
            <Flex sx={{ paddingX: 16, paddingY: 12 }}>
              <Text sx={{ color: 'white.300' }}>Fee tier</Text>
              <Text sx={{ marginLeft: 'auto', color: 'white.300' }}>0.03%</Text>
            </Flex>
          </>
        )}
      </ModalContent>

      <ModalFooter sx={{ flexDirection: 'column' }}>
        <Button
          variant="gradient"
          sx={{ width: '100%', marginBottom: '8px' }}
          onClick={() => {
            _onClose(true);
          }}
        >
          {`Swap ${token0?.toSignificant(3)} ${token0?.currency.symbol} for ${token1?.toSignificant(3)} ${
            token1?.currency.symbol
          }`}
        </Button>
        <Button
          variant="buttons.small-ghost"
          sx={{ width: '100%', color: 'white.300' }}
          onClick={() => {
            _onClose(false);
          }}
        >
          Go back
        </Button>
      </ModalFooter>
    </Modal>
  );
}
