import { Currency } from '@wingsswap/sdk';
import numbro from 'numbro';
import { useState } from 'react';
import { FiArrowDown, FiInfo } from 'react-icons/fi';
import { Box, Flex, FlexProps, Heading, Text } from 'theme-ui';

import TokenLogo from '../../../components/logos/token.logo';
import TokenInfoModal from '../../../components/modals/token-info.modal';
import { mediaWidthTemplates } from '../../../constants/media';
import { formattedNum, formattedPercent } from '../../../utils/numbers';

interface Props extends Omit<FlexProps, 'sx'> {
  token?: Currency;
  info?: {
    coinname: string;
    rank: number;
    description: string;
    price: number;
    pricechange24h: number;
    maketcap: number;
    maketcapchange24h: number;
    volume: number;
    circulatingsupply: number;
    totalsupply: number;
  };
}

export default function TokenInfo(props: Props) {
  const { className, token, info } = props;
  const [activeModal, setActiveModal] = useState(false);

  const handleOpenModal = () => {
    setActiveModal(true);
  };

  const handleCloseModal = () => {
    setActiveModal(false);
  };

  if (!token) {
    return (
      <Flex
        className={className}
        sx={{
          border: '1px solid #F7F8FA',
          // #33306A',
          borderRadius: 'lg',
          backgroundColor: 'dark.500',
          justifyContent: 'center',
          alignItems: 'center',
          paddingY: 22,
          color: 'dark.300',
        }}
      >
        <Text variant="body100">Token info will be shown here</Text>
      </Flex>
    );
  }

  return (
    <>
      <TokenInfoModal active={activeModal} token={token} description={info?.description} onClose={handleCloseModal} />
      <Flex
        className={className}
        sx={{
          border: '1px solid #F7F8FA',
          borderRadius: 'lg',
          backgroundColor: 'dark.400',
          flexDirection: 'column',
        }}
      >
        <Flex sx={{ padding: 12, borderBottom: '1px solid #F7F8FA' }}>
          <TokenLogo currency={token} sx={{ mr: 12 }} />
          <Box sx={{ width: '50%' }}>
            <Flex sx={{ alignItems: 'center' }}>
              <Heading variant="styles.h5">{token.symbol}</Heading>
              {info?.description && (
                <FiInfo onClick={handleOpenModal} sx={{ height: 16, width: 16, marginLeft: 12, cursor: 'pointer' }} />
              )}
            </Flex>
            <Text variant="caps200" sx={{ color: 'dark.200' }}>
              {info ? `Rank ${info.rank}` : ''}
            </Text>
          </Box>
          <Box sx={{ width: '50%' }}>
            <Text variant="body300">{formattedNum(info?.price ?? 0, true)}</Text>
            <Flex sx={{ alignItems: 'center', color: 'red.200' }}>
              <FiArrowDown
                sx={{
                  stroke: 'currentColor',
                }}
              />
              <Text variant="caps100">{formattedPercent(info?.pricechange24h ?? 0)}</Text>
            </Flex>
          </Box>
        </Flex>
        <Flex sx={{ padding: 12, paddingY: 16, paddingLeft: 48 }}>
          <Flex
            sx={{
              flexDirection: 'column',
              width: '50%',
              ...mediaWidthTemplates.upToMedium({
                marginLeft: -32,
                marginRight: 32,
              }),
            }}
          >
            <Text variant="caps200" sx={{ color: 'dark.200', marginBottom: '4px' }}>
              Market cap
            </Text>
            <Text
              sx={{
                variant: 'text.caps300',
                ...mediaWidthTemplates.upToMedium({
                  variant: 'text.body300',
                }),
              }}
            >
              {formattedNum(info?.maketcap ?? 0, true)}
            </Text>
            <Flex sx={{ alignItems: 'center', color: 'red.200' }}>
              <FiArrowDown
                sx={{
                  stroke: 'currentColor',
                }}
              />
              <Text variant="caps100">{formattedPercent(info?.maketcapchange24h ?? 0)}</Text>
            </Flex>
            <Text variant="caps200" sx={{ marginTop: 22, color: 'dark.200' }}>
              Circulating Supply
            </Text>
            <Text
              sx={{
                variant: 'text.caps300',
                ...mediaWidthTemplates.upToMedium({
                  variant: 'text.body300',
                }),
              }}
            >
              {`${numbro(info?.circulatingsupply ?? 0).format({
                thousandSeparated: true,
              })}`}
            </Text>
          </Flex>
          <Flex sx={{ flexDirection: 'column', width: '50%' }}>
            <Text variant="caps200" sx={{ color: 'dark.200', marginBottom: '4px' }}>
              Volume 24h
            </Text>
            <Text
              sx={{
                variant: 'text.caps300',
                marginBottom: 20,
                ...mediaWidthTemplates.upToMedium({
                  variant: 'text.body300',
                }),
              }}
            >
              {numbro(info?.volume ?? 0 ?? 0).format({
                average: true,
                mantissa: (info?.volume ?? 0) < 0.1 ? 4 : 2,
                abbreviations: {
                  thousand: 'K',
                  million: 'M',
                  billion: 'B',
                },
              })}
            </Text>
            <Text variant="caps200" sx={{ marginTop: 22, color: 'dark.200' }}>
              Total Supply
            </Text>
            <Text
              sx={{
                variant: 'text.caps300',
                ...mediaWidthTemplates.upToMedium({
                  variant: 'text.body300',
                }),
              }}
            >
              {numbro(info?.totalsupply ?? 0).format({
                thousandSeparated: true,
              })}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}
