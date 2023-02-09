import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Divider, Flex, Image } from 'theme-ui';

// import { ReactComponent as LogoSVG } from '../../assets/images/logo.svg';
import { ReactComponent as LogoSVG } from '../../assets/images/logoblack.svg';
import { ReactComponent as LogoCircleSVG } from '../../assets/images/logocircle2.svg';
import ConnectWalletButton from '../../components/buttons/connect-wallet.button';
import NavMenuButton from '../../components/buttons/nav-menu.button';
import Link from '../../components/links/link';
import { mediaWidthTemplates } from '../../constants/media';
import useMatchTab from '../../hooks/useMatchTab';
import { useMediaQueryMaxWidth } from '../../hooks/useMediaQuery';
import routes from '../../routes';

export default function Header() {
  const { t } = useTranslation(['app']);
  const { pathname } = useLocation();

  const { matchedSwapRoute, matchedPoolRoute, matchedChartRoute } = useMatchTab();

  const isUpToExtraSmall = useMediaQueryMaxWidth('upToExtraSmall');
  const isUsingApp = pathname.indexOf(routes.swap) > -1 || pathname.indexOf(routes.pool) > -1;

  return (
    <Flex as="nav" sx={{ flexDirection: 'column', position: 'sticky', top: 0, zIndex: 10 }}>
      <Flex
        sx={{
          height: 80,
          width: '100%',
          backgroundColor: 'dark.400',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingX: 48,
          ...mediaWidthTemplates.upToExtraSmall({
            paddingX: 16,
          }),
        }}
      >
        <Flex sx={{ alignItems: 'center' }}>
          <Link
            variant="buttons.ghost"
            sx={{
              padding: 0,
              ':focus': { boxShadow: 'none' },
              '>svg': {
                height: 150,
                width: 70,
              },
              ...mediaWidthTemplates.upToExtraSmall({
                '>svg': {
                  height: 159,
                  width: 80,
                },
              }),
            }}
            to={''}
          >
            {isUpToExtraSmall ? <LogoCircleSVG /> : <LogoSVG />}
          </Link>
          {!isUpToExtraSmall && (
            <Flex sx={{ marginLeft: 12 }}>
              <Link
                variant="buttons.ghost"
                sx={{
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  // backgroundColor: matchedSwapRoute ? 'linear-gradient(0deg, #ff0600 -50%, #ffb400 100%)' : 'dark.200',
                   color: matchedSwapRoute ? 'mint.300' : 'dark.200',
                  ':focus': { boxShadow: 'none' },
                }}
                to={routes.swap}
              >
                {t('app:swap')}
              </Link>
              <Link
                variant="buttons.ghost"
                sx={{
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  color: matchedPoolRoute ? 'mint.300' : 'dark.200',
                  ':focus': { boxShadow: 'none' },
                }}
                to={routes.pool}
              >
                {t('app:pool')}
              </Link>
              <Link
                variant="buttons.ghost"
                sx={{
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  color: matchedChartRoute ? 'mint.300' : 'dark.200',
                  ':focus': { boxShadow: 'none' },
                }}
                to={routes.chart}
              >
                {t('app:chart')}
              </Link>
            </Flex>
          )}
        </Flex>
        <Flex
          sx={{
            marginLeft: 'auto',
            alignItems: 'center',
            '.menu-button': {
              display: 'none',
            },
            ...mediaWidthTemplates.upToExtraSmall({
              '.menu-button': {
                display: 'flex',
              },
            }),
          }}
        >
          {isUsingApp && <ConnectWalletButton />}
          <NavMenuButton className="menu-button" sx={{ marginLeft: '8px' }} />
        </Flex>
      </Flex>
      <Divider sx={{ borderColor: '#3C3F5A' }} />
    </Flex>
  );
}
