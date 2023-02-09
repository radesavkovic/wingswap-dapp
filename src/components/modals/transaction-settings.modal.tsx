import { Modal, ModalContent, ModalTitle } from '@mattjennings/react-modal';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { FiInfo } from 'react-icons/fi';
import { Flex, Heading, Switch, Text } from 'theme-ui';

import Tooltip from '../../components/tooltips/tooltip';
import { useMediaQueryMaxWidth } from '../../hooks/useMediaQuery';
import useUserConfig from '../../hooks/useUserConfig';
import { useWindowSize } from '../../hooks/useWindowSize';
import { actions } from '../../reducers';
import { useAppDispatch } from '../../reducers/hooks';
import ControlledInput from '../forms/controlled.input';
import FormInput from '../forms/form.input';
import Toggle from '../toggles/toggle';

const InfoIcon = () => <FiInfo sx={{ height: 13, width: 13, cursor: 'pointer', color: 'dark.100' }} />;

interface Props {
  active: boolean;
  onClose: () => void;
}

export default function TransactionSettingsModal(props: Props) {
  const { active, onClose } = props;
  const { width = 0 } = useWindowSize();
  const isUpToExtraSmall = useMediaQueryMaxWidth('upToExtraSmall');

  const dispatch = useAppDispatch();

  const slippageInputRef = useRef<typeof FormInput>(null);

  const { multihop, slippage, transactionDeadline } = useUserConfig();

  const [localMultiHop, setLocalMultihop] = useState(multihop);
  const [localSlippage, setLocalSlippage] = useState(slippage === 'auto' ? '' : `${slippage}`);
  const [localTransactionDeadline, setLocalTransactionDeadline] = useState(`${transactionDeadline}`);

  const _onClose = () => {
    onClose();
  };

  useEffect(() => {
    if (!active) {
      dispatch(actions.user.toggleMultihop(localMultiHop));
      dispatch(actions.user.changeSlippage(localSlippage === '' ? 'auto' : Number(localSlippage)));
      dispatch(actions.user.changeTransactionDeadline(Number(localTransactionDeadline)));
    }
  }, [active, dispatch, localMultiHop, localSlippage, localTransactionDeadline]);

  const _onChangeSlippage = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (!isNaN(value)) {
      setLocalSlippage(e.target.value);
    }
  }, []);

  const _onChangeTransactionDeadline = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (!isNaN(value)) {
      setLocalTransactionDeadline(e.target.value);
    }
  }, []);

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
        <Heading variant={isUpToExtraSmall ? 'styles.h6' : 'styles.h5'}>Transaction settings</Heading>
      </ModalTitle>

      <ModalContent sx={{ flexDirection: 'column' }}>
        <Flex sx={{ flexDirection: 'column' }}>
          <Flex sx={{ alignItems: 'center', marginBottom: '8px' }}>
            <Text sx={{ color: 'white.200' }}>Slippage tolerance</Text>
            <Tooltip
              sx={{ marginLeft: 10 }}
              title="Your transaction will revert if the price changes unfavorably by more than this percentage."
              position="right"
            >
              <InfoIcon />
            </Tooltip>
          </Flex>
          <Flex sx={{ alignItems: 'center' }}>
            <Toggle
              active={localSlippage === ''}
              label={'Auto'}
              onToggle={(value: boolean) => {
                if (value) {
                  setLocalSlippage('');
                  (slippageInputRef.current as any).changeValue('');
                } else {
                  setLocalSlippage('0.1');
                  (slippageInputRef.current as any).changeValue('0.1');
                }
              }}
            />
            <ControlledInput
              ref={slippageInputRef}
              disabled={localSlippage === ''}
              sx={{
                flex: 1,
                marginLeft: 12,
                fontFamily: 'body',
                '.input-wrapper': {
                  paddingRight: 12,
                },
                '.input-wrapper::after': {
                  content: '"%"',
                },
              }}
              defaultValue={slippage === 'auto' ? '' : `${slippage}`}
              onChange={_onChangeSlippage}
            />
          </Flex>
        </Flex>
        <Flex sx={{ marginTop: 24, flexDirection: 'column' }}>
          <Flex sx={{ alignItems: 'center', marginBottom: '8px' }}>
            <Text sx={{ color: 'white.200' }}>Transaction deadline</Text>
            <Tooltip
              sx={{ marginLeft: 10 }}
              title="Your transaction will revert if it is pending for more than this period of time."
              position="right"
            >
              <InfoIcon />
            </Tooltip>
          </Flex>
          <FormInput
            sx={{
              fontFamily: 'body',
              '.input-wrapper': {
                paddingRight: 12,
              },
              '.input-wrapper::after': {
                content: '"min"',
              },
            }}
            defaultValue={transactionDeadline / 60}
            onChange={_onChangeTransactionDeadline}
          />
        </Flex>
        <Flex
          sx={{
            marginTop: 24,
            alignItems: 'center',
            justifyContent: 'space-between',
            '& label': {
              width: 'initial',
            },
          }}
        >
          <Flex sx={{ alignItems: 'center' }}>
            <Text sx={{ color: 'white.200' }}>Multihops</Text>
            <Tooltip sx={{ marginLeft: 10 }} title="Enable routing through multiple pools" position="right">
              <InfoIcon />
            </Tooltip>
          </Flex>
          <Switch
            defaultChecked={multihop}
            onChange={({ target }) => {
              setLocalMultihop(target.checked);
            }}
          />
        </Flex>
      </ModalContent>
    </Modal>
  );
}
