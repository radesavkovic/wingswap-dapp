import { useMemo } from 'react';

import getBackendURL from '../../services/getBackendURL';
import { CryptoInfoClient } from '../../services/proto/CryptoInfoServiceClientPb';

function getClient() {
  const baseURL = getBackendURL();
  const cryptoInfoClient = new CryptoInfoClient(baseURL);
  return { cryptoInfoClient };
}

export default function useClient() {
  const client = getClient();
  // eslint-disable-next-line
  return useMemo(() => client, []);
}
