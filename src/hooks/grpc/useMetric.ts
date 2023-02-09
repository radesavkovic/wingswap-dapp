import { Token } from '@wingsswap/sdk';
import { useEffect, useState } from 'react';

import { GetMetricRequest, GetMetricResponse } from '../../services/proto/CryptoInfo_pb';
import useClient from './client';
import useWrappedTokenKeyword from './useWrappedTokenKeyword';

export default function useMetrics(metrics: string[], token?: Token) {
  const [metric, setMetric] = useState<{ [key: string]: GetMetricResponse.AsObject }>({});
  const { cryptoInfoClient } = useClient();
  const keyword = useWrappedTokenKeyword(token);

  useEffect(() => {
    async function fetch(m: string) {
      if (!keyword) return;
      const request = new GetMetricRequest();
      request.setKeyword(keyword);
      request.setMetric(m);

      try {
        const response = await cryptoInfoClient.getMetric(request, null);
        setMetric((v) => ({ ...v, [m]: response.toObject() }));
      } catch (error) {
        console.log(error);
      }
    }

    for (const m of metrics) {
      fetch(m);
    }
  }, [cryptoInfoClient, keyword, metrics]);

  return metric;
}
