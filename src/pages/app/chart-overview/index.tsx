import { SupportedChainId } from '@wingsswap/sdk';
import { FiArrowRight } from 'react-icons/fi';
import { useNavigate } from 'react-router';
import { Button, Flex, Heading, Text } from 'theme-ui';

import PairTable from '../../../components/tables/pair.table';
import TokenTable from '../../../components/tables/token.table';
import { mediaWidthTemplates } from '../../../constants/media';
import graphs from '../../../graph';
import { down, up } from '../../../graph/constants';
import useAppChainId from '../../../hooks/useAppChainId';
import routes from '../../../routes';
import { formatAmount, formattedNum } from '../../../utils/numbers';
import LiquidityOverview from './liquidity-overview';
import VolumeOverview from './volume-overview';

export default function ChartOverviewPage() {
  const appChainId = useAppChainId();

  const navigate = useNavigate();
  const pairs = graphs.hooks.pair.useAllPairs();
  const tokens = graphs.hooks.token.useAllTokens();

  const factoryData = graphs.useSelector((state) => state.global.ofChain[appChainId].factoryData);
  const prices = graphs.hooks.global.useEthPrice();
  const {
    data: pairData,
    sortedColumn: pairSortedColumn,
    onSort: onPairSort,
  } = graphs.hooks.pair.usePairListForRender(pairs);
  const {
    data: tokenData,
    sortedColumn: tokenSortedColumn,
    onSort: onTokenSort,
  } = graphs.hooks.token.useTokenListForRender(tokens);

  const symbol = appChainId === SupportedChainId.SMART_CHAIN ? 'BNB' : 'ETH';

  return (
    <Flex
      sx={{
        width: '100%',
        flexDirection: 'column',
        backgroundColor: 'dark.400',
      }}
    >
      <Flex
        sx={{
          flexDirection: 'column',
          alignItems: 'flex-start',
          marginTop: 28,
          ...mediaWidthTemplates.upToExtraSmall({
            marginTop: 16,
          }),
        }}
      >
        <Text sx={{ marginBottom: '8px', textTransform: 'uppercase', color: 'white.300', fontWeight: 'bold' }}>
          Overview
        </Text>
        <Flex sx={{ marginY: 16 }}>
          <Heading variant="styles.h6" sx={{ fontSize: 1 }}>
            {`${symbol} Price ${formattedNum(prices?.currentDayEthPrice, true)}`}
          </Heading>
        </Flex>

        <Flex
          sx={{
            width: '100%',
            flexDirection: 'row',
            '&>div:first-of-type': { marginRight: 24, marginBottom: 0 },
            ...mediaWidthTemplates.upToExtraSmall({
              flexDirection: 'column',
              '&>div:first-of-type': { marginRight: 0, marginBottom: 12 },
            }),
          }}
        >
          <LiquidityOverview sx={{ flex: 1 }} />
          <VolumeOverview sx={{ flex: 1 }} />
        </Flex>
        <Flex
          sx={{
            height: 56,
            width: '100%',
            backgroundColor: 'dark.500',
            borderRadius: 'lg',
            alignItems: 'center',
            marginTop: 12,
            paddingX: 16,
            flexDirection: 'row',
            ...mediaWidthTemplates.upToSmall({
              flexDirection: 'column',
              alignItems: 'flex-start',
              height: 'initial',
              paddingY: 16,
            }),
          }}
        >
          <Flex>
            <Text sx={{ color: 'white.200', ...mediaWidthTemplates.upToSmall({ marginBottom: 16 }) }}>
              Transactions (24H):
            </Text>
            <Text sx={{ marginX: '4px' }}>{formatAmount(factoryData?.oneDayTxns)}</Text>
          </Flex>
          <Flex sx={{ marginLeft: 32, ...mediaWidthTemplates.upToSmall({ marginLeft: 0, marginBottom: 16 }) }}>
            <Text sx={{ color: 'white.200' }}>Pairs:</Text>
            <Text sx={{ marginX: '4px' }}>{formatAmount(factoryData?.pairCount)}</Text>
          </Flex>
          <Flex sx={{ marginLeft: 32, ...mediaWidthTemplates.upToSmall({ marginLeft: 0, marginBottom: 16 }) }}>
            <Text sx={{ color: 'white.200' }}>Fees (24H):</Text>
            <Text sx={{ marginX: '4px' }}>{formattedNum(factoryData?.oneDayVolumeUSD * 0.003, true)}</Text>
          </Flex>
          <Flex sx={{ marginLeft: 32, ...mediaWidthTemplates.upToSmall({ marginLeft: 0 }) }}>
            <Text sx={{ color: 'white.200' }}>Volume (24H):</Text>
            <Text sx={{ marginX: '4px' }}>{`${formattedNum(factoryData?.oneDayVolumeUSD, true)}`}</Text>
            <Text
              sx={{
                color:
                  factoryData?.volumeChangeUSD > 0
                    ? 'green.200'
                    : factoryData?.volumeChangeUSD < 0
                    ? 'red.200'
                    : 'dark.200',
              }}
            >{`(${factoryData?.volumeChangeUSD > 0 ? up : factoryData?.volumeChangeUSD < 0 ? down : '0'}${Math.abs(
              factoryData?.volumeChangeUSD ?? 0,
            ).toFixed(2)}%)`}</Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex sx={{ flexDirection: 'row', ...mediaWidthTemplates.upToSmall({ flexDirection: 'column' }) }}>
        <Flex
          sx={{
            flex: 1,
            flexDirection: 'column',
            marginRight: 24,
            ...mediaWidthTemplates.upToSmall({ marginRight: 0 }),
          }}
        >
          <Flex
            sx={{
              alignItems: 'center',
              marginBottom: '8px',
              justifyContent: 'space-between',
              marginTop: 28,
              ...mediaWidthTemplates.upToSmall({
                marginTop: 24,
              }),
            }}
          >
            <Text sx={{ color: 'white.300', fontWeight: 'bold' }}>ALL TOKENS</Text>
          </Flex>

          <TokenTable
            data={tokenData}
            maxItems={6}
            sortedColumn={tokenSortedColumn}
            footer={() => {
              return (
                <Flex sx={{ alignItems: 'center', alignSelf: 'flex-end', marginTop: 12 }}>
                  <Button
                    variant={'buttons.small-link'}
                    sx={{
                      height: 24,
                    }}
                    onClick={() => {
                      navigate(routes['chart-tokens']);
                    }}
                  >
                    View all tokens
                    <FiArrowRight />
                  </Button>
                </Flex>
              );
            }}
            onHeaderClick={onTokenSort}
            onRowClick={(id) => {
              navigate(`/app/chart/token/${id}`);
            }}
          />
        </Flex>
        <Flex sx={{ flex: 1, flexDirection: 'column' }}>
          <Flex
            sx={{
              alignItems: 'center',
              marginBottom: '8px',
              justifyContent: 'space-between',
              marginTop: 28,
              ...mediaWidthTemplates.upToSmall({
                marginTop: 24,
              }),
            }}
          >
            <Text sx={{ color: 'white.300', fontWeight: 'bold' }}>ALL POOLS</Text>
          </Flex>

          <PairTable
            data={pairData}
            maxItems={6}
            sortedColumn={pairSortedColumn}
            footer={() => {
              return (
                <Flex sx={{ alignItems: 'center', alignSelf: 'flex-end', marginTop: 12 }}>
                  <Button
                    variant={'buttons.small-link'}
                    sx={{
                      height: 24,
                    }}
                    onClick={() => {
                      navigate(routes['chart-pools']);
                    }}
                  >
                    View all pools
                    <FiArrowRight />
                  </Button>
                </Flex>
              );
            }}
            onHeaderClick={onPairSort}
            onRowClick={(id) => {
              navigate(`/app/chart/pool/${id}`);
            }}
          />
        </Flex>
      </Flex>
    </Flex>
  );
}
