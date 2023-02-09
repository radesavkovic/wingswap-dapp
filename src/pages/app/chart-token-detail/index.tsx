import { useCallback } from 'react';
import { FiExternalLink } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import { Flex, Heading, IconButton, Link as ExternalLink } from 'theme-ui';

import TokenLiquidityBlock from '../../../components/blocks/token-liquidity.block';
import TokenPriceBlock from '../../../components/blocks/token-price.block';
import Breadcrumb from '../../../components/breadcrumb/breadcrumb';
import FavoriteButton from '../../../components/buttons/favorite-button';
import Link from '../../../components/links/link';
import TokenLogo from '../../../components/logos/token.logo';
import TransactionTable from '../../../components/tables/transaction.table';
import { mediaWidthTemplates } from '../../../constants/media';
import graphs from '../../../graph';
import { useToken } from '../../../graph/hooks/useToken';
import useTokenTransactions from '../../../graph/hooks/useTokenTransactions';
import useTransactionForRender from '../../../graph/hooks/useTransactionForRender';
import useAppChainId from '../../../hooks/useAppChainId';
import { useMediaQueryMaxWidth } from '../../../hooks/useMediaQuery';
import routes, { buildRoute } from '../../../routes';
import { getAddress } from '../../../utils/getAddress';
import { ExplorerDataType, getExplorerLink } from '../../../utils/getExplorerLink';

export default function ChartTokenDetailPage() {
  const appChainId = useAppChainId();
  const isUpToExtraSmall = useMediaQueryMaxWidth('upToExtraSmall');

  const { address } = useParams<{ address: string }>();
  const data = graphs.hooks.token.useTokenData([address!]);
  const tokenData = data.length > 0 ? data[0] : undefined;

  const dispatch = graphs.useDispatch();
  const watchedData = graphs.hooks.user.useWatchedData();

  const watch = useCallback(() => {
    dispatch(graphs.actions.user.updateWatchedToken({ tokenAddress: address!, chainId: appChainId }));
  }, [address, appChainId, dispatch]);

  const token = useToken(appChainId, tokenData ? { ...tokenData, address: address! } : undefined);
  const transaction = useTokenTransactions(address!);
  const { data: transactionsData, sortedColumn, onSort, filter, onChangeFilter } = useTransactionForRender(transaction);

  if (!token || !tokenData) return null;
  return (
    <Flex sx={{ flexDirection: 'column', width: '100%' }}>
      <Flex sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Breadcrumb
          parentRoute={{ name: 'Tokens', path: routes['chart-tokens'] }}
          currentRoute={{ name: `${tokenData.symbol}` }}
        />
        {isUpToExtraSmall && (
          <Flex sx={{ alignItems: 'center' }}>
            <FavoriteButton sx={{ marginRight: 20 }} active={!!watchedData.tokens[address!]} onClick={watch} />
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
          <TokenLogo currency={token} />
        </Flex>
        <Heading variant="styles.h5" sx={{ marginRight: 12 }}>
          {`${tokenData.name} (${tokenData.symbol})`}
        </Heading>

        {!isUpToExtraSmall && (
          <>
            <FavoriteButton sx={{ marginRight: 20 }} active={!!watchedData.tokens[address!]} onClick={watch} />
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
              to={buildRoute({ address0: getAddress(token) }, { path: routes['pool-add'] })}
            >
              Add liquidity
            </Link>
            <Link
              variant="buttons.small-primary"
              sx={{ textDecoration: 'none', minWidth: 108 }}
              to={buildRoute({ from: getAddress(token) }, { path: routes.swapNext })}
            >
              Swap
            </Link>
          </Flex>
        )}
      </Flex>

      <Flex sx={{ flexDirection: 'row', ...mediaWidthTemplates.upToSmall({ flexDirection: 'column' }) }}>
        <TokenPriceBlock
          sx={{
            height: 144,
            width: '25%',
            minWidth: 360,
            backgroundColor: 'dark.500',
            borderRadius: 'lg',
            flexDirection: 'column',
            ...mediaWidthTemplates.upToSmall({
              minWidth: 'initial',
              width: '100%',
              marginBottom: 24,
            }),
          }}
          priceUSD={tokenData.priceUSD}
          priceUSDChange={tokenData.priceChangeUSD}
        />

        {isUpToExtraSmall && (
          <Flex sx={{ marginBottom: 24 }}>
            <Link
              variant="buttons.secondary"
              sx={{ textDecoration: 'none', marginRight: 12, minWidth: 108, flex: 1 }}
              to={buildRoute({ address0: getAddress(token) }, { path: routes['pool-add'] })}
            >
              Add liquidity
            </Link>
            <Link
              variant="buttons.primary"
              sx={{ textDecoration: 'none', minWidth: 108, flex: 1 }}
              to={buildRoute({ from: getAddress(token) }, { path: routes.swapNext })}
            >
              Swap
            </Link>
          </Flex>
        )}

        <TokenLiquidityBlock
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
          liquidityUSD={tokenData.totalLiquidityUSD}
          liquidityUSDChange={tokenData.liquidityChangeUSD}
          volumeUSD={tokenData.oneDayVolumeUSD}
          volumeUSDChange={tokenData.volumeChangeUSD}
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
