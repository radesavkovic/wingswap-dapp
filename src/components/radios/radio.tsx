import { InputHTMLAttributes } from 'react';
import { Box } from 'theme-ui';

type Props = InputHTMLAttributes<HTMLInputElement>;

function UncheckedRadio({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
      sx={{
        display: 'block',
        'input:checked ~ &': {
          display: 'none',
        },
      }}
    >
      <circle cx="12" cy="12" r="9.5" stroke="#3C3F5A"></circle>
    </svg>
  );
}

function CheckedRadio({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
      sx={{
        display: 'none',
        'input:checked ~ &': {
          display: 'block',
        },
      }}
    >
      <circle cx="12" cy="12" r="9.5" fill="#fff" stroke="#CCDFFF"></circle>
      <circle cx="12" cy="12" r="6" fill="#6E7BF3"></circle>
    </svg>
  );
}

export default function Radio(props: Props) {
  const { className, ...restProps } = props;
  return (
    <Box
      sx={{
        display: 'inline-flex',
      }}
    >
      <input
        {...restProps}
        type="radio"
        sx={{
          display: 'none',
        }}
      />
      <UncheckedRadio className={className} />
      <CheckedRadio className={className} />
    </Box>
  );
}
