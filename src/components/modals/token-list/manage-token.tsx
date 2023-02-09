import { Currency } from '@wingsswap/sdk';
import { ChangeEvent, useCallback, useState } from 'react';
import { Button, Flex, Heading, Text } from 'theme-ui';

import { utils } from '../../../constants/token';
import useDebounce from '../../../hooks/useDebounce';
import useSearchToken from '../../../hooks/useSearchToken';
import useToken from '../../../hooks/useToken';
import { actions } from '../../../reducers';
import { useAppDispatch } from '../../../reducers/hooks';
import FormInput from '../../forms/form.input';
import TokenLogo from '../../logos/token.logo';

interface Props {
  active: boolean;
  onClose: () => void;
  onSelectToken: (token: Currency | undefined) => void;
}

export default function ManageToken(props: Props) {
  const { active, onClose, onSelectToken } = props;
  const [queryText, setQueryText] = useState('');

  const dispatch = useAppDispatch();
  const debouncedQuery = useDebounce(queryText, 200);
  const token = useToken(debouncedQuery);
  const tokenExistInStore = useSearchToken(debouncedQuery).length === 1;

  const _onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQueryText(e.target.value);
  };

  const _onImport = useCallback(() => {
    if (!token) return;

    dispatch(actions.token.addToken(utils.toSerializedToken(token)));
    onClose();
  }, [dispatch, onClose, token]);

  const _onSelect = () => {
    onClose();
    onSelectToken(token);
  };
  return (
    <Flex
      sx={{
        display: active ? 'flex' : 'none',
        flexDirection: 'column',
        height: 480,
      }}
    >
      <FormInput placeholder="Input token address" sx={{ width: '100%', marginTop: '16px' }} onChange={_onChange} />
      {!token ? (
        <div />
      ) : (
        <>
          <Flex sx={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
            <Text sx={{ width: '100%', textAlign: 'center', marginTop: 76 }}>
              {tokenExistInStore
                ? 'This token appears on the token list'
                : 'This token doesn’t appear on the token list. Make sure this is the token you want to trade.'}
            </Text>
            <TokenLogo currency={token} sx={{ height: 52, width: 52, marginTop: 24 }} />
            <Heading variant="styles.h6" sx={{ marginTop: '8px' }}>
              {token.symbol}
            </Heading>
            <Text sx={{ fontSize: 12, fontWeight: 'medium', color: 'white.100' }}>{token.name}</Text>
            <Flex
              sx={{
                marginTop: 12,
                height: 24,
                paddingX: '8px',
                alignItems: 'center',
                backgroundColor: 'rgba(92, 92, 92, 0.3)',
              }}
            >
              <Text sx={{ fontSize: 12, fontWeight: 'medium', color: 'blue.300' }}>{token.address}</Text>
            </Flex>
          </Flex>
          {tokenExistInStore ? (
            <Button variant="buttons.small-primary" sx={{ width: '100%' }} onClick={_onSelect}>
              Select
            </Button>
          ) : (
            <Button variant="buttons.small-primary" sx={{ width: '100%' }} onClick={_onImport}>
              Import
            </Button>
          )}
        </>
      )}
    </Flex>
  );
}
