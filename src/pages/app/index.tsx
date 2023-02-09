import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { NetworkContextName } from '../../constants';
import { persistor, store } from '../../reducers';
import getLibrary from '../../utils/getLibrary';
import AppRouter from './app-router';
import ReferralUrlParser from './refferalAddress';
const Web3ReactProviderReloaded = createWeb3ReactRoot(NetworkContextName);
if (!!window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false;
}

export default function Pages() {
  return (
    <Provider store={store}>
      <PersistGate loading={<div />} persistor={persistor}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Web3ReactProviderReloaded getLibrary={getLibrary}>
            <ReferralUrlParser>
              <AppRouter />
            </ReferralUrlParser>
          </Web3ReactProviderReloaded>
          </Web3ReactProvider>
      </PersistGate>
    </Provider>
  );
}
