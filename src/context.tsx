import { createContext, useContext } from 'react';

interface AppContext {
  activeConnectWallet: boolean;
  toggleConnectWallet: () => void;
}

export const AppCtx = createContext({} as AppContext);

export function useAppContext() {
  return useContext(AppCtx);
}
