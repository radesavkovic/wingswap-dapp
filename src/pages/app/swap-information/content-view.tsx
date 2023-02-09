import { Currency } from '@wingsswap/sdk';
import { useMemo, useState } from 'react';
import { Flex, FlexProps, Grid, Heading, ThemeUIStyleObject } from 'theme-ui';

import { mediaWidthTemplates } from '../../../constants/media';
import useCryptoInfo from '../../../hooks/grpc/useCryptoInfo';
import useScroll from '../../../hooks/useScroll';
import ChartSection from './chart-section';
import { distributionMetrics, financialMetrics, fundamentalMetrics, signalMetrics } from './metrics';
import TokenInfo from './token-info';
import TokenScore from './token-score';
import TokenScoreHeaderView from './token-score-header.view';

interface Props extends Omit<FlexProps, 'sx'> {
  pair: { from: Currency | undefined; to: Currency | undefined };
}

export default function ContentView(props: Props) {
  const {
    className,
    pair: { from, to },
  } = props;

  const { rect, ref } = useScroll<HTMLDivElement>();

  const info0 = useCryptoInfo(from?.wrapped);
  const info1 = useCryptoInfo(to?.wrapped);
  const [scores, setScores] = useState<{ from: { [key: string]: number }; to: { [key: string]: number } }>({
    from: {},
    to: {},
  });

  const style = useMemo<ThemeUIStyleObject>(() => {
    return rect?.y + rect?.height < 80 + 68
      ? {
          left: rect.left,
          width: rect.width,
          opacity: 1,
          visibility: 'visible',
          zIndex: 2,
        }
      : {
          left: rect.left,
          width: rect.width,
          opacity: 0,
          visibility: 'hidden',
          zIndex: 2,
        };
  }, [rect]);

  return (
    <Flex
      className={className}
      sx={{
        flexDirection: 'column',
        ...mediaWidthTemplates.upToMedium({ paddingBottom: (from && to ? 144 : 78) + 28 }),
      }}
    >
      <TokenScoreHeaderView sx={style} from={from} to={to} scores={scores} />

      <Flex sx={{ backgroundColor: 'dark.400' }}>
        <Flex
          ref={ref}
          sx={{
            flexDirection: 'column',
            paddingX: 28,
            paddingY: 28,
            width: 860,
            ...mediaWidthTemplates.upToMedium({ paddingTop: 24, paddingBottom: 28, paddingX: 16, width: '100%' }),
          }}
        >
          <Heading
            variant="styles.h4"
            sx={{
              display: 'none',
              ...mediaWidthTemplates.upToMedium({ display: 'flex', marginBottom: '8px' }),
            }}
          >
            Swap
          </Heading>

          <Grid
            {...{ name: 'generalAnchor' }}
            gap={12}
            columns={['1fr', '1fr', '1fr 1fr']}
            sx={{ width: '100%', ...mediaWidthTemplates.upToMedium({ width: 'unset' }) }}
          >
            <TokenInfo token={from} info={info0} />
            <TokenInfo token={to} info={info1} />
            <TokenScore token={from} scores={scores.from} />
            <TokenScore token={to} scores={scores.to} />
          </Grid>
        </Flex>
      </Flex>
      <Flex sx={{ bg: 'dark.500' }}>
        <ChartSection
          {...{ name: 'distributionAnchor' }}
          title={'DISTRIBUTION'}
          metrics={distributionMetrics}
          pair={{ from, to }}
          sx={{ width: 860, paddingX: 28, ...mediaWidthTemplates.upToMedium({ width: '100%', paddingX: 16 }) }}
          onUpdateScores={setScores}
        />
      </Flex>
      <Flex sx={{ bg: 'dark.500' }}>
        <ChartSection
          {...{ name: 'fundamentalAnchor' }}
          title={'FUNDAMENTAL'}
          metrics={fundamentalMetrics}
          pair={{ from, to }}
          sx={{ width: 860, paddingX: 28, ...mediaWidthTemplates.upToMedium({ width: '100%', paddingX: 16 }) }}
          onUpdateScores={setScores}
        />
      </Flex>
      <Flex sx={{ bg: 'dark.500' }}>
        <ChartSection
          {...{ name: 'financialAnchor' }}
          title={'FINANCIAL'}
          metrics={financialMetrics}
          pair={{ from, to }}
          sx={{ width: 860, paddingX: 28, ...mediaWidthTemplates.upToMedium({ width: '100%', paddingX: 16 }) }}
          onUpdateScores={setScores}
        />
      </Flex>
      <Flex sx={{ bg: 'dark.500' }}>
        <ChartSection
          {...{ name: 'signalAnchor' }}
          title={'SIGNAL'}
          metrics={signalMetrics}
          pair={{ from, to }}
          sx={{ width: 860, paddingX: 28, ...mediaWidthTemplates.upToMedium({ width: '100%', paddingX: 16 }) }}
          onUpdateScores={setScores}
        />
      </Flex>
    </Flex>
  );
}
