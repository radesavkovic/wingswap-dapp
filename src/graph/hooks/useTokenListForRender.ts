import { Currency } from '@wingsswap/sdk';
import { useMemo, useState } from 'react';

import { Direction } from '../../components/buttons/header.button';
import { utils } from '../../constants/token';
import useActiveWeb3React from '../../hooks/useActiveWeb3React';
import { formattedNum, formattedPercent } from '../../utils/numbers';
import { TOKEN_SORT_FIELD } from '../constants';
import { TokenData } from '../reducers/types';

function getRenderData(tokenData: TokenData) {
  if (tokenData) {
    const liquidity = formattedNum(tokenData.totalLiquidityUSD, true);

    const dayVolume = formattedNum(tokenData.oneDayVolumeUSD, true);

    const price = formattedNum(tokenData.priceUSD, true);

    const change = formattedPercent(tokenData.priceChangeUSD);

    return {
      liquidity,
      dayVolume,
      price,
      change,
    };
  }

  return null;
}

function getFieldName(field: number) {
  switch (field) {
    case TOKEN_SORT_FIELD.LIQ:
      return 'totalLiquidityUSD';
    case TOKEN_SORT_FIELD.VOL:
      return 'oneDayVolumeUSD';
    case TOKEN_SORT_FIELD.SYMBOL:
      return 'symbol';
    case TOKEN_SORT_FIELD.NAME:
      return 'name';
    case TOKEN_SORT_FIELD.PRICE:
      return 'priceUSD';
    case TOKEN_SORT_FIELD.CHANGE:
      return 'priceChangeUSD';
    default:
      return 'trackedReserveUSD';
  }
}

export default function useTokenListForRender(tokens: TokenData[]) {
  const { chainId } = useActiveWeb3React();

  const [sortedColumn, setSortedColumn] = useState({
    field: TOKEN_SORT_FIELD.VOL,
    direction: Direction.DESC,
  });

  const data = useMemo(() => {
    const rawData = tokens.reduce((memo, token) => {
      const renderData = getRenderData(token);
      if (!renderData) return memo;

      const { liquidity, dayVolume, price, change } = renderData;
      const currency = utils.fromTokenInfo({
        ...token,
        chainId: chainId ?? -1,
        address: token.id,
      });
      return [
        ...memo,
        {
          liquidity,
          dayVolume,
          price,
          change,
          currency,
          ...token,
        },
      ];
    }, [] as Array<TokenData & { currency: Currency; liquidity: string | number; dayVolume: string | number; price: string | number; change: string | number }>);

    return rawData.sort((tokenA, tokenB) => {
      if (sortedColumn.field === TOKEN_SORT_FIELD.SYMBOL || sortedColumn.field === TOKEN_SORT_FIELD.NAME) {
        const value = tokenA[getFieldName(sortedColumn.field)] > tokenB[getFieldName(sortedColumn.field)] ? 1 : -1;
        return sortedColumn.direction === Direction.ASC ? value * -1 : value;
      }
      return sortedColumn.direction === Direction.ASC
        ? parseFloat(tokenA[getFieldName(sortedColumn.field)] as any) -
            parseFloat(tokenB[getFieldName(sortedColumn.field) as any])
        : parseFloat(tokenB[getFieldName(sortedColumn.field)] as any) -
            parseFloat(tokenA[getFieldName(sortedColumn.field) as any]);
    });
  }, [chainId, sortedColumn, tokens]);

  return {
    data,
    sortedColumn,
    onSort: (field: TOKEN_SORT_FIELD) => {
      setSortedColumn((v) => ({
        field,
        direction: v.field === field ? v.direction * -1 : v.direction,
      }));
    },
  };
}
