import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { Flex, Text } from 'theme-ui';

import TokenTable from '../../../components/tables/token.table';
import { mediaWidthTemplates } from '../../../constants/media';
import graphs from '../../../graph';
import useActiveWeb3React from '../../../hooks/useActiveWeb3React';

export default function ChartTokenPage() {
  const { chainId } = useActiveWeb3React();
  const navigate = useNavigate();

  const tokens = graphs.hooks.token.useAllTokens();
  const { data, sortedColumn, onSort } = graphs.hooks.token.useTokenListForRender(tokens);

  const { tokens: addresses } = graphs.hooks.user.useWatchedData();
  const watchedAddresses = Object.keys(addresses);
  const watchedTokens = graphs.hooks.token.useTokenData(watchedAddresses);
  const {
    data: watchedData,
    sortedColumn: watchedSortedColumn,
    onSort: onWatchedSort,
  } = graphs.hooks.token.useTokenListForRender(watchedTokens);

  const dispatch = graphs.useDispatch();
  const watch = useCallback(
    (address: string) => {
      if (!chainId) return;
      dispatch(graphs.actions.user.updateWatchedToken({ tokenAddress: address, chainId }));
    },
    [chainId, dispatch],
  );

  return (
    <Flex
      sx={{
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'dark.400',
      }}
    >
      {watchedData.length > 0 && (
        <>
          <Flex
            sx={{
              alignItems: 'center',
              marginBottom: '8px',
              justifyContent: 'space-between',
              marginTop: 28,
              ...mediaWidthTemplates.upToSmall({
                marginTop: 16,
              }),
            }}
          >
            <Text sx={{ color: 'white.300', fontWeight: 'bold' }}>YOUR WATCHLIST</Text>
          </Flex>

          <TokenTable
            data={watchedData}
            maxItems={10}
            sortedColumn={watchedSortedColumn}
            watchedIds={watchedAddresses}
            onHeaderClick={onWatchedSort}
            onRowClick={(id) => {
              navigate(`/app/chart/token/${id}`);
            }}
            onWatchClick={watch}
          />
        </>
      )}

      <Flex
        sx={{
          alignItems: 'center',
          marginBottom: '8px',
          justifyContent: 'space-between',
          marginTop: 28,
          ...mediaWidthTemplates.upToSmall({
            marginTop: 16,
          }),
        }}
      >
        <Text sx={{ color: 'white.300', fontWeight: 'bold' }}>ALL TOKENS</Text>
      </Flex>

      <TokenTable
        data={data}
        maxItems={10}
        sortedColumn={sortedColumn}
        watchedIds={watchedAddresses}
        onHeaderClick={onSort}
        onRowClick={(id) => {
          navigate(`/app/chart/token/${id}`);
        }}
        onWatchClick={watch}
      />
    </Flex>
  );
}
