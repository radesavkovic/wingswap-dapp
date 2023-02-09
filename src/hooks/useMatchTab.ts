import { useLocation, useMatch } from 'react-router-dom';

export default function useMatchTab() {
  const matchedSwapRoute = useMatch('/app/swap/*');
  const matchedPoolRoute = useMatch('/app/pool/*');
  const matchedChartRoute = useMatch('/app/chart/*');

  return {
    matchedSwapRoute: matchedSwapRoute !== null,
    matchedPoolRoute: matchedPoolRoute !== null,
    matchedChartRoute: matchedChartRoute !== null,
  };
}
