import { getAddress, isAddress } from '@ethersproject/address';
import { Currency, CurrencyAmount, Percent, Trade, TradeType } from '@wingsswap/sdk';

import { selectors } from '../reducers';
import { useAppSelector } from '../reducers/hooks';
import tryParseAmount from '../utils/tryParseAmount';
import useActiveWeb3React from './useActiveWeb3React';
import useAppChainId from './useAppChainId';
import useCurrencyBalances from './useCurrencyBalances';
import useENS from './useENS';
import useSwapSlippageTolerance from './useSwapSlippageTollerence';
import useCurrency from './useTokenAddress';
import { useTradeExactIn, useTradeExactOut } from './useTrade';

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
}

type SwapState = {
  independentField: Field;
  typedValue: string;
  [Field.INPUT]: {
    address: string | undefined;
  };
  [Field.OUTPUT]: {
    address: string | undefined;
  };
  // the typed recipient address or ENS name, or null if swap should go to sender
  recipient: string | null;
};

const BAD_RECIPIENT_ADDRESSES: { [chainId: string]: { [address: string]: true } } = {};

/**
 * Returns true if any of the pairs or tokens in a trade have the given checksummed address
 * @param trade to check for the given address
 * @param checksummedAddress address to check in the pairs and tokens
 */
function involvesAddress(trade: Trade<Currency, Currency, TradeType>, checksummedAddress: string): boolean {
  const path = trade.route.path;
  return (
    path.some((token) => token.address === checksummedAddress) ||
    (trade instanceof Trade
      ? trade.route.pairs.some((pair) => pair.liquidityToken.address === checksummedAddress)
      : false)
  );
}

// from the current swap inputs, compute the best trade and return it.
export function useDerivedSwapInfo(swapState: SwapState): {
  currencies: { [field in Field]?: Currency };
  currencyBalances: { [field in Field]?: CurrencyAmount<Currency> };
  parsedAmount?: CurrencyAmount<Currency>;
  inputError?: string;
  trade?: Trade<Currency, Currency, TradeType>;
  allowedSlippage: Percent;
} {
  const appChainId = useAppChainId();
  const { account, chainId } = useActiveWeb3React();

  const {
    independentField,
    typedValue,
    [Field.INPUT]: { address: inputAddress },
    [Field.OUTPUT]: { address: outputAddress },
    recipient,
  } = swapState;

  const singleHopOnly = !useAppSelector(selectors.user.selectMultihop);

  const inputCurrency = useCurrency(inputAddress);
  const outputCurrency = useCurrency(outputAddress);

  // const recipientLookup = useENS(recipient ?? undefined);
  // const to: string | null = (recipient === null ? account : recipientLookup.address) ?? null;
  const to = account;

  const relevantTokenBalances = useCurrencyBalances(account ?? undefined, [
    inputCurrency ?? undefined,
    outputCurrency ?? undefined,
  ]);

  const isExactIn: boolean = independentField === Field.INPUT;
  const parsedAmount = tryParseAmount(typedValue, (isExactIn ? inputCurrency : outputCurrency) ?? undefined);

  const bestTradeExactIn = useTradeExactIn(isExactIn ? parsedAmount : undefined, outputCurrency ?? undefined, {
    maxHops: singleHopOnly ? 1 : undefined,
  });

  const bestTradeExactOut = useTradeExactOut(inputCurrency ?? undefined, !isExactIn ? parsedAmount : undefined, {
    maxHops: singleHopOnly ? 1 : undefined,
  });

  const trade = isExactIn ? bestTradeExactIn : bestTradeExactOut;

  const currencyBalances = {
    [Field.INPUT]: relevantTokenBalances[0],
    [Field.OUTPUT]: relevantTokenBalances[1],
  };

  const currencies: { [field in Field]?: Currency } = {
    [Field.INPUT]: inputCurrency ?? undefined,
    [Field.OUTPUT]: outputCurrency ?? undefined,
  };

  let inputError: string | undefined;
  if (!account) {
    inputError = 'CONNECT_WALLET';
  }

  if (!parsedAmount) {
    inputError = inputError ?? 'ENTER_AN_AMOUNT';
  }

  if (!currencies[Field.INPUT] || !currencies[Field.OUTPUT]) {
    inputError = inputError ?? 'SELECT_A_TOKEN';
  }

  const formattedTo = isAddress(to ?? '');
  if (!to || !formattedTo) {
    inputError = inputError ?? 'ENTER_A_RECIPIENT';
  } else {
    const address = getAddress(to);
    if (
      BAD_RECIPIENT_ADDRESSES?.[chainId ?? -1]?.[address] ||
      (bestTradeExactIn && involvesAddress(bestTradeExactIn, address)) ||
      (bestTradeExactOut && involvesAddress(bestTradeExactOut, address))
    ) {
      inputError = inputError ?? 'INVALID_RECIPIENT';
    }
  }

  const allowedSlippage = useSwapSlippageTolerance(trade);

  // compare input balance to max input based on version
  const [balanceIn, amountIn] = [currencyBalances[Field.INPUT], trade?.maximumAmountIn(allowedSlippage)];

  if (balanceIn && amountIn && balanceIn.lessThan(amountIn)) {
    inputError = 'INSUFFICIENT_BALANCE';
  }

  if (appChainId !== chainId) {
    inputError = 'INVALID_CHAIN_ID';
  }

  return {
    currencies,
    currencyBalances,
    parsedAmount,
    inputError,
    trade: trade ?? undefined,
    allowedSlippage,
  };
}
