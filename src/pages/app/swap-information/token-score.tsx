import { Currency } from '@wingsswap/sdk';
import { useMemo } from 'react';
import { Flex, FlexProps, Heading, Text } from 'theme-ui';

import { capitalizeFirstLetter } from '../../../utils/strings';

interface Props extends Omit<FlexProps, 'sx'> {
  token?: Currency;
  scores: { [key: string]: number };
}

export default function TokenScore(props: Props) {
  const { className, token, scores } = props;

  const score = useMemo(() => {
    return Object.keys(scores).reduce((memo, el) => {
      return memo + scores[el];
    }, 0);
  }, [scores]);
  const totalScore = 20;

  const recommendation = useMemo(() => {
    if (score >= 17) return { value: 'ON BUY', color: 'green.200', transparent: 'green.transparent' };
    if (score >= 13) return { value: 'ON MODERATE BUY', color: 'green.200', transparent: 'green.transparent' };
    if (score >= 9) return { value: 'ON WATCH', color: 'orange.200', transparent: 'orange.transparent' };
    if (score >= 5) return { value: 'ON MODERATE SELL', color: 'red.200', transparent: 'red.transparent' };
    return { value: 'ON SELL', color: 'red.200', transparent: 'red.transparent' };
  }, [score]);

  if (!token) {
    return (
      <Flex
        className={className}
        sx={{
          border: '1px solid #3C3F5A',
          borderRadius: 'lg',
          backgroundColor: 'dark.500',
          justifyContent: 'center',
          alignItems: 'center',
          paddingY: 22,
          color: 'dark.300',
        }}
      >
        <Text variant="body100">Token score will be shown here</Text>
      </Flex>
    );
  }

  return (
    <Flex
      className={className}
      sx={{
        border: '1px solid #3C3F5A',
        borderRadius: 'lg',
        flexDirection: 'column',
        backgroundColor: 'dark.500',
        padding: 12,
      }}
    >
      <Flex
        sx={{
          borderRadius: 'lg',
          padding: '14px 12px',
          backgroundColor: 'dark.400',
          flexDirection: 'column',
        }}
      >
        <Flex sx={{ justifyContent: 'space-between' }}>
          <Text variant="body200">{`${token.symbol ?? ''} Score`}</Text>
          <Flex sx={{ padding: '4px 8px', backgroundColor: recommendation.transparent, borderRadius: 'lg' }}>
            <Text variant="subtitle" sx={{ color: recommendation.color }}>
              {recommendation.value}
            </Text>
          </Flex>
        </Flex>
        <Flex sx={{ marginTop: '6px', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Flex sx={{ color: recommendation.color, alignItems: 'baseline' }}>
            <Heading variant="styles.h4">{score}</Heading>
            <Text variant="body300">/{totalScore}</Text>
          </Flex>
          <Flex
            sx={{
              width: 192,
              height: 8,
              backgroundColor: 'dark.300',
              borderRadius: 100,
              justifyContent: 'flex-end',
              overflow: 'hidden',
            }}
          >
            <Flex
              sx={{
                height: '100%',
                width: `${(score / totalScore) * 100}%`,
                backgroundColor: recommendation.color,
                borderRadius: 100,
              }}
            />
          </Flex>
        </Flex>
      </Flex>
      {Object.keys(scores).map((section) => {
        return (
          <Flex key={section} sx={{ marginTop: 14, paddingX: 18, justifyContent: 'space-between' }}>
            <Text variant="body100">{capitalizeFirstLetter(section.toLowerCase())}</Text>
            <Text variant="body100" sx={{ color: recommendation.color }}>
              {`${scores[section]}/5`}
            </Text>
          </Flex>
        );
      })}
    </Flex>
  );
}
