import { JSBI, Pair, Percent } from '@wingsswap/sdk';
import { useNavigate } from 'react-router-dom';
import { Button, ButtonProps, Flex, Text } from 'theme-ui';

import { mediaWidthTemplates } from '../../constants/media';
import useActiveWeb3React from '../../hooks/useActiveWeb3React';
import { useTokenBalance } from '../../hooks/useTokenBalances';
import { useTotalSupply } from '../../hooks/useTotalSupply';
import routes, { buildRoute } from '../../routes';
import { getAddress } from '../../utils/getAddress';
import { formatAmount } from '../../utils/numbers';
import DualTokenLogo from '../logos/dual-token.logo';

interface Props extends Omit<ButtonProps, 'sx'> {
  pair: Pair;
}

export default function PoolRow(props: Props) {
  const { className, pair } = props;
  const { account } = useActiveWeb3React();
  const navigate = useNavigate();

  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken);
  const totalPoolTokens = useTotalSupply(pair.liquidityToken);

  const poolTokenPercentage =
    !!userPoolBalance &&
    !!totalPoolTokens &&
    JSBI.greaterThanOrEqual(totalPoolTokens.quotient, userPoolBalance.quotient)
      ? new Percent(userPoolBalance.quotient, totalPoolTokens.quotient)
      : undefined;

  return (
    <Button
      className={className}
      variant="buttons.ghost"
      sx={{
        height: 60,
        paddingX: 16,
        backgroundColor: 'dark.500',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 'lg',
        color: 'white.400',
        flexDirection: 'row',
        ...mediaWidthTemplates.upToExtraSmall({
          height: 88,
          alignItems: 'flex-start',
          justifyContent: 'center',
          flexDirection: 'column',
        }),
      }}
      onClick={() => {
        navigate(
          buildRoute(
            { address0: getAddress(pair.token0), address1: getAddress(pair.token1) },
            { path: routes['pool-detail'] },
          ),
        );
      }}
    >
      <Flex sx={{ alignItems: 'center', ...mediaWidthTemplates.upToExtraSmall({ width: '100%' }) }}>
        <DualTokenLogo currencyA={pair.token0} currencyB={pair.token1} />
        <Text sx={{ marginLeft: 12, fontWeight: 'bold' }}>{`${pair.token0.symbol} - ${pair.token1.symbol}`}</Text>

        <Flex
          sx={{
            height: 28,
            paddingX: '8px',
            marginLeft: 16,
            borderRadius: 'lg',
            backgroundColor: 'green.200',
            alignItems: 'center',
            ...mediaWidthTemplates.upToExtraSmall({ marginLeft: 'auto' }),
          }}
        >
          <Text sx={{ color: 'dark.400', fontSize: 0, fontWeight: 'medium' }}>
            {poolTokenPercentage ? poolTokenPercentage.toFixed(2) + '%' : '-'}
          </Text>
          <Text
            sx={{
              color: 'dark.300',
              marginLeft: '4px',
              fontSize: 0,
              fontWeight: 'medium',
              ...mediaWidthTemplates.upToExtraSmall({ display: 'none' }),
            }}
          >
            pool share
          </Text>
        </Flex>
      </Flex>
      <Flex sx={mediaWidthTemplates.upToExtraSmall({ marginTop: 12 })}>
        <Flex sx={{ marginRight: '8px' }}>
          <Text sx={{ color: 'dark.200', marginRight: '4px', fontSize: 0 }}>{`Pooled ${pair.token0.symbol}:`}</Text>
          <Text sx={{ fontSize: 0 }}>{formatAmount(parseFloat(pair.reserve0.toExact()))}</Text>
        </Flex>
        <Flex>
          <Text sx={{ color: 'dark.200', marginRight: '4px', fontSize: 0 }}>{`Pooled ${pair.token1.symbol}`}</Text>
          <Text sx={{ fontSize: 0 }}>{formatAmount(parseFloat(pair.reserve1.toExact()))}</Text>
        </Flex>
      </Flex>
    </Button>
  );
}
