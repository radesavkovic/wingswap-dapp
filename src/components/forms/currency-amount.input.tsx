import { CurrencyAmount, Token } from '@wingsswap/sdk';
import { ChangeEvent, FocusEvent, useCallback } from 'react';
import { useMemo, useState } from 'react';
import { Flex, Input, InputProps, Label, Text } from 'theme-ui';

import { mediaWidthTemplates } from '../../constants/media';
import { escapeRegExp } from '../../functions/format';
import { combineClassNames } from '../../utils/renders';

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`); // match escaped "." characters via in a non-capturing group

interface Props extends Omit<InputProps, 'ref' | 'sx' | 'onChange'> {
  label?: string;
  error?: string;
  fiatValue?: CurrencyAmount<Token>;
  onUserInput: (input: string) => void;
}

export default function CurrencyAmountInput(props: Props) {
  const { className, label, error, fiatValue, onUserInput, id, disabled, onBlur, onFocus, ...rest } = props;
  const [focused, setFocused] = useState(false);

  const enforcer = useCallback(
    (nextUserInput: string) => {
      if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
        onUserInput(nextUserInput);
      }
    },
    [onUserInput],
  );

  const _onBlur = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      onBlur && onBlur(e);
    },
    [onBlur],
  );

  const _onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      // replace commas with periods, because uniswap exclusively uses period as the decimal separator
      enforcer(e.target.value.replace(/,/g, '.'));
    },
    [enforcer],
  );

  const _onFocus = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      onFocus && onFocus(e);
    },
    [onFocus],
  );

  const inputClassName = useMemo(() => {
    let _className = '';
    if (disabled) {
      _className = combineClassNames(_className, 'disabled');
    }
    if (!!error) {
      _className = combineClassNames(_className, 'error');
    }
    if (focused) {
      _className = combineClassNames(_className, 'focused');
    }
    return _className.trim();
  }, [disabled, error, focused]);

  return (
    <Flex
      className={className}
      sx={{
        flexDirection: 'column',
        borderRadius: 'base',
      }}
    >
      <Flex variant="styles.form-input" className={inputClassName}>
        {label && <Label htmlFor={id}>{label}</Label>}
        <Flex className="input-wrapper" sx={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingRight: 12 }}>
          <Input
            id={id}
            type="text"
            placeholder="0.0"
            onBlur={_onBlur}
            onChange={_onChange}
            onFocus={_onFocus}
            {...rest}
          />
          <Text
            sx={{
              fontSize: 0,
              color: 'white.200',
              ...mediaWidthTemplates.upToExtraSmall({
                display: 'none',
              }),
            }}
          >{`~$ ${
            fiatValue
              ? fiatValue?.toSignificant(6, {
                  groupSeparator: ',',
                })
              : '0.00'
          }`}</Text>
        </Flex>
      </Flex>
      {error && <Text sx={{ fontSize: 0, fontWeight: 'medium', color: 'red.200', marginTop: '4px' }}>{error}</Text>}
    </Flex>
  );
}
