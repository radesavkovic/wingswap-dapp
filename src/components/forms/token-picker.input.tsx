import { Currency } from '@wingsswap/sdk';
import { FocusEvent, FocusEventHandler, MouseEvent, MouseEventHandler, useCallback } from 'react';
import { useMemo } from 'react';
import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { Button, Flex, FlexProps, Label, Text } from 'theme-ui';

import { combineClassNames } from '../../utils/renders';
import TokenLogo from '../logos/token.logo';

interface Props extends Omit<FlexProps, 'sx' | 'onBlur' | 'onClick' | 'onFocus'> {
  currency?: Currency;
  disabled?: boolean;
  label?: string;

  onBlur?: FocusEventHandler<HTMLButtonElement>;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onFocus?: FocusEventHandler<HTMLButtonElement>;
  autoFocus?: boolean;
}

export default function TokenPickerInput(props: Props) {
  const { className, label, currency: token, id, disabled, onBlur, onClick, onFocus, autoFocus, ...rest } = props;
  const [focused, setFocused] = useState(false);

  const _onBlur = useCallback(
    (e: FocusEvent<HTMLButtonElement>) => {
      setFocused(false);
      onBlur && onBlur(e);
    },
    [onBlur],
  );

  const _onClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      setFocused(false);
      onClick && onClick(e);
    },
    [onClick],
  );

  const _onFocus = useCallback(
    (e: FocusEvent<HTMLButtonElement>) => {
      setFocused(true);
      onFocus && onFocus(e);
    },
    [onFocus],
  );

  const buttonClassName = useMemo(() => {
    return combineClassNames(disabled ? 'disabled' : '', focused ? 'focused' : '');
  }, [disabled, focused]);

  return (
    <Flex
      className={className}
      sx={{ flexDirection: 'column', borderRadius: 'lg', backgroundColor: 'dark.transparent' }}
    >
      <Button
        variant="styles.picker-input"
        className={buttonClassName}
        sx={{
          display: 'flex',
          alignItems: 'center',
          paddingX: 12,
          paddingTop: '4px',
          paddingBottom: '8px',
          height: 60,
          pointerEvents: 'auto',
          backgroundColor: 'transparent',
          '&:focus, &:focus-visible': {
            boxShadow: '0 0 0 1px rgba(24, 235, 251, 1)',
          },
        }}
        onBlur={_onBlur}
        onClick={_onClick}
        onFocus={_onFocus}
        autoFocus={autoFocus}
      >
        <Flex sx={{ flex: 1, flexDirection: 'column' }}>
          <Label
            htmlFor={id}
            sx={{
              marginBottom: '4px',
              fontFamily: 'body',
              fontSize: 0,
              fontWeight: 'medium',
              lineHeight: 0,
              color: 'white.300',
            }}
          >
            {label}
          </Label>
          <Flex
            sx={{
              width: '100%',
              color: 'text',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {token ? (
              <Flex>
                <TokenLogo currency={token} />
                <Text sx={{ marginLeft: 12 }}>{token.symbol}</Text>
              </Flex>
            ) : (
              <Flex>
                <Text
                  color="placeholder"
                  sx={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', color: 'white.200' }}
                >
                  Select a token
                </Text>
              </Flex>
            )}
          </Flex>
        </Flex>
        <FiChevronDown sx={{ color: 'mint.300' }} size={22} />
      </Button>
    </Flex>
  );
}
