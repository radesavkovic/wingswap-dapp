import { Token } from '@wingsswap/sdk';
import { useMemo, useState } from 'react';

import { Direction } from '../../components/buttons/header.button';
import { utils } from '../../constants/token';
import useActiveWeb3React from '../../hooks/useActiveWeb3React';
import { formattedNum, formattedPercent } from '../../utils/numbers';
import { PAIR_SORT_FIELD } from '../constants';
import { PairData } from '../reducers/types';

function getRenderData(pairData: PairData) {
  if (pairData && pairData.token0 && pairData.token1) {
    const liquidity = formattedNum(
      !!pairData.trackedReserveUSD ? pairData.trackedReserveUSD : pairData.reserveUSD,
      true,
    );

    const apy = formattedPercent(
      ((pairData.oneDayVolumeUSD ? pairData.oneDayVolumeUSD : pairData.oneDayVolumeUntracked) * 0.003 * 365 * 100) /
        (pairData.oneDayVolumeUSD ? pairData.trackedReserveUSD : pairData.reserveUSD),
    );

    const dayVolume = formattedNum(
      pairData.oneDayVolumeUSD ? pairData.oneDayVolumeUSD : pairData.oneDayVolumeUntracked,
      true,
    );

    const weekVolume = formattedNum(
      pairData.oneWeekVolumeUSD ? pairData.oneWeekVolumeUSD : pairData.oneWeekVolumeUntracked,
      true,
    );

    const fees = formattedNum(
      pairData.oneDayVolumeUSD ? pairData.oneDayVolumeUSD * 0.003 : pairData.oneDayVolumeUntracked * 0.003,
      true,
    );

    return {
      liquidity,
      apy,
      dayVolume,
      weekVolume,
      fees,
    };
  }

  return null;
}

function getFieldName(field: number, useTracked: boolean) {
  switch (field) {
    case PAIR_SORT_FIELD.LIQ:
      return useTracked ? 'trackedReserveUSD' : 'reserveUSD';
    case PAIR_SORT_FIELD.VOL:
      return useTracked ? 'oneDayVolumeUSD' : 'oneDayVolumeUntracked';
    case PAIR_SORT_FIELD.VOL_7DAYS:
      return useTracked ? 'oneWeekVolumeUSD' : 'oneWeekVolumeUntracked';
    case PAIR_SORT_FIELD.FEES:
      return useTracked ? 'oneDayVolumeUSD' : 'oneDayVolumeUntracked';
    default:
      return 'trackedReserveUSD';
  }
}

export default function usePairListForRender(pairs: PairData[], useTracked = true) {
  const { chainId } = useActiveWeb3React();

  const [sortedColumn, setSortedColumn] = useState({
    field: PAIR_SORT_FIELD.VOL,
    direction: Direction.DESC,
  });

  const data = useMemo(() => {
    const rawData = pairs.reduce((memo, pair) => {
      if (useTracked && !pair.trackedReserveUSD) return memo;

      const renderData = getRenderData(pair);
      if (!renderData) return memo;

      const { liquidity, apy, dayVolume, weekVolume, fees } = renderData;
      const currencyA = utils.fromTokenInfo({
        ...pair.token0,
        chainId: chainId ?? -1,
        address: pair.token0.id,
      });
      const currencyB = utils.fromTokenInfo({
        ...pair.token1,
        chainId: chainId ?? -1,
        address: pair.token1.id,
      });
      return [
        ...memo,
        {
          liquidity,
          apy,
          dayVolume,
          weekVolume,
          fees,
          currencyA,
          currencyB,
          ...pair,
        },
      ];
    }, [] as Array<PairData & { currencyA: Token; currencyB: Token; liquidity: string | number; apy: string; dayVolume: string | number; weekVolume: string | number; fees: string | number }>);

    return rawData.sort((pairA, pairB) => {
      if (sortedColumn.field === PAIR_SORT_FIELD.APY) {
        const apy0 = (pairA.oneDayVolumeUSD * 0.003 * 356 * 100) / pairA.reserveUSD;
        const apy1 = (pairB.oneDayVolumeUSD * 0.003 * 356 * 100) / pairB.reserveUSD;
        return sortedColumn.direction === Direction.ASC ? apy0 - apy1 : apy1 - apy0;
      }
      return sortedColumn.direction === Direction.ASC
        ? parseFloat(pairA[getFieldName(sortedColumn.field, useTracked)] as any) -
            parseFloat(pairB[getFieldName(sortedColumn.field, useTracked) as any])
        : parseFloat(pairB[getFieldName(sortedColumn.field, useTracked)] as any) -
            parseFloat(pairA[getFieldName(sortedColumn.field, useTracked) as any]);
    });
  }, [chainId, pairs, sortedColumn, useTracked]);

  return {
    data,
    sortedColumn,
    onSort: (field: PAIR_SORT_FIELD) => {
      setSortedColumn((v) => ({
        field,
        direction: v.field === field ? v.direction * -1 : v.direction,
      }));
    },
  };
}
