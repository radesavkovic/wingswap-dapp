import { Currency } from '@wingsswap/sdk';
import dayjs from 'dayjs';
import last from 'lodash/last';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { Button, Flex, FlexProps, Grid, Text } from 'theme-ui';

import useMetrics from '../../../hooks/grpc/useMetric';
import usePrevious from '../../../hooks/usePrevious';
import { GetMetricResponse, GetMetricResult } from '../../../services/proto/CryptoInfo_pb';
import { capitalizeFirstLetter } from '../../../utils/strings';
import Chart from './chart';
import getMetric, { MetricId } from './metrics';

interface Props extends Omit<FlexProps, 'sx'> {
  title: string;
  metrics: MetricId[];
  pair: { from: Currency | undefined; to: Currency | undefined };
  onUpdateScores: Dispatch<
    SetStateAction<{
      from: {
        [key: string]: number;
      };
      to: {
        [key: string]: number;
      };
    }>
  >;
}

function resolveData(data: { [key: string]: GetMetricResponse.AsObject }) {
  return Object.keys(data).reduce((memo, key) => {
    const metric = getMetric(key as MetricId);
    memo = [...memo, { name: metric.title, data: data[key].respList }];
    return memo;
  }, [] as { name: string; data: Array<GetMetricResult.AsObject> }[]);
}

export default function ChartSection(props: Props) {
  const {
    title,
    metrics,
    pair: { from, to },
    onUpdateScores,
    ...restProps
  } = props;

  const previousFromToken = usePrevious(from);

  const values0 = useMetrics(metrics, from?.wrapped);
  const values1 = useMetrics(metrics, to?.wrapped);

  const [selectedToken, setSelectedToken] = useState<0 | 1>(0);
  const [period, setPeriod] = useState<7 | 30 | 90>(90);

  const fromDate = dayjs.utc().subtract(period, 'days');

  const metrics0 = useMemo(() => {
    return Object.keys(values0).reduce((memo, metric) => {
      const list = values0[metric].respList.filter((el) => dayjs.unix(el.timestamp).isAfter(fromDate));
      memo[metric] = { respList: list };
      return memo;
    }, {} as typeof values0);
  }, [fromDate, values0]);

  const metrics1 = useMemo(() => {
    return Object.keys(values1).reduce((memo, metric) => {
      const list = values1[metric].respList.filter((el) => dayjs.unix(el.timestamp).isAfter(fromDate));
      memo[metric] = { respList: list };
      return memo;
    }, {} as typeof values1);
  }, [fromDate, values1]);

  const score0 = useMemo(() => {
    const sum = Object.keys(values0).reduce((memo, metric) => {
      const lastEl = last(values0[metric].respList);
      return memo + (lastEl?.ranking ?? 0);
    }, 0);
    return Object.keys(values0).length === 0 ? 0 : sum / Object.keys(values0).length;
  }, [values0]);

  const score1 = useMemo(() => {
    const sum = Object.keys(values1).reduce((memo, metric) => {
      const lastEl = last(values1[metric].respList);
      return memo + (lastEl?.ranking ?? 0);
    }, 0);
    return Object.keys(values1).length === 0 ? 0 : sum / Object.keys(values1).length;
  }, [values1]);

  useEffect(() => {
    onUpdateScores((v) => {
      const _v = { ...v };
      _v.from = { ..._v.from, [title]: score0 };
      _v.to = { ...v.to, [title]: score1 };
      return _v;
    });
  }, [onUpdateScores, score0, score1, title]);

  useEffect(() => {
    if (from && !previousFromToken) {
      setSelectedToken(0);
    }
  }, [from, previousFromToken]);

  return (
    <Flex
      {...restProps}
      sx={{
        flexDirection: 'column',
      }}
    >
      <Flex sx={{ justifyContent: 'space-between', alignItems: 'center', marginTop: 24 }}>
        <Text variant="body300" sx={{ color: 'velvet.300' }}>
          {title}
        </Text>
        <Text variant="caps100" sx={{ color: 'dark.200' }}>
          {`Last update at ${dayjs().subtract(1, 'day').format('MMM D, YYYY')}`}
        </Text>
      </Flex>
      <Flex
        sx={{
          width: '100%',
          padding: 12,
          bg: 'dark.400',
          marginTop: '8px',
          borderRadius: 'lg',
          border: '1px solid #3C3F5A',
          flexDirection: 'column',
        }}
      >
        <Grid gap={12} columns={[1, null, 2]} sx={{ marginBottom: 12 }}>
          <MetricScore
            title={title}
            token={from}
            active={selectedToken === 0}
            onClick={() => setSelectedToken(0)}
            score={score0}
            totalScore={5}
          />
          <MetricScore
            title={title}
            token={to}
            active={selectedToken === 1}
            onClick={() => setSelectedToken(1)}
            score={score1}
            totalScore={5}
          />
        </Grid>
        <Chart
          sx={{ marginTop: 12 }}
          token={selectedToken === 0 ? from : to}
          period={period}
          changePeriod={setPeriod}
          series={selectedToken === 0 ? resolveData(metrics0) : resolveData(metrics1)}
          labels={metrics.map((el) => getMetric(el).title)}
        />
      </Flex>
    </Flex>
  );
}

interface MetricScoreProps {
  title: string;
  active: boolean;
  onClick: () => void;
  score: number;
  totalScore: number;
  token?: Currency;
}

function MetricScore({ title, active, score, totalScore, token, onClick }: MetricScoreProps) {
  const color = useMemo(() => {
    if (score >= 17) return 'green.200';
    if (score >= 13) return 'green.200';
    if (score >= 9) return 'orange.200';
    if (score >= 5) return 'red.200';
    return 'red.200';
  }, [score]);

  if (!token) {
    return (
      <Flex
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 'lg',
          backgroundColor: 'dark.400',
          padding: 12,
          border: '1px solid #d1d0cd',
        }}
      >
        <Text variant="body200" sx={{ color: 'dark.100' }}>
          {`${capitalizeFirstLetter(title.toLowerCase())} Score`}
        </Text>
      </Flex>
    );
  }

  return (
    <Button
      variant="ghost"
      sx={{
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 'lg',
        backgroundColor: active ? 'dark.300' : 'dark.400',
        padding: 12,
        border: '1px solid #3C3F5A',
        '&&:hover': {
          backgroundColor: 'dark.300',
        },
      }}
      onClick={onClick}
    >
      <Text variant={active ? 'body300' : 'body100'}>{`${token.symbol} Score`}</Text>
      <Text variant={active ? 'body300' : 'body100'} sx={{ color }}>
        {score}/{totalScore}
      </Text>
    </Button>
  );
}
