import { FocusEvent, forwardRef, ReactNode, useCallback } from 'react';
import { useMemo, useState } from 'react';
import { Flex, Input, InputProps, Label, Text } from 'theme-ui';

import { combineClassNames } from '../../utils/renders';

interface Props extends Omit<InputProps, 'sx'> {
  label?: string;
  leftNode?: ReactNode;
  error?: string;
}

const FormInput = forwardRef((props: Props, ref: any) => {
  const { className, label, leftNode, error, id, disabled, onBlur, onFocus, ...rest } = props;
  const [focused, setFocused] = useState(false);

  const _onFocus = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      setFocused(true);
      onFocus && onFocus(e);
    },
    [onFocus],
  );

  const _onBlur = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      setFocused(false);
      onBlur && onBlur(e);
    },
    [onBlur],
  );

  const inputClassName = useMemo(() => {
    return combineClassNames(disabled ? 'disabled' : '', !!error ? 'error' : '', focused ? 'focused' : '');
  }, [disabled, error, focused]);

  return (
    <Flex className={className} sx={{ flexDirection: 'column', borderRadius: 'lg' }}>
      <Flex variant="styles.form-input" sx={{ height: 44 }} className={inputClassName}>
        {label && <Label htmlFor={id}>{label}</Label>}
        <Flex
          className="input-wrapper"
          sx={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingRight: leftNode ? 12 : 0 }}
        >
          {!!leftNode && leftNode}
          <Input id={id} ref={ref} type="text" onBlur={_onBlur} onFocus={_onFocus} {...rest} />
        </Flex>
      </Flex>
      {error && <Text sx={{ fontSize: 0, fontWeight: 'medium', color: 'red.200', marginTop: '4px' }}>{error}</Text>}
    </Flex>
  );
});

FormInput.displayName = 'FormInput';

export default FormInput;
