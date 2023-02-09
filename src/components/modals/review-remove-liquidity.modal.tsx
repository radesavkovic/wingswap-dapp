import { Currency, CurrencyAmount, Token } from '@wingsswap/sdk';
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
  liquidity?: CurrencyAmount<Token>;
  liquidityPercent: string;
  onClose: (confirm: boolean) => void;
}

export default function ReviewRemoveLiquidityModal(props: Props) {
  const { active, currencyA, currencyB, liquidity, liquidityPercent, onClose } = props;
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
        <Heading variant={isUpToExtraSmall ? 'styles.h6' : 'styles.h5'}>Remove liquidity</Heading>
      </ModalTitle>

      <ModalContent sx={{ flexDirection: 'column', backgroundColor: 'dark.500', borderRadius: 'base' }}>
        {currencyA && currencyB && (
          <>
            <Flex sx={{ paddingX: 16, paddingY: 12, alignItems: 'center', justifyContent: 'space-between' }}>
              <Text sx={{ color: 'white.300' }}>{`Receive ${currencyA.currency.symbol}`}</Text>
              <Flex sx={{ alignItems: 'center' }}>
                <Text sx={{ color: 'white.300', marginRight: '8px' }}>{currencyA.toSignificant(6)}</Text>
                <TokenLogo currency={currencyA.currency} />
              </Flex>
            </Flex>
            <Flex sx={{ paddingX: 16, paddingY: 12, alignItems: 'center', justifyContent: 'space-between' }}>
              <Text sx={{ color: 'white.300' }}>{`Receive ${currencyB.currency.symbol}`}</Text>
              <Flex sx={{ alignItems: 'center' }}>
                <Text sx={{ color: 'white.300', marginRight: '8px' }}>{currencyB.toSignificant(6)}</Text>
                <TokenLogo currency={currencyB.currency} />
              </Flex>
            </Flex>
            <Divider sx={{ marginX: 16 }} />
            <Flex sx={{ paddingX: 16, paddingY: 12, alignItems: 'center', justifyContent: 'space-between' }}>
              <Text sx={{ color: 'white.300', marginRight: '8px' }}>Remove pool share</Text>
              <Text sx={{ marginLeft: 'auto', color: 'white.300' }}>{`${liquidityPercent}%`}</Text>
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
          Remove liquidity
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
