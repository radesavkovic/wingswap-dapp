import { Modal, ModalContent, ModalTitle } from '@mattjennings/react-modal';
import get from 'lodash/get';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { Button, Flex, Heading, Text } from 'theme-ui';

import { useWindowSize } from '../../hooks/useWindowSize';
import ControlledInput from '../forms/controlled.input';

interface Props<T extends {}> {
  active: boolean;
  onClose: () => void;
  params?: T;
  onInvest: () => void;
}

export default function StrategyInvestModal<T>(props: Props<T>) {
  const { active, params, onInvest, onClose } = props;
  const name = get(params, 'name');
  const pair = get(params, 'pair');
  const fee = get(params, 'fee');

  const { width = 0 } = useWindowSize();
  const [investment, setInvestment] = useState('0');
  const [drawdown, setDrawdown] = useState('0');

  const isValid = useMemo(() => {
    if (isNaN(Number(investment)) || isNaN(Number(drawdown))) return false;
    if (Number(investment) === 0 || Number(drawdown) === 0) return false;
    return true;
  }, [drawdown, investment]);

  const _onClose = useCallback(() => {
    onClose();
    setInvestment('0');
    setDrawdown('0');
  }, [onClose]);

  const _onSubmit = useCallback(() => {
    onInvest();
    setInvestment('0');
    setDrawdown('0');
  }, [onInvest]);

  const _onChangeInvestment = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (!isNaN(value)) {
      setInvestment(e.target.value);
    }
  }, []);

  const _onChangeDrawdown = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (!isNaN(value)) {
      setDrawdown(e.target.value);
    }
  }, []);

  return (
    <Modal fullScreen={false} onClose={() => _onClose()} open={active} width={Math.min(448, width - 32)}>
      <ModalTitle sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
        <Heading variant="styles.h5" sx={{}}>
          {name}
        </Heading>
        <Text variant="text.caps100" sx={{ color: 'velvet.300' }}>{`Trading pair: ${pair}`}</Text>
      </ModalTitle>

      <ModalContent sx={{ flexDirection: 'column', alignItems: 'center' }}>
        <Flex>
          <ControlledInput
            label="Total investment"
            placeholder="0.0"
            sx={{
              flex: 1,
              fontFamily: 'body',
              marginRight: 16,
              '.input-wrapper': {
                paddingRight: 12,
              },
              '.input-wrapper::after': {
                content: '"$"',
              },
            }}
            onChange={_onChangeInvestment}
          />
          <ControlledInput
            label="Max drawdown"
            placeholder="0"
            sx={{
              flex: 1,
              fontFamily: 'body',
              '.input-wrapper': {
                paddingRight: 12,
              },
              '.input-wrapper::after': {
                content: '"%"',
              },
            }}
            onChange={_onChangeDrawdown}
          />
        </Flex>
        <Text sx={{ alignSelf: 'flex-end', color: 'white.200', fontSize: 1, marginTop: '8px', marginBottom: 16 }}>
          Fee{'  '}
          <Text as="span" sx={{ color: 'white.300', fontSize: 1 }}>
            {fee * 100 + '%'}
          </Text>
        </Text>
        <Button
          variant="buttons.gradient"
          disabled={!isValid}
          sx={{ width: '100%', marginBottom: 16 }}
          onClick={_onSubmit}
        >
          Invest
        </Button>
        <Text variant="text.caps100" sx={{ color: 'dark.200' }}>
          Developed by Maneki Team
        </Text>
      </ModalContent>
    </Modal>
  );
}
