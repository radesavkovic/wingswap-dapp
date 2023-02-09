import { Token } from '@wingsswap/sdk';
import { useEffect, useState } from 'react';

import { GetCryptoInfoRequest, GetCryptoInfoResponse } from '../../services/proto/CryptoInfo_pb';
import useClient from './client';
import useWrappedTokenKeyword from './useWrappedTokenKeyword';

export default function useCryptoInfo(token?: Token) {
  const [cryptoInfo, setCryptoInfo] = useState<GetCryptoInfoResponse.AsObject>();
  const { cryptoInfoClient } = useClient();
  const keyword = useWrappedTokenKeyword(token);

  useEffect(() => {
    async function fetch() {
      if (!keyword) return;
      const request = new GetCryptoInfoRequest();
      request.setKeyword(keyword);

      try {
        const response = await cryptoInfoClient.getCryptoInfo(request, null);
        setCryptoInfo(response.toObject());
      } catch (error) {
        console.log(error);
      }
    }

    fetch();
  }, [cryptoInfoClient, keyword]);

  return cryptoInfo;
}
