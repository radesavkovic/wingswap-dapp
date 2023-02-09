import { stringify } from 'qs';

const routes = {
  landing: '/landing',
  intelligence: '/intelligence',
  strategy: '/strategy',
  'not-found': '/not-found',

  app: '/app',

  swap: '/app/swap',
  swapNext: '/app/swap/next',

  pool: '/app/pool',
  'pool-detail': '/app/pool/detail',
  'pool-import': '/app/pool/import',
  'pool-add': '/app/pool/add',
  'pool-remove': '/app/pool/remove',

  chart: '/app/chart',
  'chart-overview': '/app/chart/overview',
  'chart-pools': '/app/chart/pools',
  'chart-tokens': '/app/chart/tokens',
  'chart-token': '/app/chart/token/:address',
  'chart-pool': '/app/chart/pool/:address',
};

export default routes;

export function buildRoute(params: { [key: string]: string | undefined }, location: { path: string; hash?: string }) {
  const { path, hash } = location;
  const queryString = stringify(params);
  return `${path}?${queryString}${hash ?? ''}`;
}
