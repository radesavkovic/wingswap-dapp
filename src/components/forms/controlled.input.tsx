import { FocusEvent, forwardRef, ReactNode, useCallback, useImperativeHandle, useRef } from 'react';
import { useMemo, useState } from 'react';
import { Flex, Input, InputProps, Label, Text } from 'theme-ui';

import { combineClassNames } from '../../utils/renders';

interface Props extends Omit<InputProps, 'sx'> {
  label?: string;
  leftNode?: ReactNode;
  error?: string;
}

const ControlledInput = forwardRef((props: Props, ref: any) => {
  const { className, label, leftNode, error, id, disabled, onBlur, onFocus, ...rest } = props;
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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

  useImperativeHandle(
    ref,
    () =>
      ({
        changeValue: (newValue: string) => {
          if (!inputRef?.current) return;
          (inputRef.current as any).value = newValue;
        },
      } as never),
  );

  return (
    <Flex className={className} sx={{ flexDirection: 'column', borderRadius: 'base' }}>
      <Flex variant="styles.form-input" className={inputClassName}>
        {label && <Label htmlFor={id}>{label}</Label>}
        <Flex className="input-wrapper" sx={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingRight: 12 }}>
          {!!leftNode && leftNode}
          <Input id={id} ref={inputRef} type="text" onBlur={_onBlur} onFocus={_onFocus} {...rest} />
        </Flex>
      </Flex>
      {error && <Text sx={{ fontSize: 0, fontWeight: 'medium', color: 'red.200', marginTop: '4px' }}>{error}</Text>}
    </Flex>
  );
});

ControlledInput.displayName = 'ControlledInput';

export default ControlledInput;
