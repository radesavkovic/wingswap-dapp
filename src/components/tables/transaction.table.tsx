import { ReactNode, useMemo, useState } from 'react';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { Button, Divider, Flex, FlexProps, Grid, IconButton, Link, Text } from 'theme-ui';

import { TRANSACTION_SORT_FIELD } from '../../graph/constants';
import { TransactionRender, TransactionType } from '../../graph/reducers/types';
import useAppChainId from '../../hooks/useAppChainId';
import useBreakPoint from '../../hooks/useBreakPoint';
import useComponentSize from '../../hooks/useComponentSize';
import { shortenAddress } from '../../utils/addresses';
import { formatTime } from '../../utils/datetime';
import { ExplorerDataType, getExplorerLink } from '../../utils/getExplorerLink';
import { formattedNum } from '../../utils/numbers';
import HeaderButton, { Direction } from '../buttons/header.button';

function getTransactionType(event: TransactionType, symbol0: string, symbol1: string) {
  const formattedS0 = symbol0?.length > 8 ? symbol0.slice(0, 7) + '...' : symbol0;
  const formattedS1 = symbol1?.length > 8 ? symbol1.slice(0, 7) + '...' : symbol1;
  switch (event) {
    case TransactionType.ADD:
      return 'Add ' + formattedS0 + ' and ' + formattedS1;
    case TransactionType.REMOVE:
      return 'Remove ' + formattedS0 + ' and ' + formattedS1;
    case TransactionType.SWAP:
      return 'Swap ' + formattedS0 + ' for ' + formattedS1;
    default:
      return '';
  }
}

interface Props extends Omit<FlexProps, 'sx'> {
  data: TransactionRender[];
  maxItems: number;
  sortedColumn: { field: TRANSACTION_SORT_FIELD; direction: Direction };
  footer?: () => ReactNode;
  onHeaderClick: (field: TRANSACTION_SORT_FIELD) => void;
  filter: TransactionType;
  onChangeFilter: (filter: TransactionType) => void;
}

export default function TransactionTable(props: Props) {
  const { className, data, maxItems, sortedColumn, footer, onHeaderClick, filter, onChangeFilter } = props;
  const appChainId = useAppChainId();
  const [currentPage, setCurrentPage] = useState(0);

  const currentData = useMemo<TransactionRender[]>(() => {
    return data.slice(currentPage * maxItems, (currentPage + 1) * maxItems);
  }, [currentPage, data, maxItems]);

  const maxPage = useMemo(() => {
    return Math.ceil(data.length / maxItems);
  }, [data.length, maxItems]);

  const {
    ref,
    dimensions: { width },
  } = useComponentSize<HTMLDivElement>();

  const { upToSmall, upToMedium } = useBreakPoint(width);

  return (
    <Flex
      ref={ref}
      className={className}
      sx={{ flexDirection: 'column', backgroundColor: 'dark.500', borderRadius: 'lg', padding: 16 }}
    >
      <Grid columns={'1.2fr'} sx={{ height: 20, gridAutoFlow: 'column', gridAutoColumns: '1fr' }}>
        <Grid sx={{ gridAutoFlow: 'column', justifyContent: 'start' }} gap={'8px'}>
          <Button
            variant="ghost"
            sx={{
              display: 'flex',
              alignItems: 'center',
              paddingX: '4px',
              paddingY: 0,
              height: 'unset',
            }}
            onClick={() => onChangeFilter(TransactionType.ALL)}
          >
            <Text
              sx={{ fontSize: 0, fontWeight: 'medium', color: filter === TransactionType.ALL ? 'white' : 'white.200' }}
            >
              All
            </Text>
          </Button>
          <Button
            variant="ghost"
            sx={{
              display: 'flex',
              alignItems: 'center',
              paddingX: '4px',
              paddingY: 0,
              height: 'unset',
            }}
            onClick={() => onChangeFilter(TransactionType.SWAP)}
          >
            <Text
              sx={{ fontSize: 0, fontWeight: 'medium', color: filter === TransactionType.SWAP ? 'white' : 'white.200' }}
            >
              Swaps
            </Text>
          </Button>
          <Button
            variant="ghost"
            sx={{
              display: 'flex',
              alignItems: 'center',
              paddingX: '4px',
              paddingY: 0,
              height: 'unset',
            }}
            onClick={() => onChangeFilter(TransactionType.ADD)}
          >
            <Text
              sx={{ fontSize: 0, fontWeight: 'medium', color: filter === TransactionType.ADD ? 'white' : 'white.200' }}
            >
              Adds
            </Text>
          </Button>
          <Button
            variant="ghost"
            sx={{
              display: 'flex',
              alignItems: 'center',
              paddingX: '4px',
              paddingY: 0,
              height: 'unset',
            }}
            onClick={() => onChangeFilter(TransactionType.REMOVE)}
          >
            <Text
              sx={{
                fontSize: 0,
                fontWeight: 'medium',
                color: filter === TransactionType.REMOVE ? 'white' : 'white.200',
              }}
            >
              Removes
            </Text>
          </Button>
        </Grid>
        <HeaderButton
          label="Total Value"
          direction={sortedColumn.field === TRANSACTION_SORT_FIELD.TOTAL_VALUE ? sortedColumn.direction : undefined}
          onClick={() => {
            onHeaderClick(TRANSACTION_SORT_FIELD.TOTAL_VALUE);
          }}
        />
        {!upToSmall && (
          <>
            <HeaderButton
              label="Token Amount"
              direction={
                sortedColumn.field === TRANSACTION_SORT_FIELD.TOKEN_AMOUNT_0 ? sortedColumn.direction : undefined
              }
              onClick={() => {
                onHeaderClick(TRANSACTION_SORT_FIELD.TOKEN_AMOUNT_0);
              }}
            />

            <HeaderButton
              label="Token Amount"
              direction={
                sortedColumn.field === TRANSACTION_SORT_FIELD.TOKEN_AMOUNT_1 ? sortedColumn.direction : undefined
              }
              onClick={() => {
                onHeaderClick(TRANSACTION_SORT_FIELD.TOKEN_AMOUNT_1);
              }}
            />
          </>
        )}
        {!upToMedium && <HeaderButton label="Account" />}
        <HeaderButton
          label="Time"
          direction={sortedColumn.field === TRANSACTION_SORT_FIELD.TIME ? sortedColumn.direction : undefined}
          onClick={() => {
            onHeaderClick(TRANSACTION_SORT_FIELD.TIME);
          }}
        />
      </Grid>
      {currentData.map((pair, index) => {
        const { token0Symbol, token1Symbol, account, amountUSD, token0Amount, token1Amount, timestamp, type, hash } =
          pair;
        return (
          <Flex key={index} sx={{ flexDirection: 'column' }}>
            <Flex sx={{ flex: 1, minHeight: 48, alignItems: 'center' }}>
              <Flex
                variant="styles.row"
                sx={{
                  flexDirection: 'column',
                  width: '100%',
                  padding: 0,
                  maxHeight: '100%',
                  '&:hover': { backgroundColor: 'transparent' },
                  cursor: 'auto',
                }}
              >
                <Grid
                  columns={'1.2fr'}
                  sx={{
                    height: '100%',
                    width: '100%',
                    alignItems: 'center',
                    gridAutoFlow: 'column',
                    gridAutoColumns: '1fr',
                    '& > *': {
                      wordWrap: 'break-word',
                    },
                  }}
                >
                  <Flex sx={{ alignItems: 'center' }}>
                    <Link href={getExplorerLink(appChainId, hash, ExplorerDataType.TRANSACTION)} target="_blank">
                      <Text sx={{ marginLeft: 12 }}>{getTransactionType(type, token1Symbol, token0Symbol)}</Text>
                    </Link>
                  </Flex>
                  <Text sx={{ flex: 1, textAlign: 'right', color: 'white.200' }}>{formattedNum(amountUSD, true)}</Text>
                  {!upToSmall && (
                    <>
                      <Text sx={{ flex: 1, textAlign: 'right', color: 'white.200' }}>
                        {`${formattedNum(token1Amount)} ${token1Symbol}`}
                      </Text>
                      <Text sx={{ flex: 1, textAlign: 'right', color: 'white.200' }}>{`${formattedNum(
                        token0Amount,
                      )}  ${token0Symbol}`}</Text>
                    </>
                  )}
                  {!upToMedium && (
                    <Text sx={{ flex: 1, textAlign: 'right' }}>
                      <Link href={getExplorerLink(appChainId, account, ExplorerDataType.ADDRESS)} target="_blank">
                        {shortenAddress(account)}
                      </Link>
                    </Text>
                  )}
                  <Text sx={{ flex: 1, textAlign: 'right', color: 'white.200' }}>{`${formatTime(+timestamp)}`}</Text>
                </Grid>
              </Flex>
            </Flex>
            <Divider sx={{ borderColor: 'rgba(92, 92, 92, 0.3)' }} />
          </Flex>
        );
      })}
      {footer && footer()}
      {!footer && currentData.length > 0 && (
        <Flex sx={{ alignItems: 'center', alignSelf: 'flex-end', marginTop: 12 }}>
          <IconButton
            variant={'buttons.small-icon'}
            disabled={currentPage === 0}
            onClick={() => {
              setCurrentPage((v) => Math.max(v - 1, 0));
            }}
          >
            <FiArrowLeft />
          </IconButton>
          <Flex>
            <Text sx={{ marginLeft: '8px', color: 'dark.100', width: 24, textAlign: 'right' }}>{`${
              currentPage + 1
            }`}</Text>
            <Text sx={{ color: 'dark.100', textAlign: 'center' }}>{`/`}</Text>
            <Text sx={{ marginRight: '8px', color: 'dark.100', width: 24, textAlign: 'left' }}>{`${maxPage}`}</Text>
          </Flex>
          <IconButton
            variant={'buttons.small-icon'}
            disabled={currentPage === maxPage - 1}
            onClick={() => {
              setCurrentPage((v) => Math.min(v + 1, maxPage));
            }}
          >
            <FiArrowRight />
          </IconButton>
        </Flex>
      )}
    </Flex>
  );
}
