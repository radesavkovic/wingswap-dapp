import { Token } from '@wingsswap/sdk';
import { ReactNode, useMemo, useState } from 'react';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { Button, Divider, Flex, FlexProps, IconButton, Text } from 'theme-ui';

import { PAIR_SORT_FIELD } from '../../graph/constants';
import { PairData } from '../../graph/reducers/types';
import useBreakPoint from '../../hooks/useBreakPoint';
import useComponentSize from '../../hooks/useComponentSize';
import FavoriteButton from '../buttons/favorite-button';
import HeaderButton, { Direction } from '../buttons/header.button';
import DualTokenLogo from '../logos/dual-token.logo';

interface Props extends Omit<FlexProps, 'sx'> {
  data: Array<
    PairData & {
      currencyA: Token;
      currencyB: Token;
      liquidity: string | number;
      apy: string;
      dayVolume: string | number;
      weekVolume: string | number;
      fees: string | number;
    }
  >;
  maxItems: number;
  sortedColumn: { field: PAIR_SORT_FIELD; direction: Direction };
  footer?: () => ReactNode;
  watchedIds?: string[];
  onHeaderClick: (field: PAIR_SORT_FIELD) => void;
  onRowClick: (id: string) => void;
  onWatchClick?: (id: string) => void;
}

export default function PairTable(props: Props) {
  const {
    className,
    data,
    maxItems,
    sortedColumn,
    footer,
    watchedIds = [],
    onHeaderClick,
    onRowClick,
    onWatchClick,
  } = props;

  const [currentPage, setCurrentPage] = useState(0);

  const currentData = useMemo(() => {
    return data.slice(currentPage * maxItems, (currentPage + 1) * maxItems);
  }, [currentPage, data, maxItems]);

  const maxPage = useMemo(() => {
    return Math.ceil(data.length / maxItems);
  }, [data.length, maxItems]);

  const {
    ref,
    dimensions: { width, height },
  } = useComponentSize<HTMLDivElement>();

  const { upToExtraSmall, upToSmall, upToMedium, upToLarge } = useBreakPoint(width);

  return (
    <Flex
      ref={ref}
      className={className}
      sx={{ flexDirection: 'column', backgroundColor: 'dark.500', borderRadius: 'lg', padding: 16 }}
    >
      <Flex sx={{ height: 20 }}>
        <Text sx={{ width: upToExtraSmall ? 180 : 256, fontSize: 0, fontWeight: 'medium', color: 'white.200' }}>
          Name
        </Text>
        <HeaderButton
          label="Liquidity"
          direction={sortedColumn.field === PAIR_SORT_FIELD.LIQ ? sortedColumn.direction : undefined}
          onClick={() => {
            onHeaderClick(PAIR_SORT_FIELD.LIQ);
          }}
        />
        {!upToExtraSmall && (
          <HeaderButton
            label="Volume (24hr)"
            direction={sortedColumn.field === PAIR_SORT_FIELD.VOL ? sortedColumn.direction : undefined}
            onClick={() => {
              onHeaderClick(PAIR_SORT_FIELD.VOL);
            }}
          />
        )}
        {!upToMedium && (
          <HeaderButton
            label="Volume (7d)"
            direction={sortedColumn.field === PAIR_SORT_FIELD.VOL_7DAYS ? sortedColumn.direction : undefined}
            onClick={() => {
              onHeaderClick(PAIR_SORT_FIELD.VOL_7DAYS);
            }}
          />
        )}
        {!upToSmall && (
          <HeaderButton
            label="Fee (24hr)"
            direction={sortedColumn.field === PAIR_SORT_FIELD.FEES ? sortedColumn.direction : undefined}
            onClick={() => {
              onHeaderClick(PAIR_SORT_FIELD.FEES);
            }}
          />
        )}
        {!upToLarge && (
          <HeaderButton
            label="1y Fees/Liquidity"
            direction={sortedColumn.field === PAIR_SORT_FIELD.APY ? sortedColumn.direction : undefined}
            onClick={() => {
              onHeaderClick(PAIR_SORT_FIELD.APY);
            }}
          />
        )}
        {!upToExtraSmall && onWatchClick && <Flex sx={{ width: 48 }} />}
      </Flex>
      {currentData.map((pair, index) => {
        const { currencyA, currencyB, id, liquidity, dayVolume, weekVolume, fees, apy } = pair;
        return (
          <Flex key={id} sx={{ flexDirection: 'column' }}>
            <Flex sx={{ flex: 1, height: 48, alignItems: 'center' }}>
              <Button
                variant="styles.row"
                sx={{ flex: 1, padding: 0, maxHeight: '100%', '&:hover': { backgroundColor: 'transparent' } }}
                onClick={() => {
                  onRowClick(id);
                }}
              >
                <Flex sx={{ height: '100%', width: '100%', alignItems: 'center' }}>
                  <Flex sx={{ width: upToExtraSmall ? 180 : 256, alignItems: 'center' }}>
                    <Text sx={{ width: 32 }}>{`${index + 1}`}</Text>
                    <DualTokenLogo currencyA={currencyA} currencyB={currencyB} />
                    <Text sx={{ marginLeft: 12 }}>{`${currencyA.symbol}-${currencyB.symbol}`}</Text>
                  </Flex>
                  <Text sx={{ flex: 1, textAlign: 'right', color: 'white.200' }}>{`${liquidity}`}</Text>
                  {!upToExtraSmall && (
                    <Text sx={{ flex: 1, textAlign: 'right', color: 'white.200' }}>{`${dayVolume}`}</Text>
                  )}
                  {!upToMedium && (
                    <Text sx={{ flex: 1, textAlign: 'right', color: 'white.200' }}>{`${weekVolume}`}</Text>
                  )}
                  {!upToSmall && <Text sx={{ flex: 1, textAlign: 'right', color: 'white.200' }}>{`${fees}`}</Text>}
                  {!upToLarge && <Text sx={{ flex: 1, textAlign: 'right', color: 'white.200' }}>{`${apy}`}</Text>}
                </Flex>
              </Button>
              {!upToExtraSmall && onWatchClick && (
                <Flex sx={{ width: 48, justifyContent: 'flex-end' }}>
                  <FavoriteButton
                    active={watchedIds ? watchedIds.indexOf(id) > -1 : false}
                    onClick={() => {
                      onWatchClick(id);
                    }}
                  />
                </Flex>
              )}
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
