import { useMemo, useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { Button, Flex, FlexProps, Text } from 'theme-ui';

import { useMediaQueryMaxWidth } from '../../hooks/useMediaQuery';
import FeeToggle from '../toggles/fee.toggle';

type Fee = number;
type FeeTier = { value: Fee; description: string };

interface Props extends Omit<FlexProps, 'sx'> {
  feeTiers: FeeTier[];
  fee: Fee;
  onPick: (fee: number) => void;
}

export default function FeePicker(props: Props) {
  const { className, feeTiers, fee, onPick } = props;
  const isUpToExtraSmall = useMediaQueryMaxWidth('upToExtraSmall');
  const [activePicker, setActivePicker] = useState(false);

  const tier = useMemo(() => {
    return feeTiers.find((tier) => fee === tier.value) || ({} as FeeTier);
  }, [fee, feeTiers]);

  if (isUpToExtraSmall) {
    return (
      <Flex
        className={className}
        sx={{
          position: 'relative',
          flexDirection: 'column',
        }}
      >
        <Button
          variant="buttons.ghost"
          sx={{
            height: 60,
            width: '100%',
            paddingX: 16,
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px solid rgba(92, 92, 92, 0.3)',
            borderRadius: 'base',
          }}
          onClick={() => {
            setActivePicker((s) => !s);
          }}
        >
          <Flex
            sx={{
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'center',
              height: '100%',
              width: '100%',
            }}
          >
            <Text sx={{ color: 'white.300' }}>{`${tier.value}% fee`}</Text>
            <Text sx={{ fontSize: 0, color: 'white.200' }}>{tier.description}</Text>
          </Flex>
          <FiChevronDown sx={{ color: 'blue.300' }} />
        </Button>
        <Flex
          sx={{
            display: activePicker ? 'flex' : 'none',
            position: 'absolute',
            top: 63,
            left: 0,
            right: 0,
            with: '100%',
            flexDirection: 'column',
            border: '1px solid rgba(92, 92, 92, 0.3)',
            borderRadius: 'base',
            overflow: 'hidden',
            backgroundColor: 'dark.400',
            zIndex: 'modal',
            'button:after': {
              content: '""',
              width: 'calc(100% + 32px)',
              borderBottom: '1px solid rgba(92, 92, 92, 0.3)',
              zIndex: 'modal',
            },
            'button:last-of-type:after': {
              display: 'none',
            },
          }}
        >
          {feeTiers.map(({ value, description }) => {
            return (
              <Button
                key={value}
                variant="buttons.ghost"
                sx={{
                  height: 60,
                  width: '100%',
                  paddingX: 16,
                  flexDirection: 'column',
                  backgroundColor: value === fee ? 'dark.transparent' : 'dark.400',
                  border: 'transparent',
                  '&:focus': { boxShadow: 'none' },
                }}
                onClick={() => {
                  onPick(value);
                  setActivePicker(false);
                }}
              >
                <Flex
                  sx={{
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    height: '100%',
                    width: '100%',
                  }}
                >
                  <Text sx={{ color: 'white.300' }}>{`${value}% fee`}</Text>
                  <Text sx={{ fontSize: 0, color: 'white.200' }}>{description}</Text>
                </Flex>
              </Button>
            );
          })}
        </Flex>
      </Flex>
    );
  }

  return (
    <Flex
      className={className}
      sx={{
        button: { marginRight: 16 },
        'button:last-of-type': {
          marginRight: 0,
        },
      }}
    >
      {feeTiers.map(({ value, description }) => {
        return (
          <FeeToggle
            key={value}
            active={value === fee}
            value={value}
            title={`${value}% fee`}
            subtitle={description}
            onToggle={onPick}
          />
        );
      })}
    </Flex>
  );
}
