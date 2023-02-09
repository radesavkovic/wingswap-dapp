import { ApexOptions } from 'apexcharts';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Flex, FlexProps, Text } from 'theme-ui';

import graphs from '../../../graph';
import { formattedNum } from '../../../utils/numbers';

type Props = Omit<FlexProps, 'sx'>;

export default function LiquidityOverview(props: Props) {
  const { className } = props;

  const chartData = graphs.hooks.global.useChartData();
  const daily = chartData[0] as {
    id: string;
    date: number;
    dailyVolumeETH: string;
    dailyVolumeUSD: string;
    totalLiquidityETH: string;
    totalLiquidityUSD: string;
  }[];

  const data = useMemo(() => {
    return (daily ?? []).reduce<{ dates: number[]; values: number[] }>(
      (memo, value) => {
        if (dayjs.unix(value.date).isBefore(dayjs().subtract(6, 'months').startOf('month'))) return memo;
        return {
          dates: [...memo.dates, value.date],
          values: [...memo.values, Number(value.totalLiquidityUSD)],
        };
      },
      { dates: [], values: [] },
    );
  }, [daily]);

  const options = useMemo<ApexOptions>(() => {
    return {
      chart: {
        type: 'area',
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      grid: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
        width: 1,
        colors: ['#71D7BE'],
        fill: {
          colors: ['rgba(113, 215, 190, 0.8)'],
        },
      },
      xaxis: {
        type: 'datetime',
        categories: data.dates,
        labels: {
          datetimeUTC: false,
          formatter: (val, timestamp, opts) => {
            return dayjs.unix(timestamp ?? 0).format('MMM YY');
          },
        },
        tooltip: {
          enabled: false,
        },
      },
      yaxis: {
        show: false,
      },
      tooltip: {
        enabled: true,
        custom: ({ series, seriesIndex, dataPointIndex, w }) => {
          const { dates, values } = data ?? {};
          let label = '$0';
          let value = '';
          if (dataPointIndex > -1 && dates[dataPointIndex] && values[dataPointIndex]) {
            label = formattedNum(values[dataPointIndex], true);
            value = dayjs.unix(dates[dataPointIndex]).format('MMM DD, YYYY UTCZ');
          }

          return `
            <div class="tooltip-content">
              <h5>${label}</h5>
              <span>${value}</span>
            </div>
          `;
        },
      },
    };
  }, [data]);

  const series = useMemo(() => {
    return [
      {
        name: 'LiquidityOverview',
        data: data.values,
      },
    ];
  }, [data.values]);

  return (
    <Flex
      className={className}
      sx={{
        flexDirection: 'column',
        backgroundColor: 'dark.500',
        borderRadius: 'lg',
        padding: 16,
        position: 'relative',
        '.apexcharts-tooltip': {
          top: '0px !important',
          left: '0px !important',
          opacity: '1 !important',
          border: 'none !important',
          background: 'none !important',
          boxShadow: 'none !important',
          height: 56,
          '.apexcharts-tooltip-title': { display: 'none' },
          '.tooltip-content': {
            h5: {
              variant: 'text.heading',
              fontSize: 3,
              marginY: '4px',
              fontFamily:
                '"DM Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
            },
            span: {
              fontSize: 0,
              color: 'white.300',
              height: 18,
              fontFamily:
                '"DM Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
            },
          },
        },
      }}
    >
      <Flex sx={{ justifyContent: 'space-between' }}>
        <Text sx={{ color: 'white.100', fontWeight: 'medium' }}>Liquidity</Text>
      </Flex>
      <ReactApexChart options={options} series={series} type="area" height={236} width={'100%'} />
    </Flex>
  );
}
