import { Currency, Percent, Trade, TradeType } from '@wingsswap/sdk';
import { useMemo } from 'react';
import { Flex, Text } from 'theme-ui';

import { computeRealizedLPFeePercent, warningSeverity } from '../../../functions/prices';

function FormattedPriceImpact({ priceImpact }: { priceImpact?: Percent }) {
  const severity = warningSeverity(priceImpact);

  const color =
    severity === 3 || severity === 4
      ? 'red.400'
      : severity === 2
      ? 'yellow.400'
      : severity === 1
      ? 'dark.400'
      : 'dark.200';
  return (
    <Text variant="caps100" sx={{ color }}>
      {priceImpact ? `${priceImpact.multiply(-1).toFixed(2)}%` : '-'}
    </Text>
  );
}

interface AdvancedSwapDetailsProps {
  trade?: Trade<Currency, Currency, TradeType>;
  allowedSlippage: Percent;
  syncing?: boolean;
}

export default function AdvancedSwapDetails({ trade, allowedSlippage }: AdvancedSwapDetailsProps) {
  const { realizedLPFee, priceImpact } = useMemo(() => {
    if (!trade) return { realizedLPFee: undefined, priceImpact: undefined };

    const realizedLpFeePercent = computeRealizedLPFeePercent(trade);
    const realizedLPFee = trade.inputAmount.multiply(realizedLpFeePercent);
    const priceImpact = trade.priceImpact.subtract(realizedLpFeePercent);
    return { priceImpact, realizedLPFee };
  }, [trade]);

  if (!trade) {
    return null;
  }
  return (
    <Flex sx={{ flexDirection: 'column' }}>
      <Text variant="caps200" sx={{ color: 'dark.500', textAlign: 'left' }}>
        Transaction details
      </Text>
      <Flex sx={{ height: '2px', backgroundColor: 'dark.500', marginY: '8px' }} />
      <Flex sx={{ alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <Text variant="caps100" sx={{ color: 'dark.500', marginRight: '16px' }}>
          Liquidity Provider Fee
        </Text>
        <Text variant="caps100" sx={{ color: 'dark.500' }}>
          {realizedLPFee ? `${realizedLPFee.toSignificant(4)} ${realizedLPFee.currency.symbol}` : '-'}
        </Text>
      </Flex>
      <Flex sx={{ alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <Text variant="caps100" sx={{ color: 'dark.500', marginRight: '16px' }}>
          Price Impact
        </Text>
        <FormattedPriceImpact priceImpact={priceImpact} />
      </Flex>
      <Flex sx={{ alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <Text variant="caps100" sx={{ color: 'dark.500', marginRight: '16px' }}>
          Allowed Slippage
        </Text>
        <Text variant="caps100" sx={{ color: 'dark.500' }}>
          {allowedSlippage.toFixed(2)}%
        </Text>
      </Flex>
      <Flex sx={{ alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <Text variant="caps100" sx={{ color: 'dark.500', marginRight: '16px' }}>
          {trade.tradeType === TradeType.EXACT_INPUT ? 'Minimum received' : 'Maximum sent'}
        </Text>
        <Text variant="caps100" sx={{ color: 'dark.500' }}>
          {trade.tradeType === TradeType.EXACT_INPUT
            ? `${trade.minimumAmountOut(allowedSlippage).toSignificant(6)} ${trade.outputAmount.currency.symbol}`
            : `${trade.maximumAmountIn(allowedSlippage).toSignificant(6)} ${trade.inputAmount.currency.symbol}`}
        </Text>
      </Flex>
    </Flex>
  );
}
