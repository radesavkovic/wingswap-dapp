import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { Checkbox, Flex, Label, Text } from 'theme-ui';

import PairTable from '../../../components/tables/pair.table';
import { mediaWidthTemplates } from '../../../constants/media';
import graphs from '../../../graph';
import useActiveWeb3React from '../../../hooks/useActiveWeb3React';

export default function ChartPoolPage() {
  const { chainId } = useActiveWeb3React();
  const navigate = useNavigate();
  const [useTracked, setUseTracked] = useState(true);

  const pairs = graphs.hooks.pair.useAllPairs();
  const { data, sortedColumn, onSort } = graphs.hooks.pair.usePairListForRender(pairs, useTracked);

  const { pairs: addresses } = graphs.hooks.user.useWatchedData();
  const watchedAddresses = Object.keys(addresses);
  const watchedPairs = graphs.hooks.pair.usePairData(watchedAddresses);
  const {
    data: watchedData,
    sortedColumn: watchedSortedColumn,
    onSort: onWatchedSort,
  } = graphs.hooks.pair.usePairListForRender(watchedPairs);

  const dispatch = graphs.useDispatch();
  const watch = useCallback(
    (address: string) => {
      if (!chainId) return;
      dispatch(graphs.actions.user.updateWatchedPair({ pairAddress: address, chainId }));
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
          <PairTable
            data={watchedData}
            maxItems={10}
            sortedColumn={watchedSortedColumn}
            watchedIds={watchedAddresses}
            onHeaderClick={onWatchedSort}
            onRowClick={(id) => {
              navigate(`/app/chart/pool/${id}`);
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
        <Text sx={{ color: 'white.300', fontWeight: 'bold' }}>ALL POOLS</Text>

        <Flex
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            '& label': {
              width: 'initial',
            },
          }}
        >
          <Label>
            <Checkbox
              defaultChecked={useTracked}
              onChange={({ target }) => {
                setUseTracked(target.checked);
              }}
            />
          </Label>
          <Text sx={{ color: 'white.200' }}>Hide untracked pairs</Text>
        </Flex>
      </Flex>
      <PairTable
        data={data}
        maxItems={10}
        sortedColumn={sortedColumn}
        watchedIds={watchedAddresses}
        onHeaderClick={onSort}
        onRowClick={(id) => {
          navigate(`/app/chart/pool/${id}`);
        }}
        onWatchClick={watch}
      />
    </Flex>
  );
}
