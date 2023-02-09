import { Currency, SupportedChainId } from '@wingsswap/sdk';

import EthereumLogo from '../../assets/images/tokens/ethereum-logo.png';
import Wingpng from '../../assets/images/tokens/wing-logo.png';
import BnbLogo from '../../assets/images/tokens/bnb-logo.png';
import useAppChainId from '../../hooks/useAppChainId';
import useDefaultLogoURI from '../../hooks/useDefaultLogoURIs';
import { parseAddress } from '../../utils/addresses';
import uriToHttp from '../../utils/uriToHttp';
import Logo, { Props as LogoProps } from './logo';

export const getTokenLogoUrl = (chainId: SupportedChainId, address: string) => {
  if (address == '0xc0fe33B654d13AF5a72C47Dc5a370674ba85b3E6') {
    return Wingpng;
  }
  if (chainId === SupportedChainId.SMART_CHAIN)
    return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/${address}/logo.png`;
  else
    return `https://raw.githubusercontent.com/manekiswap/assets/master/blockchains/ethereum/assets/${address}/logo.png`;
};

interface Props extends Pick<LogoProps, 'className'> {
  currency: Currency;
}

export default function TokenLogo(props: Props) {
  const { className, currency } = props;
  const appChainId = useAppChainId();
  const defaultLogoURIs = useDefaultLogoURI(currency);

  if (currency.isToken) {
    const parsedAddress = parseAddress(currency.address);
    const srcs = defaultLogoURIs.map(uriToHttp).flat();
    parsedAddress && srcs.push(getTokenLogoUrl(appChainId, parsedAddress));
    return (
      <Logo
        className={className}
        srcs={srcs}
        sx={{ height: 24, width: 24, borderRadius: 'circle', minHeight: 24, minWidth: 24 }}
      />
    );
  }

  return (
    <Logo
      className={className}
      srcs={[currency.chainId === SupportedChainId.SMART_CHAIN ? BnbLogo : EthereumLogo]}
      sx={{ height: 24, width: 24, borderRadius: 'circle', minHeight: 24, minWidth: 24 }}
    />
  );
}
