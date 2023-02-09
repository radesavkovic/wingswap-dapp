import { TRACKED_OVERRIDES } from '../../constants';
import updateNameData from '../../utils/data';
import { get2DayPercentChange, getPercentChange } from '../../utils/percents';

export function parsePairData(_data, _oneDayHistory, _twoDayHistory, _oneWeekHistory, ethPrice, oneDayBlock) {
  let data = {
    ..._data,
    createdAtTimestamp: parseFloat(_data?.createdAtTimestamp ?? '0'),
    reserve0: parseFloat(_data?.reserve0 ?? '0'),
    reserve1: parseFloat(_data?.reserve1 ?? '0'),
    reserveETH: parseFloat(_data?.reserveETH ?? '0'),
    reserveUSD: parseFloat(_data?.reserveUSD ?? '0'),
    token0Price: parseFloat(_data?.token0Price ?? '0'),
    token1Price: parseFloat(_data?.token1Price ?? '0'),
    totalSupply: parseFloat(_data?.totalSupply ?? '0'),
    trackedReserveETH: parseFloat(_data?.trackedReserveETH ?? '0'),
    txCount: parseFloat(_data?.txCount ?? '0'),
    untrackedVolumeUSD: parseFloat(_data?.untrackedVolumeUSD ?? '0'),
    volumeUSD: parseFloat(_data?.volumeUSD ?? '0'),
    token0: _data?.token0
      ? {
          ..._data.token0,
          totalLiquidity: parseFloat(_data.token0.totalLiquidity ?? '0'),
          derivedETH: parseFloat(_data.token0.derivedETH ?? '0'),
        }
      : undefined,
    token1: _data?.token1
      ? {
          ..._data.token1,
          totalLiquidity: parseFloat(_data.token1.totalLiquidity ?? '0'),
          derivedETH: parseFloat(_data.token1.derivedETH ?? '0'),
        }
      : undefined,
  };

  const oneDayData = {
    ..._oneDayHistory,
    reserveUSD: parseFloat(_oneDayHistory?.reserveUSD ?? '0'),
    untrackedVolumeUSD: parseFloat(_oneDayHistory?.untrackedVolumeUSD ?? '0'),
    volumeUSD: parseFloat(_oneDayHistory?.volumeUSD ?? '0'),
  };

  const twoDayData = {
    ..._twoDayHistory,
    reserveUSD: parseFloat(_twoDayHistory?.reserveUSD ?? '0'),
    untrackedVolumeUSD: parseFloat(_twoDayHistory?.untrackedVolumeUSD ?? '0'),
    volumeUSD: parseFloat(_twoDayHistory?.volumeUSD ?? '0'),
  };

  const oneWeekData = {
    ..._oneWeekHistory,
    reserveUSD: parseFloat(_oneWeekHistory?.reserveUSD ?? '0'),
    untrackedVolumeUSD: parseFloat(_oneWeekHistory?.untrackedVolumeUSD ?? '0'),
    volumeUSD: parseFloat(_oneWeekHistory?.volumeUSD ?? '0'),
  };

  // get volume changes
  const [oneDayVolumeUSD, volumeChangeUSD] = get2DayPercentChange(
    data.volumeUSD,
    oneDayData.volumeUSD,
    twoDayData.volumeUSD,
  );
  data.oneDayVolumeUSD = oneDayVolumeUSD;
  data.volumeChangeUSD = volumeChangeUSD;

  const [oneDayVolumeUntracked, volumeChangeUntracked] = get2DayPercentChange(
    data.untrackedVolumeUSD,
    oneDayData.untrackedVolumeUSD,
    twoDayData.untrackedVolumeUSD,
  );
  data.oneDayVolumeUntracked = oneDayVolumeUntracked;
  data.volumeChangeUntracked = volumeChangeUntracked;

  const oneWeekVolumeUSD = parseFloat(oneWeekData ? data.volumeUSD - oneWeekData.volumeUSD : data.volumeUSD);
  const oneWeekVolumeUntracked = parseFloat(
    oneWeekData ? data.untrackedVolumeUSD - oneWeekData.untrackedVolumeUSD : data.untrackedVolumeUSD,
  );
  data.oneWeekVolumeUSD = oneWeekVolumeUSD;
  data.oneWeekVolumeUntracked = oneWeekVolumeUntracked;

  // set liquidity properties
  data.trackedReserveUSD = data.trackedReserveETH * ethPrice;
  data.liquidityChangeUSD = getPercentChange(data.reserveUSD, oneDayData.reserveUSD);

  // format if pair hasnt existed for a day or a week
  if (!oneDayData && data && data.createdAtBlockNumber > oneDayBlock) {
    data.oneDayVolumeUSD = parseFloat(data.volumeUSD);
  }
  if (!oneDayData && data) {
    data.oneDayVolumeUSD = parseFloat(data.volumeUSD);
  }
  if (!oneWeekData && data) {
    data.oneWeekVolumeUSD = parseFloat(data.volumeUSD);
  }

  if (TRACKED_OVERRIDES.includes(data.id)) {
    data.oneDayVolumeUSD = oneDayVolumeUntracked;
    data.oneWeekVolumeUSD = oneWeekVolumeUntracked;
    data.volumeChangeUSD = volumeChangeUntracked;
    data.trackedReserveUSD = data.reserveUSD;
  }

  // format incorrect names
  data = updateNameData(data);

  return data;
}
