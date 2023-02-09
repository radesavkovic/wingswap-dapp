import updateNameData from '../../utils/data';
import { get2DayPercentChange, getPercentChange } from '../../utils/percents';

export default function parseTokenData(_data, _oneDayHistory, _twoDayHistory, ethPrice, oldEthPrice) {
  let data = {
    ..._data,
    derivedETH: parseFloat(_data?.derivedETH ?? '0'),
    totalLiquidity: parseFloat(_data?.totalLiquidity ?? '0'),
    tradeVolume: parseFloat(_data?.tradeVolume ?? '0'),
    tradeVolumeUSD: parseFloat(_data?.tradeVolumeUSD ?? '0'),
    txCount: parseFloat(_data?.txCount ?? '0'),
    untrackedVolumeUSD: parseFloat(_data?.untrackedVolumeUSD ?? '0'),
  };

  // used for custom adjustments
  const oneDayData = {
    ..._oneDayHistory,
    derivedETH: parseFloat(_oneDayHistory?.derivedETH ?? '0'),
    totalLiquidity: parseFloat(_oneDayHistory?.totalLiquidity ?? '0'),
    tradeVolume: parseFloat(_oneDayHistory?.tradeVolume ?? '0'),
    tradeVolumeUSD: parseFloat(_oneDayHistory?.tradeVolumeUSD ?? '0'),
    txCount: parseFloat(_oneDayHistory?.txCount ?? '0'),
    untrackedVolumeUSD: parseFloat(_oneDayHistory?.untrackedVolumeUSD ?? '0'),
  };

  const twoDayData = {
    ..._twoDayHistory,
    derivedETH: parseFloat(_twoDayHistory?.derivedETH ?? '0'),
    totalLiquidity: parseFloat(_twoDayHistory?.totalLiquidity ?? '0'),
    tradeVolume: parseFloat(_twoDayHistory?.tradeVolume ?? '0'),
    tradeVolumeUSD: parseFloat(_twoDayHistory?.tradeVolumeUSD ?? '0'),
    txCount: parseFloat(_twoDayHistory?.txCount ?? '0'),
    untrackedVolumeUSD: parseFloat(_twoDayHistory?.untrackedVolumeUSD ?? '0'),
  };

  // calculate percentage changes and daily changes
  const [oneDayVolumeUSD, volumeChangeUSD] = get2DayPercentChange(
    data.tradeVolumeUSD,
    oneDayData.tradeVolumeUSD,
    twoDayData.tradeVolumeUSD,
  );
  data.oneDayVolumeUSD = oneDayVolumeUSD;
  data.volumeChangeUSD = volumeChangeUSD;

  // calculate percentage changes and daily changes
  const [oneDayVolumeUT, volumeChangeUT] = get2DayPercentChange(
    data.untrackedVolumeUSD,
    oneDayData.untrackedVolumeUSD,
    twoDayData.untrackedVolumeUSD,
  );
  data.oneDayVolumeUT = oneDayVolumeUT;
  data.volumeChangeUT = volumeChangeUT;

  // calculate percentage changes and daily changes
  const [oneDayTxns, txnChange] = get2DayPercentChange(data.txCount, oneDayData.txCount, twoDayData.txCount);
  data.oneDayTxns = oneDayTxns;
  data.txnChange = txnChange;

  const currentLiquidityUSD = data.totalLiquidity * ethPrice * data.derivedETH;
  const oldLiquidityUSD = oneDayData.totalLiquidity * oldEthPrice * oneDayData.derivedETH;
  data.totalLiquidityUSD = currentLiquidityUSD;
  data.liquidityChangeUSD = getPercentChange(currentLiquidityUSD ?? 0, oldLiquidityUSD ?? 0);

  // set data
  data.priceUSD = data.derivedETH * ethPrice;
  data.priceChangeUSD = getPercentChange(data.derivedETH * ethPrice, oneDayData.derivedETH * oldEthPrice);
  data.oneDayData = oneDayData;
  data.twoDayData = twoDayData;

  // new tokens
  if (!oneDayData && data) {
    data.oneDayVolumeUSD = data.tradeVolumeUSD;
    data.oneDayVolumeETH = data.tradeVolume * data.derivedETH;
    data.oneDayTxns = data.txCount;
  }

  // format incorrect names
  data = updateNameData({ token0: data })?.token0 ?? data;

  return data;
}
