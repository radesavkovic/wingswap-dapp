import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import dayjs from 'dayjs';

import { GLOBAL_CHART } from '../queries';

type GlobalChartResponse = {
  id: string;
  date: number;
  dailyVolumeETH: string;
  dailyVolumeUSD: string;
  totalLiquidityETH: string;
  totalLiquidityUSD: string;
};

/**
 * Get historical data for volume and liquidity used in global charts
 * on main page
 * @param {*} oldestDateToFetch // start of window to fetch from
 */
export default async function getChartData(
  oldestDateToFetch: number,
  dataClient: ApolloClient<NormalizedCacheObject>,
): Promise<[GlobalChartResponse[], { date: number; weeklyVolumeUSD: number }[]]> {
  let data: GlobalChartResponse[] = [];
  const weeklyData: { date: number; weeklyVolumeUSD: number }[] = [];
  const utcEndTime = dayjs.utc();
  let skip = 0;
  let allFound = false;

  try {
    while (!allFound) {
      const result = await dataClient.query({
        query: GLOBAL_CHART,
        variables: {
          startTime: oldestDateToFetch,
          skip,
        },
        fetchPolicy: 'cache-first',
      });
      skip += 1000;
      data = result?.data?.uniswapDayDatas && data.concat(result?.data?.uniswapDayDatas);

      if (result?.data?.uniswapDayDatas?.length < 1000) {
        allFound = true;
      }
    }

    if (data) {
      const dayIndexSet = new Set();
      const dayIndexArray: GlobalChartResponse[] = [];
      const oneDay = 24 * 60 * 60;

      // for each day, parse the daily volume and format for chart array
      data.forEach((dayData, i) => {
        // add the day index to the set of days
        dayIndexSet.add((data[i].date / oneDay).toFixed(0));
        dayIndexArray.push(data[i]);
      });

      // fill in empty days ( there will be no day datas if no trades made that day )
      let timestamp = data[0].date ? data[0].date : oldestDateToFetch;
      let latestLiquidityUSD = data[0].totalLiquidityUSD;
      let index = 1;
      while (timestamp < utcEndTime.unix() - oneDay) {
        const nextDay = timestamp + oneDay;
        const currentDayIndex = (nextDay / oneDay).toFixed(0);

        if (!dayIndexSet.has(currentDayIndex)) {
          data.push({
            id: '',
            date: nextDay,
            dailyVolumeETH: '0',
            dailyVolumeUSD: '0',
            totalLiquidityETH: '',
            totalLiquidityUSD: latestLiquidityUSD,
          });
        } else {
          latestLiquidityUSD = dayIndexArray[index].totalLiquidityUSD;
          index = index + 1;
        }
        timestamp = nextDay;
      }
    }

    // format weekly data for weekly sized chunks
    data = data.sort((a, b) => (a.date > b.date ? 1 : -1));
    let startIndexWeekly = -1;
    let currentWeek = -1;

    data.forEach((entry, i) => {
      const week = dayjs.utc(dayjs.unix(data[i].date)).week();
      if (week !== currentWeek) {
        currentWeek = week;
        startIndexWeekly++;
      }
      weeklyData[startIndexWeekly] = weeklyData[startIndexWeekly] || {};
      weeklyData[startIndexWeekly].date = data[i].date;
      weeklyData[startIndexWeekly].weeklyVolumeUSD =
        (weeklyData[startIndexWeekly].weeklyVolumeUSD ?? '0') + parseFloat(data[i].dailyVolumeUSD);
    });
  } catch (e) {
    console.log(e);
  }

  return [data, weeklyData];
}
