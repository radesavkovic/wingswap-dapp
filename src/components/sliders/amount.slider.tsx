import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { Flex, FlexProps, Heading, Slider, Text } from 'theme-ui';

import { mediaWidthTemplates } from '../../constants/media';
import Tag from '../tags/tag';

interface Props extends Omit<FlexProps, 'sx'> {
  onSlide: (value: number) => void;
}

const defaultValues = [
  {
    value: 25,
    text: '25%',
  },
  {
    value: 50,
    text: '50%',
  },
  {
    value: 75,
    text: '75%',
  },
  {
    value: 100,
    text: 'Max',
  },
];

export default function AmountSlider(props: Props) {
  const { className, onSlide } = props;

  const [rangeValue, setRangeValue] = useState(0);

  const _onSlide = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setRangeValue(Number(e.target.value));
  }, []);

  useEffect(() => {
    onSlide(rangeValue);
  }, [onSlide, rangeValue]);

  return (
    <Flex
      className={className}
      sx={{
        backgroundColor: 'dark.400',
        borderRadius: 'base',
        border: '1px solid rgba(92, 92, 92, 0.3)',
        justifyContent: 'space-between',
        padding: 16,
        paddingBottom: 12,
        ...mediaWidthTemplates.upToExtraSmall({
          flexDirection: 'column',
        }),
      }}
    >
      <Flex
        sx={{
          flexDirection: 'column',
          width: '25%',
          ...mediaWidthTemplates.upToExtraSmall({
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
          }),
        }}
      >
        <Text sx={{ fontWeight: 'bold' }}>Amount</Text>
        <Heading variant="styles.h4" sx={{ fontWeight: 'bold' }}>{`${rangeValue}%`}</Heading>
      </Flex>
      <Flex
        sx={{
          flexDirection: 'column',
          marginLeft: 32,
          flex: 1,
          ...mediaWidthTemplates.upToExtraSmall({
            marginLeft: 0,
          }),
        }}
      >
        <Flex
          sx={{
            alignSelf: 'flex-end',
            ...mediaWidthTemplates.upToExtraSmall({
              alignSelf: 'flex-start',
            }),
          }}
        >
          {defaultValues.map(({ value, text }) => {
            return (
              <Tag
                key={text}
                sx={{
                  height: 32,
                  border: '1px solid rgba(132, 179, 255, 0.3)',
                  '&>span': { color: 'blue.300', textTransform: 'none' },
                }}
                onClick={() => {
                  setRangeValue(value);
                }}
              >
                {text}
              </Tag>
            );
          })}
        </Flex>
        <Slider
          value={rangeValue}
          min={0}
          max={100}
          sx={{
            height: '2px',
            width: '100%',
          }}
          onChange={_onSlide}
        />
      </Flex>
    </Flex>
  );
}
