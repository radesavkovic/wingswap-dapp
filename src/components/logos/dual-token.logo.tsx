import { Currency } from '@wingsswap/sdk';
import { Flex } from 'theme-ui';

import { Props as LogoProps } from './logo';
import TokenLogo from './token.logo';

interface Props extends Pick<LogoProps, 'className'> {
  currencyA: Currency;
  currencyB: Currency;
}

export default function DualTokenLogo(props: Props) {
  const { currencyA, currencyB } = props;
  return (
    <Flex>
      <TokenLogo currency={currencyA} sx={{ zIndex: 2 }} />
      <TokenLogo currency={currencyB} sx={{ marginLeft: '-8px' }} />
    </Flex>
  );
}
