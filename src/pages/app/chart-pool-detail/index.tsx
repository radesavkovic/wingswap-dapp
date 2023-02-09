import { useCallback } from 'react';
import { FiExternalLink } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import { Flex, Heading, IconButton, Link as ExternalLink, Text } from 'theme-ui';

import PoolLiquidityBlock from '../../../components/blocks/pool-liquidity.block';
import PoolLockBlock from '../../../components/blocks/pool-lock.block';
import PoolPriceBlock from '../../../components/blocks/pool-price.block';
import Breadcrumb from '../../../components/breadcrumb/breadcrumb';
import FavoriteButton from '../../../components/buttons/favorite-button';
import Link from '../../../components/links/link';
import DualTokenLogo from '../../../components/logos/dual-token.logo';
import TransactionTable from '../../../components/tables/transaction.table';
import { mediaWidthTemplates } from '../../../constants/media';
import graphs from '../../../graph';
import useEthPrice from '../../../graph/hooks/useEthPrice';
import usePairTransactions from '../../../graph/hooks/usePairTransactions';
import { useToken } from '../../../graph/hooks/useToken';
import useTransactionForRender from '../../../graph/hooks/useTransactionForRender';
import useAppChainId from '../../../hooks/useAppChainId';
import { useMediaQueryMaxWidth } from '../../../hooks/useMediaQuery';
import routes, { buildRoute } from '../../../routes';
import { getAddress } from '../../../utils/getAddress';
import { ExplorerDataType, getExplorerLink } from '../../../utils/getExplorerLink';
import { formattedNum, formattedPercent } from '../../../utils/numbers';

export default function ChartPoolDetailPage() {
  const appChainId = useAppChainId();
  const isUpToExtraSmall = useMediaQueryMaxWidth('upToExtraSmall');

  const { address } = useParams<{ address: string }>();

  const data = graphs.hooks.pair.usePairData([address!]);
  const poolData = data.length > 0 ? data[0] : undefined;

  const dispatch = graphs.useDispatch();
  const watchedData = graphs.hooks.user.useWatchedData();

  const watch = useCallback(() => {
    dispatch(graphs.actions.user.updateWatchedPair({ pairAddress: address!, chainId: appChainId }));
  }, [address, appChainId, dispatch]);

  const token0 = useToken(appChainId, poolData ? { ...poolData.token0, address: poolData.token0.id } : undefined);
  const token1 = useToken(appChainId, poolData ? { ...poolData.token1, address: poolData.token1.id } : undefined);
  const prices = useEthPrice();
  const transaction = usePairTransactions(address!);
  const { data: transactionsData, sortedColumn, onSort, filter, onChangeFilter } = useTransactionForRender(transaction);

  if (!poolData || !token0 || !token1) return null;

  const {
    liquidityChangeUSD,
    oneDayVolumeUntracked,
    oneDayVolumeUSD,
    reserve0,
    reserve1,
    reserveUSD,
    trackedReserveUSD,
    volumeChangeUntracked,
    volumeChangeUSD,
  } = poolData;

  const liquidity = reserveUSD ? formattedNum(reserveUSD, true) : formattedNum(trackedReserveUSD, true);
  const usingUtLiquidity = !trackedReserveUSD && !!reserveUSD;
  const liquidityChange = formattedPercent(liquidityChangeUSD);

  // volume
  const volume = !!oneDayVolumeUSD ? formattedNum(oneDayVolumeUSD, true) : formattedNum(oneDayVolumeUntracked, true);
  const usingUtVolume = oneDayVolumeUSD === 0 && !!oneDayVolumeUntracked;
  const volumeChange = formattedPercent(!usingUtVolume ? volumeChangeUSD : volumeChangeUntracked);

  const showUSDWaning = usingUtLiquidity || usingUtVolume;

  // get fees	  // get fees
  const fees =
    oneDayVolumeUSD || oneDayVolumeUSD === 0
      ? usingUtVolume
        ? formattedNum(oneDayVolumeUntracked * 0.003, true)
        : formattedNum(oneDayVolumeUSD * 0.003, true)
      : '-';

  // token data for usd
  const token0USD = prices ? formattedNum(poolData.token0.derivedETH * prices.currentDayEthPrice, true) : '';
  const token1USD = prices ? formattedNum(poolData.token1.derivedETH * prices.currentDayEthPrice, true) : '';

  // rates
  const token0Rate = reserve0 && reserve1 ? formattedNum(reserve1 / reserve0) : '-';
  const token1Rate = reserve0 && reserve1 ? formattedNum(reserve0 / reserve1) : '-';

  // formatted symbols for overflow
  const formattedSymbol0 =
    token0.symbol && token0.symbol.length > 6 ? token0.symbol.slice(0, 5) + '...' : token0.symbol;
  const formattedSymbol1 =
    token1.symbol && token1.symbol.length > 6 ? token1.symbol.slice(0, 5) + '...' : token1.symbol;

  return (
    <Flex sx={{ flexDirection: 'column', width: '100%' }}>
      <Flex sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Breadcrumb
          parentRoute={{ name: 'Pools', path: routes['chart-pools'] }}
          currentRoute={{ name: `${poolData.token0.symbol} - ${poolData.token1.symbol}` }}
        />
        {isUpToExtraSmall && (
          <Flex sx={{ alignItems: 'center' }}>
            <FavoriteButton sx={{ marginRight: 20 }} active={!!watchedData.pairs[address!]} onClick={watch} />
            <IconButton
              as={ExternalLink}
              variant="buttons.small-icon"
              sx={{ color: 'white.400' }}
              {...{ target: '_blank', href: getExplorerLink(appChainId, address!, ExplorerDataType.ADDRESS) }}
            >
              <FiExternalLink />
            </IconButton>
          </Flex>
        )}
      </Flex>
      <Flex
        sx={{
          alignItems: 'center',
          marginY: 44,
          ...mediaWidthTemplates.upToSmall({
            marginTop: 32,
            marginBottom: 24,
          }),
        }}
      >
        <Flex sx={{ alignItems: 'center', marginRight: 20 }}>
          <DualTokenLogo currencyA={token0} currencyB={token1} />
        </Flex>
        <Heading variant="styles.h5" sx={{ marginRight: 12 }}>
          {`${poolData.token0.symbol} - ${poolData.token1.symbol}`}
        </Heading>
        <Flex
          sx={{
            height: 28,
            width: 52,
            marginRight: 30,
            borderRadius: 'lg',
            backgroundColor: 'dark.transparent',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text sx={{ fontSize: 0, fontWeight: 'medium' }}>{'0.3%'}</Text>
        </Flex>

        {!isUpToExtraSmall && (
          <>
            <FavoriteButton sx={{ marginRight: 20 }} active={!!watchedData.pairs[address!]} onClick={watch} />
            <IconButton
              as={ExternalLink}
              variant="buttons.small-icon"
              sx={{ color: 'white.400' }}
              {...{ target: '_blank', href: getExplorerLink(appChainId, address!, ExplorerDataType.ADDRESS) }}
            >
              <FiExternalLink />
            </IconButton>
          </>
        )}

        {!isUpToExtraSmall && (
          <Flex sx={{ marginLeft: 'auto' }}>
            <Link
              variant="buttons.small-secondary"
              sx={{ textDecoration: 'none', marginRight: 12, minWidth: 108 }}
              to={buildRoute(
                { address0: getAddress(token0), address1: getAddress(token1) },
                { path: routes['pool-add'] },
              )}
            >
              Add liquidity
            </Link>
            <Link
              variant="buttons.small-primary"
              sx={{ textDecoration: 'none', minWidth: 108 }}
              to={buildRoute({ from: getAddress(token0), to: getAddress(token1) }, { path: routes.swapNext })}
            >
              Swap
            </Link>
          </Flex>
        )}
      </Flex>

      <Flex sx={{ flexDirection: 'row', ...mediaWidthTemplates.upToSmall({ flexDirection: 'column' }) }}>
        <PoolPriceBlock
          sx={{
            width: '25%',
            minWidth: 264,
            flexDirection: 'column',
            '&>div': {
              height: 64,
            },
            ...mediaWidthTemplates.upToSmall({
              width: '100%',
              marginBottom: 24,
            }),
          }}
          token0={token0}
          token1={token1}
          token0Price={`1 ${formattedSymbol0} = ${token0Rate} ${formattedSymbol1} ${
            poolData.token0.derivedETH ? '(' + token0USD + ')' : ''
          }`}
          token1Price={`1 ${formattedSymbol1} = ${token1Rate} ${formattedSymbol0}  ${
            poolData.token1.derivedETH ? '(' + token1USD + ')' : ''
          }`}
        />

        {isUpToExtraSmall && (
          <Flex sx={{ marginBottom: 24 }}>
            <Link
              variant="buttons.secondary"
              sx={{ textDecoration: 'none', marginRight: 12, minWidth: 108, flex: 1 }}
              to={buildRoute(
                { address0: getAddress(token0), address1: getAddress(token1) },
                { path: routes['pool-add'] },
              )}
            >
              Add liquidity
            </Link>
            <Link
              variant="buttons.primary"
              sx={{ textDecoration: 'none', minWidth: 108, flex: 1 }}
              to={buildRoute({ from: getAddress(token0), to: getAddress(token1) }, { path: routes.swapNext })}
            >
              Swap
            </Link>
          </Flex>
        )}

        <PoolLockBlock
          sx={{
            height: 144,
            width: '25%',
            minWidth: 264,
            marginLeft: 24,
            backgroundColor: 'dark.500',
            borderRadius: 'lg',
            flexDirection: 'column',
            ...mediaWidthTemplates.upToSmall({
              marginLeft: 0,
              marginBottom: 24,
              width: '100%',
            }),
          }}
          token0={token0}
          token1={token1}
          pooledToken0={reserve0 ? Number(reserve0.toFixed(0)).toLocaleString() : ''}
          pooledToken1={reserve1 ? Number(reserve1.toFixed(0)).toLocaleString() : ''}
        />

        <PoolLiquidityBlock
          sx={{
            flex: 1,
            height: 144,
            marginLeft: 24,
            backgroundColor: 'dark.500',
            borderRadius: 'lg',
            ...mediaWidthTemplates.upToSmall({
              marginLeft: 0,
              width: '100%',
            }),
          }}
          liquidity={liquidity}
          liquidityChange={liquidityChange}
          volume={volume}
          volumeChange={volumeChange}
          fees={fees}
        />
      </Flex>
      <Flex
        sx={{
          flexDirection: 'column',
          marginTop: 24,
        }}
      >
        <TransactionTable
          maxItems={10}
          data={transactionsData}
          sortedColumn={sortedColumn}
          onHeaderClick={onSort}
          filter={filter}
          onChangeFilter={onChangeFilter}
        />
      </Flex>
    </Flex>
  );
}
