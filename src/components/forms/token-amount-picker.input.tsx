import { Currency, CurrencyAmount } from '@wingsswap/sdk';
import { ChangeEvent, FocusEvent, MouseEvent, useCallback } from 'react';
import { useMemo } from 'react';
import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { Button, Flex, FlexProps, Input, Text } from 'theme-ui';

import { escapeRegExp } from '../../functions/format';
import { formatAmount } from '../../utils/numbers';
import { combineClassNames } from '../../utils/renders';
import TokenLogo from '../logos/token.logo';

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`); // match escaped "." characters via in a non-capturing group

interface Props extends Omit<FlexProps, 'ref' | 'sx'> {
  token?: Currency;
  balance?: CurrencyAmount<Currency>;
  value: string;
  onSelect: () => void;
  onUserInput: (input: string) => void;
}

export default function TokenAmountPickerInput(props: Props) {
  const { className, token, balance, value, onSelect, onUserInput, onFocus, ...rest } = props;
  const [focused, setFocused] = useState(false);

  const enforcer = useCallback(
    (nextUserInput: string) => {
      if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
        onUserInput(nextUserInput);
      }
    },
    [onUserInput],
  );

  const _onClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      setFocused(false);
      onSelect && onSelect();
    },
    [onSelect],
  );

  const _onFocus = useCallback(
    (e: FocusEvent<HTMLDivElement>) => {
      setFocused(true);
      onFocus && onFocus(e);
    },
    [onFocus],
  );

  const _onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      // replace commas with periods, because uniswap exclusively uses period as the decimal separator
      enforcer(e.target.value.replace(/,/g, '.'));
    },
    [enforcer],
  );

  const buttonClassName = useMemo(() => {
    return combineClassNames(focused ? 'focused' : '');
  }, [focused]);

  return (
    <Flex
      className={className}
      sx={{
        backgroundColor: 'dark.transparent',
        borderRadius: 'base',
        height: 76,
        paddingX: 16,
        paddingTop: 14,
        paddingBottom: 12,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
      }}
      onFocus={_onFocus}
    >
      {token ? (
        <Flex sx={{ height: 28, width: '100%', alignItems: 'center' }}>
          <Button variant="buttons.small-ghost" sx={{ padding: 0, color: '#FFFFFF', height: 24 }} onClick={_onClick}>
            <TokenLogo currency={token} />
            <Text sx={{ marginLeft: 12 }}>{token.symbol}</Text>
          </Button>
          <Input
            sx={{ flex: 1, height: 28, marginLeft: 16, textAlign: 'right', fontSize: 2, fontWeight: 'bold' }}
            placeholder={'0.0'}
            value={value}
            onChange={_onChange}
          />
        </Flex>
      ) : (
        <Button variant="buttons.extra-small-primary" className={buttonClassName} onClick={_onClick}>
          Select a token
          <FiChevronDown sx={{ marginLeft: '8px' }} />
        </Button>
      )}
      {token && (
        <Flex sx={{ height: 20, width: '100%', alignItems: 'center' }}>
          <Text sx={{ fontSize: 0, fontWeight: 'bold', color: 'white.200', marginLeft: 36 }}>{`Balance: ${
            parseFloat(balance?.toExact() || '0') === 0 ? 0 : formatAmount(parseFloat(balance?.toExact() || '0'))
          } ${token?.symbol}`}</Text>
        </Flex>
      )}
    </Flex>
  );
}
