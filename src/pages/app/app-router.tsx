import { lazy, Suspense, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Navigate, Route, Routes, useMatch } from 'react-router-dom';
import { Flex, useColorMode } from 'theme-ui';

import Loading from '../../components/loadings/loading';
import Web3ReactManager from '../../components/managers/web3react.manager';
import { AppCtx } from '../../context';
import useTheme from '../../hooks/useTheme';
import useToggle from '../../hooks/useToggle';
import ApplicationUpdater from '../../reducers/application/updater';
import ListUpdater from '../../reducers/list/updater';
import MulticallUpdater from '../../reducers/multicall/updater';
import TransactionUpdater from '../../reducers/transaction/updater';
import routes from '../../routes';
import Header from './header';
import SwapInformationPage from './swap-information';

const AddLiquidityPage = lazy(() => import('./add-liquidity'));
const ChartPage = lazy(() => import('./chart'));
const LiquidityPage = lazy(() => import('./liquidity'));
const ImportLiquidityPage = lazy(() => import('./import-liquidity'));
const PoolPage = lazy(() => import('./pool'));
const RemoveLiquidityPage = lazy(() => import('./remove-liquidity'));
const SwapPage = lazy(() => import('./swap'));

function Updaters(props: { enabled: boolean }) {
  return (
    <>
      {props.enabled && <ApplicationUpdater />}
      {props.enabled && <ListUpdater />}
      {props.enabled && <TransactionUpdater />}
      <MulticallUpdater />
    </>
  );
}

export default function AppRouter() {
  const [activeConnectWallet, toggleConnectWallet] = useToggle(false);

  const theme = useTheme();
  const [, setColorMode] = useColorMode();
  const matchChartRoute = useMatch('/app/chart/*');

  useEffect(() => {
    setColorMode(theme as string);
  }, [setColorMode, theme]);
//TODO: fix this by removing maneki
  return (
    <>
      <Helmet>
        <title>Wingswap | App</title>
        <link rel="canonical" href="https://wingswap.com/#/app" />
      </Helmet>

      <Updaters enabled={matchChartRoute === null} />
      <Web3ReactManager>
        <Flex
          sx={{
            flex: 1,
            flexDirection: 'column',
            backgroundColor: 'background',
          }}
        >
          <AppCtx.Provider value={{ activeConnectWallet, toggleConnectWallet }}>
            <Header />
            <Routes>
              <Route
                path={'/swap'}
                element={
                  <Suspense fallback={<Loading />}>
                    <SwapInformationPage />
                  </Suspense>
                }
              />
              <Route
                path={'/swap/next'}
                element={
                  <Suspense fallback={<Loading />}>
                    <SwapPage />
                  </Suspense>
                }
              />
              <Route
                path={'/pool'}
                element={
                  <Suspense fallback={<Loading />}>
                    <PoolPage />
                  </Suspense>
                }
              />
              <Route
                path={'/pool/detail'}
                element={
                  <Suspense fallback={<Loading />}>
                    <LiquidityPage />
                  </Suspense>
                }
              />
              <Route
                path={'/pool/import'}
                element={
                  <Suspense fallback={<Loading />}>
                    <ImportLiquidityPage />
                  </Suspense>
                }
              />
              <Route
                path={'/pool/add'}
                element={
                  <Suspense fallback={<Loading />}>
                    <AddLiquidityPage />
                  </Suspense>
                }
              />
              <Route
                path={'/pool/remove'}
                element={
                  <Suspense fallback={<Loading />}>
                    <RemoveLiquidityPage />
                  </Suspense>
                }
              />
              <Route
                path={'/chart/*'}
                element={
                  <Suspense fallback={<Loading />}>
                    <ChartPage />
                  </Suspense>
                }
              />
              <Route path="*" element={<Navigate to={{ pathname: routes.swap }} replace={true} />} />
            </Routes>
          </AppCtx.Provider>
        </Flex>
      </Web3ReactManager>
    </>
  );
}
