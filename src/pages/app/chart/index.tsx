import { lazy, Suspense, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { Navigate, Route, Routes, useLocation, useMatch } from 'react-router-dom';
import { Flex } from 'theme-ui';

import Link from '../../../components/links/link';
import Loading from '../../../components/loadings/loading';
import { mediaWidthTemplates } from '../../../constants/media';
import graphs from '../../../graph';
import useGlobalUpdater from '../../../graph/hooks/useGlobalUpdater';
import usePairUpdater from '../../../graph/hooks/usePairUpdater';
import useTokenUpdater from '../../../graph/hooks/useTokenUpdater';
import routes from '../../../routes';

const ChartOverviewPage = lazy(() => import('../chart-overview'));
const ChartPoolPage = lazy(() => import('../chart-pool'));
const ChartTokenPage = lazy(() => import('../chart-token'));
const ChartPoolDetailPage = lazy(() => import('../chart-pool-detail'));
const ChartTokenDetailPage = lazy(() => import('../chart-token-detail'));

function Updater() {
  useGlobalUpdater();
  usePairUpdater();
  useTokenUpdater();
  return null;
}
export default function ChartPage() {
  const { t } = useTranslation(['app']);
  const { pathname } = useLocation();
  const matchChartRoute = useMatch({ path: '/app/chart/:type/:address', end: true });

  const renderTabbar = useCallback(() => {
    if (!!matchChartRoute && !!matchChartRoute.params.address) return null;

    return (
      <Flex
        sx={{
          alignSelf: 'flex-start',
          height: 36,
          padding: '4px',
          backgroundColor: 'dark.500',
          borderRadius: 'lg',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link
          variant="buttons.small-ghost"
          sx={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            height: 28,
            width: 68,
            color: pathname === routes['chart-overview'] ? 'white.400' : 'white.300',
            backgroundColor: pathname === routes['chart-overview'] ? 'dark.transparent' : 'transparent',
            borderRadius: 'lg',
            fontWeight: 'normal',
          }}
          to={routes['chart-overview']}
        >
          {t('app:chart-overview')}
        </Link>
        <Link
          variant="buttons.small-ghost"
          sx={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            height: 28,
            width: 68,
            color: pathname === routes['chart-pools'] ? 'white.400' : 'white.300',
            backgroundColor: pathname === routes['chart-pools'] ? 'dark.transparent' : 'transparent',
            borderRadius: 'lg',
            fontWeight: 'normal',
            marginX: '4px',
          }}
          to={routes['chart-pools']}
        >
          {t('app:chart-pool')}
        </Link>
        <Link
          variant="buttons.small-ghost"
          sx={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            height: 28,
            width: 68,
            color: pathname === routes['chart-tokens'] ? 'white.400' : 'white.300',
            backgroundColor: pathname === routes['chart-tokens'] ? 'dark.transparent' : 'transparent',
            borderRadius: 'lg',
            fontWeight: 'normal',
          }}
          to={routes['chart-tokens']}
        >
          {t('app:chart-token')}
        </Link>
      </Flex>
    );
  }, [matchChartRoute, pathname, t]);
//TODO: remove maneki
  return (
    <graphs.Provider>
      <Helmet>
        <title>Wingswap | Analytics</title>
        <link rel="canonical" href="https://manekiswap.com/#/app/chart" />
      </Helmet>

      <Updater />
      <Flex
        sx={{
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'dark.400',
          paddingX: 76,
          paddingY: 16,
          ...mediaWidthTemplates.upToSmall({
            paddingX: 16,
            paddingY: 12,
          }),
        }}
      >
        {renderTabbar()}
        <Flex sx={{ width: '100%' }}>
          <Routes>
            <Route
              path={'/overview'}
              element={
                <Suspense fallback={<Loading />}>
                  <ChartOverviewPage />
                </Suspense>
              }
            />
            <Route
              path={'/pools'}
              element={
                <Suspense fallback={<Loading />}>
                  <ChartPoolPage />
                </Suspense>
              }
            />
            <Route
              path={'/tokens'}
              element={
                <Suspense fallback={<Loading />}>
                  <ChartTokenPage />
                </Suspense>
              }
            />
            <Route
              path={'/pool/:address'}
              element={
                <Suspense fallback={<Loading />}>
                  <ChartPoolDetailPage />
                </Suspense>
              }
            />
            <Route
              path={'/token/:address'}
              element={
                <Suspense fallback={<Loading />}>
                  <ChartTokenDetailPage />
                </Suspense>
              }
            />
            <Route path="*" element={<Navigate to={{ pathname: routes['chart-overview'] }} replace={true} />} />
          </Routes>
        </Flex>
      </Flex>
    </graphs.Provider>
  );
}
