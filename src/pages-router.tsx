import { AnimatedModalStack } from '@mattjennings/react-modal';
import { lazy, StrictMode, Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import { HashRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'theme-ui';

import Loading from './components/loadings/loading';
import theme from './components/theme';
import { useMediaQueryMaxWidth } from './hooks/useMediaQuery';
import routes from './routes';

const Tokenomics = lazy(() => import('./pages/tokenomics'));
const AppPage = lazy(() => import('./pages/app'));
// const LandingPage = lazy(() => import('./pages/landing-page/home'));
// const IntelligencePage = lazy(() => import('./pages/landing-page/intelligence'));
// const StrategyPage = lazy(() => import('./pages/landing-page/strategy'));
const NotFoundPage = lazy(() => import('./pages/404'));

export default function PagesRouter() {
  const isUpToExtraSmall = useMediaQueryMaxWidth('upToExtraSmall');

  return (
    <StrictMode>
      <ThemeProvider theme={theme}>
        <AnimatedModalStack>
          <Router>
            <Routes>
              {/* <Route
                path={routes.landing}
                element={
                  <Suspense fallback={<Loading />}>
                    <LandingPage />
                  </Suspense>
                }
              /> */}
              {/* <Route
                path={routes.intelligence}
                element={
                  <Suspense fallback={<Loading />}>
                    <IntelligencePage />
                  </Suspense>
                }
              />
              <Route
                path={routes.strategy}
                element={
                  <Suspense fallback={<Loading />}>
                    <StrategyPage />
                  </Suspense>
                }
              /> */}
              <Route
                path={routes['not-found']}
                element={
                  <Suspense fallback={<Loading />}>
                    <NotFoundPage />
                  </Suspense>
                }
              />
              <Route
                path={'/tokenomics'}
                element={
                  <Suspense fallback={<Loading />}>
                    <Tokenomics />
                  </Suspense>
                }
              />
              <Route
                path={routes.app + '/*'}
                element={
                  <Suspense fallback={<Loading />}>
                    <AppPage />
                  </Suspense>
                }
              />
              <Route path="*" element={<Navigate to={{ pathname: routes.swap }} />} />
            </Routes>
          </Router>
          <Toaster
            reverseOrder
            position={isUpToExtraSmall ? 'bottom-center' : 'top-right'}
            toastOptions={{
              duration: 20000,
            }}
            gutter={20}
          />
        </AnimatedModalStack>
      </ThemeProvider>
    </StrictMode>
  );
}
