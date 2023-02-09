import uriToHttp from '../../utils/uriToHttp';
import Logo, { Props as LogoProps } from './logo';

interface Props extends Pick<LogoProps, 'className'> {
  logoURI?: string;
}

export default function ListLogo(props: Props, ref) {
  const { logoURI } = props;

  const srcs = !!logoURI ? uriToHttp(logoURI) : [];
  return <Logo srcs={srcs} sx={{ height: 24, width: 24, borderRadius: 'circle', minHeight: 24, minWidth: 24 }} />;
}
