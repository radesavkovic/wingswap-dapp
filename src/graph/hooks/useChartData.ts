import { useEffect, useState } from 'react';

import useActiveWeb3React from '../../hooks/useActiveWeb3React';
import graphs from '..';
import { TimeframeOptions } from '../constants';
import getChartData from '../data/getChartData';
import { getTimeframe } from '../utils/timeframes';
import { useClients } from './useClients';

export default function useChartData() {
  const { chainId } = useActiveWeb3React();
  const { dataClient } = useClients();

  const dispatch = graphs.useDispatch();
  const chartData = graphs.useSelector((state) => state.global.ofChain[chainId ?? -1].chartData);
  const timeFrame =
    graphs.useSelector((state) => state.global.ofChain[chainId ?? -1].timeFrame) ?? TimeframeOptions.ALL_TIME;
  const { daily: chartDataDaily, weekly: chartDataWeekly } = chartData ?? {};

  const [oldestDateFetch, setOldestDateFetched] = useState<number | undefined>();

  /**
   * Keep track of oldest date fetched. Used to
   * limit data fetched until its actually needed.
   * (dont fetch year long stuff unless year option selected)
   */
  useEffect(() => {
    // based on window, get starttime
    const startTime = getTimeframe(timeFrame);

    if (!oldestDateFetch || (timeFrame && startTime < oldestDateFetch)) {
      setOldestDateFetched(startTime);
    }
  }, [oldestDateFetch, timeFrame]);

  /**
   * Fetch data if none fetched or older data is needed
   */
  useEffect(() => {
    async function fetch() {
      if (!oldestDateFetch) return;

      // historical stuff for chart
      const [newChartData, newWeeklyData] = await getChartData(oldestDateFetch, dataClient!);
      dispatch(
        graphs.actions.global.updateChartData({
          daily: newChartData,
          weekly: newWeeklyData,
          chainId: chainId ?? -1,
        }),
      );
    }

    if (dataClient && oldestDateFetch && !(chartDataDaily && chartDataWeekly)) {
      fetch();
    }
  }, [chainId, chartDataDaily, chartDataWeekly, dataClient, dispatch, oldestDateFetch]);

  return [chartDataDaily, chartDataWeekly];
}
