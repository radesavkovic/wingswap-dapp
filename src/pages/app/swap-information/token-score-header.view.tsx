import { Currency } from '@wingsswap/sdk';
import { useCallback } from 'react';
import { Flex, FlexProps, Heading, Text } from 'theme-ui';

import { mediaWidthTemplates } from '../../../constants/media';

interface Props extends Omit<FlexProps, 'sx'> {
  from?: Currency;
  to?: Currency;
  scores: { from: { [key: string]: number }; to: { [key: string]: number } };
}

export default function TokenScoreHeaderView(props: Props) {
  const { className, from, to, scores } = props;

  const getScore = useCallback(
    (type: 'from' | 'to') => {
      return Object.keys(scores[type]).reduce((memo, el) => {
        return memo + scores[type][el];
      }, 0);
    },
    [scores],
  );
  const totalScore = 20;

  const getRecommendation = useCallback((value: number) => {
    if (value >= 17) return { value: 'ON BUY', color: 'green.200', transparent: 'green.transparent' };
    if (value >= 13) return { value: 'ON MODERATE BUY', color: 'green.200', transparent: 'green.transparent' };
    if (value >= 9) return { value: 'ON WATCH', color: 'orange.200', transparent: 'orange.transparent' };
    if (value >= 5) return { value: 'ON MODERATE SELL', color: 'red.200', transparent: 'red.transparent' };
    return { value: 'ON SELL', color: 'red.200', transparent: 'red.transparent' };
  }, []);

  const fromRecommendation = getRecommendation(getScore('from'));
  const toRecommendation = getRecommendation(getScore('to'));

  return (
    <Flex
      className={className}
      sx={{
        transition: 'opacity 0.3s, visibility 0.3s',
        position: 'fixed',
        top: 80,
        paddingX: 28,
        paddingY: 12,
        backgroundColor: 'dark.400',
        borderBottom: '1px solid #3C3F5A',
        ...mediaWidthTemplates.upToExtraSmall({ display: 'none' }),
      }}
    >
      {from && (
        <Flex
          sx={{
            width: '50%',
            borderRadius: 'lg',
            padding: '8px 12px',
            backgroundColor: 'dark.300',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginRight: 12,
          }}
        >
          <Flex sx={{ alignItems: 'center' }}>
            <Text variant="body200" sx={{ marginRight: 16 }}>{`${from.symbol ?? ''}`}</Text>
            <Flex
              sx={{
                padding: '4px 8px',
                backgroundColor: fromRecommendation.transparent,
                borderRadius: 'lg',
                alignItems: 'center',
              }}
            >
              <Text variant="subtitle" sx={{ color: fromRecommendation.color }}>
                {fromRecommendation.value}
              </Text>
            </Flex>
          </Flex>
          <Flex sx={{ alignItems: 'center' }}>
            <Flex
              sx={{
                width: 96,
                height: 8,
                backgroundColor: 'dark.400',
                borderRadius: 100,
                justifyContent: 'flex-end',
                overflow: 'hidden',
                marginRight: 16,
              }}
            >
              <Flex
                sx={{
                  height: '100%',
                  width: `${(10 / 18) * 100}%`,
                  backgroundColor: fromRecommendation.color,
                  borderRadius: 100,
                }}
              />
            </Flex>
            <Flex sx={{ color: fromRecommendation.color, alignItems: 'flex-end' }}>
              <Heading variant="styles.h5">{getScore('from')}</Heading>
              <Text variant="body300" sx={{ fontSize: 0 }}>
                /{totalScore}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      )}

      {to && (
        <Flex
          sx={{
            width: '50%',
            borderRadius: 'lg',
            padding: '8px 12px',
            backgroundColor: 'dark.300',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Flex sx={{ alignItems: 'center' }}>
            <Text variant="body200" sx={{ marginRight: 16 }}>{`${to.symbol ?? ''}`}</Text>
            <Flex
              sx={{
                padding: '4px 8px',
                backgroundColor: toRecommendation.transparent,
                borderRadius: 'lg',
                alignItems: 'center',
              }}
            >
              <Text variant="subtitle" sx={{ color: toRecommendation.color }}>
                {toRecommendation.value}
              </Text>
            </Flex>
          </Flex>
          <Flex sx={{ alignItems: 'center' }}>
            <Flex
              sx={{
                width: 96,
                height: 8,
                backgroundColor: 'dark.400',
                borderRadius: 100,
                justifyContent: 'flex-end',
                overflow: 'hidden',
                marginRight: 16,
              }}
            >
              <Flex
                sx={{
                  height: '100%',
                  width: `${(10 / 18) * 100}%`,
                  backgroundColor: toRecommendation.color,
                  borderRadius: 100,
                }}
              />
            </Flex>
            <Flex sx={{ color: toRecommendation.color, alignItems: 'flex-end' }}>
              <Heading variant="styles.h5">{getScore('to')}</Heading>
              <Text variant="body300" sx={{ fontSize: 0 }}>
                /{totalScore}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
}
