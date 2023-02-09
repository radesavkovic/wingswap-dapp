import { BigNumber } from '@ethersproject/bignumber';
import { TransactionResponse } from '@ethersproject/providers';
import get from 'lodash/get';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiArrowLeft, FiCheck, FiInfo, FiSettings } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Button, Flex, Spinner, Text } from 'theme-ui';

import TokenAmountPickerInput from '../../../components/forms/token-amount-picker.input';
import { getChainName, switchChain } from '../../../components/managers/switchChain';
import ReviewAddLiquidityModal from '../../../components/modals/review-add-liquidity.modal';
import SelectTokenModal from '../../../components/modals/select-token.modal';
import TransactionConfirmationModal from '../../../components/modals/transaction-confirmation.modal';
import TransactionSettingsModal from '../../../components/modals/transaction-settings.modal';
import { DEFAULT_ADD_LIQUIDITY_SLIPPAGE_TOLERANCE, ONE_BIPS, ZERO_PERCENT } from '../../../constants';
import { mediaWidthTemplates } from '../../../constants/media';
import { useAppContext } from '../../../context';
import { calculateGasMargin, calculateSlippageAmount } from '../../../functions/trade';
import useAcknowledge from '../../../hooks/useAcknowledge';
import useActiveWeb3React from '../../../hooks/useActiveWeb3React';
import useAppChainId from '../../../hooks/useAppChainId';
import { ApprovalState, useApproveCallback } from '../../../hooks/useApproveCallback';
import { useRouterContract } from '../../../hooks/useContract';
import { useIsPairUnsupported } from '../../../hooks/useIsSwapUnsupported';
import { useMediaQueryMaxWidth } from '../../../hooks/useMediaQuery';
import useMintPair from '../../../hooks/useMintPair';
import { PairState } from '../../../hooks/usePairs';
import useToggle from '../../../hooks/useToggle';
import useTransactionAdder from '../../../hooks/useTransactionAdder';
import useTransactionDeadline from '../../../hooks/useTransactionDeadline';
import { useUserSlippageToleranceWithDefault } from '../../../hooks/useUserSlippageToleranceWithDefault';
import routes from '../../../routes';

export default function AddLiquidityPage() {
  const navigate = useNavigate();
  const { t } = useTranslation(['error']);

  const [activeTransactionSettings, toggleTransactionSettings] = useToggle(false);
  const [activeReviewLiquidity, toggleReviewLiquidity] = useToggle(false);
  const [activeTransactionConfirm, toggleTransactionConfirm] = useToggle(false);
  const { toggleConnectWallet } = useAppContext();
  const [txHash, setTxHash] = useState<string>('');
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false); // clicked confirm

  const isUpToExtraSmall = useMediaQueryMaxWidth('upToExtraSmall');
  const {
    disabledCurrency,
    isSelectingCurrency,
    toggleSelectCurrencyA,
    toggleSelectCurrencyB,
    onSelectCurrency,
    updateCurrencyAValue,
    updateCurrencyBValue,
    reset,
    currencies: { CURRENCY_A: currencyA, CURRENCY_B: currencyB },
    pair,
    pairState,
    currencyBalances,
    formattedAmounts,
    parsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error,
  } = useMintPair();

  const [isFeeAcknowledged, feeAcknowledge] = useAcknowledge('POOL_FEE');

  const appChainId = useAppChainId();
  const { account, chainId, library } = useActiveWeb3React();

  const routerContract = useRouterContract();
  const addTransaction = useTransactionAdder();
  const deadline = useTransactionDeadline();
  const allowedSlippage = useUserSlippageToleranceWithDefault(DEFAULT_ADD_LIQUIDITY_SLIPPAGE_TOLERANCE);

  // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useApproveCallback(parsedAmounts.CURRENCY_A, routerContract?.address);
  const [approvalB, approveBCallback] = useApproveCallback(parsedAmounts.CURRENCY_B, routerContract?.address);

  const addIsUnsupported = useIsPairUnsupported(currencyA, currencyB);

  const isValid = !error;

  const _onCloseTransactionSettingsModal = useCallback(() => {
    toggleTransactionSettings();
  }, [toggleTransactionSettings]);

  const _onCloseReviewLiquidityModal = useCallback(
    async (confirm: boolean) => {
      toggleReviewLiquidity();

      if (!confirm) return;

      if (!chainId || !library || !account || !routerContract) return;

      const { CURRENCY_A: parsedAmountA, CURRENCY_B: parsedAmountB } = parsedAmounts;

      if (!parsedAmountA || !parsedAmountB || !currencyA || !currencyB || !deadline) return;

      const amountsMin = {
        CURRENCY_A: calculateSlippageAmount(parsedAmountA, noLiquidity ? ZERO_PERCENT : allowedSlippage)[0],
        CURRENCY_B: calculateSlippageAmount(parsedAmountB, noLiquidity ? ZERO_PERCENT : allowedSlippage)[0],
      };

      let estimate: (...args: any) => Promise<BigNumber>;
      let method: (...args: any) => Promise<TransactionResponse>;
      let args: Array<string | string[] | number>;
      let value: BigNumber | null;

      const currencyBIsETH = currencyB.isNative;
      const oneCurrencyIsETH = currencyA.isNative || currencyBIsETH;

      if (oneCurrencyIsETH) {
        estimate = routerContract.estimateGas.addLiquidityETH;
        method = routerContract.addLiquidityETH;
        args = [
          (currencyBIsETH ? currencyA : currencyB)?.wrapped?.address ?? '', // token
          (currencyBIsETH ? parsedAmountA : parsedAmountB).quotient.toString(), // token desired
          amountsMin[currencyBIsETH ? 'CURRENCY_A' : 'CURRENCY_B'].toString(), // token min
          amountsMin[currencyBIsETH ? 'CURRENCY_B' : 'CURRENCY_A'].toString(), // eth min
          account,
          deadline.toHexString(),
        ];
        value = BigNumber.from((currencyBIsETH ? parsedAmountB : parsedAmountA).quotient.toString());
      } else {
        estimate = routerContract.estimateGas.addLiquidity;
        method = routerContract.addLiquidity;
        args = [
          currencyA.wrapped?.address ?? '',
          currencyB.wrapped?.address ?? '',
          parsedAmountA.quotient.toString(),
          parsedAmountB.quotient.toString(),
          amountsMin.CURRENCY_A.toString(),
          amountsMin.CURRENCY_B.toString(),
          account,
          deadline.toHexString(),
        ];
        value = null;
      }

      toggleTransactionConfirm();
      setAttemptingTxn(true);

      try {
        const estimatedGasLimit = await estimate(...args, value ? { value } : {});
        const response = await method(...args, {
          ...(value ? { value } : {}),
          gasLimit: calculateGasMargin(estimatedGasLimit),
        });

        addTransaction(response, {
          summary: `Add ${parsedAmounts.CURRENCY_A?.toSignificant(3)} ${
            currencyA?.symbol
          } and ${parsedAmounts.CURRENCY_B?.toSignificant(3)} ${currencyB?.symbol}`,
        });

        setTxHash(response.hash);
      } catch (error) {
        // we only care if the error is something _other_ than the user rejected the tx
        if (get(error, 'code') !== 4001) {
          console.error(error);
        }
      } finally {
        setAttemptingTxn(false);
      }
    },
    [
      account,
      addTransaction,
      allowedSlippage,
      chainId,
      currencyA,
      currencyB,
      deadline,
      library,
      noLiquidity,
      parsedAmounts,
      routerContract,
      toggleReviewLiquidity,
      toggleTransactionConfirm,
    ],
  );

  const _onReset = useCallback(() => {
    reset();
  }, [reset]);

  const _onCloseTransactionConfirmModal = useCallback(() => {
    toggleTransactionConfirm();
    if (txHash) {
      updateCurrencyAValue('');
      updateCurrencyBValue('');
      setTxHash('');
    }
  }, [toggleTransactionConfirm, txHash, updateCurrencyAValue, updateCurrencyBValue]);

  const renderPrice = useCallback(() => {
    if (!currencyA || !currencyB || pairState === PairState.INVALID) return null;
    return (
      <Flex sx={{ flexDirection: 'column' }}>
        <Text sx={{ fontWeight: 'bold' }}>
          {noLiquidity ? 'Initial prices and pool share' : 'Prices and pool share'}
        </Text>
        <Flex
          sx={{
            flexDirection: 'row',
            marginTop: '8px',
          }}
        >
          <Flex
            sx={{
              flex: 1,
              height: 64,
              flexDirection: 'column',
              borderRadius: 'base',
              border: '1px solid rgba(92, 92, 92, 0.3)',
              paddingTop: '8px',
              paddingBottom: 12,
              alignItems: 'center',
              marginRight: 12,
            }}
          >
            <Text sx={{ fontWeight: 'bold', color: 'white.300' }}>{price?.invert()?.toSignificant(6) ?? '-'}</Text>
            <Text
              sx={{ fontSize: 0, fontWeight: 'medium', color: 'white.200' }}
            >{`${currencyA?.symbol} per ${currencyB?.symbol}`}</Text>
          </Flex>
          <Flex
            sx={{
              flex: 1,
              height: 64,
              flexDirection: 'column',
              borderRadius: 'base',
              border: '1px solid rgba(92, 92, 92, 0.3)',
              paddingTop: '8px',
              paddingBottom: 12,
              alignItems: 'center',
              marginRight: '8px',
            }}
          >
            <Text sx={{ fontWeight: 'bold', color: 'white.300' }}>{price?.toSignificant(6) ?? '-'}</Text>
            <Text
              sx={{ fontSize: 0, fontWeight: 'medium', color: 'white.200' }}
            >{`${currencyB?.symbol} per ${currencyA?.symbol}`}</Text>
          </Flex>
        </Flex>
        <Flex
          sx={{
            flex: 1,
            height: 64,
            flexDirection: 'column',
            borderRadius: 'base',
            border: '1px solid rgba(92, 92, 92, 0.3)',
            paddingTop: '8px',
            paddingBottom: 12,
            alignItems: 'center',
            marginTop: 12,
          }}
        >
          <Text sx={{ fontWeight: 'bold', color: 'white.300' }}>
            {`${
              noLiquidity && price
                ? '100'
                : (poolTokenPercentage?.lessThan(ONE_BIPS) ? '<0.01' : poolTokenPercentage?.toFixed(2)) ?? '0'
            }%`}
          </Text>
          <Text sx={{ fontSize: 0, fontWeight: 'medium', color: 'white.200' }}>Share of Pool</Text>
        </Flex>
      </Flex>
    );
  }, [currencyA, currencyB, noLiquidity, pairState, poolTokenPercentage, price]);

  const renderContent = useCallback(() => {
    return (
      <>
        <Flex sx={{ alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <Text
            sx={{
              color: 'dark.100',
            }}
          >
            Select a pair
          </Text>
          <Flex>
            <Button variant="buttons.small-link" sx={{ marginRight: 16 }} onClick={_onReset}>
              Reset
            </Button>
            <Button
              variant="buttons.small-link"
              onClick={() => {
                toggleTransactionSettings();
              }}
            >
              <FiSettings sx={{ marginRight: '8px' }} />
              {!isUpToExtraSmall && 'Setting'}
            </Button>
          </Flex>
        </Flex>
        <TokenAmountPickerInput
          sx={{ marginBottom: 12 }}
          token={currencyA}
          balance={currencyBalances?.CURRENCY_A}
          value={formattedAmounts.CURRENCY_A}
          onSelect={toggleSelectCurrencyA}
          onUserInput={updateCurrencyAValue}
        />
        <TokenAmountPickerInput
          sx={{ marginBottom: 24 }}
          token={currencyB}
          balance={currencyBalances?.CURRENCY_B}
          value={formattedAmounts.CURRENCY_B}
          onSelect={toggleSelectCurrencyB}
          onUserInput={updateCurrencyBValue}
        />
        {!!account && error === 'INVALID_CHAIN_ID' ? (
          <Button
            sx={{ marginTop: 24, background: 'linear-gradient(0deg, #ff0600 -50%, #ffb400 100%)' }}
            onClick={() => {
              switchChain(appChainId);
            }}
          >
            {`Switch to ${getChainName(appChainId)}`}
          </Button>
        ) : !!account ? (
          renderPrice()
        ) : null}
        {addIsUnsupported ? (
          <Button
            sx={{ marginTop: 24 }}
            disabled
            onClick={() => {
              toggleConnectWallet();
            }}
          >
            Unsupported Asset
          </Button>
        ) : !account ? (
          <Button
             sx={{ marginTop: 24, background: 'linear-gradient(59deg, #ff0600 0%, #ffb400 100%)' }}
            onClick={() => {
              toggleConnectWallet();
            }}
          >
            Connect to wallet
          </Button>
        ) : (
          (approvalA === ApprovalState.NOT_APPROVED ||
            approvalA === ApprovalState.PENDING ||
            approvalB === ApprovalState.NOT_APPROVED ||
            approvalB === ApprovalState.PENDING ||
            isValid) && (
            <>
              <Flex
                sx={{
                  marginTop: approvalA !== ApprovalState.APPROVED || approvalB !== ApprovalState.APPROVED ? 24 : 0,
                }}
              >
                {approvalA !== ApprovalState.APPROVED && (
                  <Button
                    variant="buttons.secondary"
                    disabled={approvalA === ApprovalState.PENDING}
                    sx={{ flex: 1, marginRight: approvalB !== ApprovalState.APPROVED ? 12 : 0 }}
                    onClick={approveACallback}
                  >
                    {approvalA === ApprovalState.PENDING ? (
                      <Spinner size={24} color={'white.400'} />
                    ) : (
                      `Approve ${currencyA?.symbol}`
                    )}
                  </Button>
                )}
                {approvalB !== ApprovalState.APPROVED && (
                  <Button
                    variant="buttons.secondary"
                    disabled={approvalB === ApprovalState.PENDING}
                    sx={{ flex: 1 }}
                    onClick={approveBCallback}
                  >
                    {approvalB === ApprovalState.PENDING ? (
                      <Spinner size={24} color={'white.400'} />
                    ) : (
                      `Approve ${currencyB?.symbol}`
                    )}
                  </Button>
                )}
              </Flex>
              {approvalA === ApprovalState.APPROVED && approvalB === ApprovalState.APPROVED && (
                <Button
                  variant="gradient"
                  disabled={approvalA !== ApprovalState.APPROVED || approvalB !== ApprovalState.APPROVED}
                  sx={{ marginTop: 24 }}
                  onClick={() => {
                    toggleReviewLiquidity();
                  }}
                >
                  {error ? t(error as any) : 'Add to pool'}
                </Button>
              )}
            </>
          )
        )}
      </>
    );
  }, [
    _onReset,
    account,
    addIsUnsupported,
    appChainId,
    approvalA,
    approvalB,
    approveACallback,
    approveBCallback,
    currencyA,
    currencyB,
    currencyBalances?.CURRENCY_A,
    currencyBalances?.CURRENCY_B,
    error,
    formattedAmounts.CURRENCY_A,
    formattedAmounts.CURRENCY_B,
    isUpToExtraSmall,
    isValid,
    renderPrice,
    t,
    toggleConnectWallet,
    toggleReviewLiquidity,
    toggleSelectCurrencyA,
    toggleSelectCurrencyB,
    toggleTransactionSettings,
    updateCurrencyAValue,
    updateCurrencyBValue,
  ]);

  return (
    <>
      <Flex
        sx={{
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'dark.400',
          paddingY: 32,
        }}
      >
        <Flex sx={{ flexDirection: 'column', width: 512, maxWidth: '100vw' }}>
          <Button
            variant="buttons.link"
            sx={{ alignSelf: 'flex-start', marginX: 16, marginBottom: 16, color: 'white.400' }}
            onClick={() => {
              navigate(routes.pool);
            }}
          >
            <FiArrowLeft sx={{ width: '24px !important' }} />
            <Text
              sx={{
                fontSize: 32,
                lineHeight: '40px',
                fontWeight: '700',
                marginLeft: 12,
                ...mediaWidthTemplates.upToSmall({
                  variant: 'styles.h4',
                }),
              }}
            >
              Add liquidity
            </Text>
          </Button>
          <Flex
            sx={{
              marginX: 16,
              paddingY: 24,
              marginBottom: 24,
              flexDirection: 'column',
              backgroundColor: 'dark.500',
              borderRadius: 'lg',
              boxShadow: 'strong',
              paddingX: 24,
              ...mediaWidthTemplates.upToExtraSmall({
                paddingX: 16,
              }),
            }}
          >
            {renderContent()}
          </Flex>
          {currencyA && currencyB && (
            <Flex
              sx={{
                padding: 12,
                marginX: 16,
                marginBottom: 16,
                borderRadius: 'base',
                borderColor: 'dark.400',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <Flex sx={{ alignItems: 'flex-start' }}>
                <Text sx={{ fontSize: 0, color: 'blue.100', marginLeft: 16 }}>
                  By adding liquidity you’ll earn <strong>0.5% of all trades</strong> on this pair proportional to share
                  of the pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your
                  liquidity.
                </Text>
              </Flex>
            </Flex>
          )}
          {!isFeeAcknowledged && (
            <Flex
              sx={{
                flexDirection: 'column',
                padding: 12,
                marginX: 16,
                borderRadius: 'base',
                borderColor: 'dark.400',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <Flex sx={{ alignItems: 'flex-start' }}>
                <FiInfo sx={{ color: 'white.400', marginTop: '-8px' }} size={32} />
                <Text sx={{ fontSize: 0, color: 'blue.100', marginLeft: 16 }}>
                  Tip: When you add liquidity you will receive pool tokens representing your position. These tokens
                  automatically earn fees proportional to your share of the pool, and can be redeemed at any time.
                </Text>
              </Flex>
              <Button
                variant="buttons.small-link"
                sx={{ alignSelf: 'flex-end', marginTop: 12 }}
                onClick={feeAcknowledge}
              >
                Got it!
                <FiCheck size={16} sx={{ marginLeft: '8px' }} />
              </Button>
            </Flex>
          )}
        </Flex>
      </Flex>
      <SelectTokenModal
        active={isSelectingCurrency}
        title="Select token"
        disabledToken={disabledCurrency}
        onClose={onSelectCurrency}
      />
      <TransactionSettingsModal active={activeTransactionSettings} onClose={_onCloseTransactionSettingsModal} />
      <ReviewAddLiquidityModal
        active={activeReviewLiquidity}
        currencyA={currencyA && parsedAmounts?.CURRENCY_A}
        currencyB={currencyB && parsedAmounts?.CURRENCY_B}
        onClose={_onCloseReviewLiquidityModal}
      />
      <TransactionConfirmationModal
        active={activeTransactionConfirm}
        attemptingTxn={attemptingTxn}
        txHash={txHash}
        description={`Adding ${parsedAmounts.CURRENCY_A?.toFixed(6)} ${
          currencyA?.symbol
        } and ${parsedAmounts.CURRENCY_B?.toFixed(6)} ${currencyB?.symbol}`}
        onClose={_onCloseTransactionConfirmModal}
      />
    </>
  );
}
