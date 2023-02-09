import { BigNumber } from '@ethersproject/bignumber';
import { TransactionResponse } from '@ethersproject/providers';
import { SupportedChainId } from '@wingsswap/sdk';
import get from 'lodash/get';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiArrowLeft, FiSettings } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Button, Divider, Flex, Heading, Spinner, Switch, Text } from 'theme-ui';

import DualTokenLogo from '../../../components/logos/dual-token.logo';
import TokenLogo from '../../../components/logos/token.logo';
import ReviewRemoveLiquidityModal from '../../../components/modals/review-remove-liquidity.modal';
import TransactionConfirmationModal from '../../../components/modals/transaction-confirmation.modal';
import TransactionSettingsModal from '../../../components/modals/transaction-settings.modal';
import AmountSlider from '../../../components/sliders/amount.slider';
import { DEFAULT_REMOVE_LIQUIDITY_SLIPPAGE_TOLERANCE } from '../../../constants';
import { getWrapped } from '../../../constants/extended-native';
import { mediaWidthTemplates } from '../../../constants/media';
import { useAppContext } from '../../../context';
import { calculateGasMargin, calculateSlippageAmount } from '../../../functions/trade';
import useActiveWeb3React from '../../../hooks/useActiveWeb3React';
import useAppChainId from '../../../hooks/useAppChainId';
import { ApprovalState, useApproveCallback } from '../../../hooks/useApproveCallback';
import useBurnPair from '../../../hooks/useBurnPair';
import { usePairContract, useRouterContract } from '../../../hooks/useContract';
import { useLiquidityTokenPermit } from '../../../hooks/useERC20Permit';
import { useMediaQueryMaxWidth } from '../../../hooks/useMediaQuery';
import useToggle from '../../../hooks/useToggle';
import useTransactionAdder from '../../../hooks/useTransactionAdder';
import useTransactionDeadline from '../../../hooks/useTransactionDeadline';
import { useUserSlippageToleranceWithDefault } from '../../../hooks/useUserSlippageToleranceWithDefault';
import routes, { buildRoute } from '../../../routes';
import { getAddress } from '../../../utils/getAddress';

export default function RemoveLiquidityPage() {
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
    currencies: { CURRENCY_A: currencyA, CURRENCY_B: currencyB },
    updateBurnPercent,
    formattedAmounts,
    pair,
    parsedAmounts,
    error,
  } = useBurnPair('0');

  const appChainId = useAppChainId();
  const { account, chainId, library } = useActiveWeb3React();

  const pairContract = usePairContract(pair?.liquidityToken?.address);
  const routerContract = useRouterContract();
  const addTransaction = useTransactionAdder();
  const { gatherPermitSignature, signatureData } = useLiquidityTokenPermit(
    parsedAmounts.LIQUIDITY,
    routerContract?.address,
  );
  const [approval, approveCallback] = useApproveCallback(parsedAmounts.LIQUIDITY, routerContract?.address);

  const deadline = useTransactionDeadline();
  const allowedSlippage = useUserSlippageToleranceWithDefault(DEFAULT_REMOVE_LIQUIDITY_SLIPPAGE_TOLERANCE);

  const isValid = !error;

  const _onAttemptToApprove = useCallback(async () => {
    if (!pairContract || !pair || !library || !deadline) throw new Error('missing dependencies');
    const liquidityAmount = parsedAmounts.LIQUIDITY;
    if (!liquidityAmount) throw new Error('missing liquidity amount');

    if (gatherPermitSignature) {
      try {
        await gatherPermitSignature();
      } catch (error) {
        // try to approve if gatherPermitSignature failed for any reason other than the user rejecting it
        if (get(error, 'code') !== 4001) {
          await approveCallback();
        }
      }
    } else {
      await approveCallback();
    }
  }, [approveCallback, deadline, gatherPermitSignature, library, pair, pairContract, parsedAmounts.LIQUIDITY]);

  const _onCloseTransactionSettingsModal = useCallback(() => {
    toggleTransactionSettings();
  }, [toggleTransactionSettings]);

  const _onCloseReviewLiquidityModal = useCallback(
    async (confirm: boolean) => {
      toggleReviewLiquidity();

      if (!confirm) return;

      if (!chainId || !library || !account || !deadline || !routerContract) throw new Error('missing dependencies');

      const { CURRENCY_A: currencyAmountA, CURRENCY_B: currencyAmountB } = parsedAmounts;

      if (!currencyAmountA || !currencyAmountB) {
        throw new Error('missing currency amounts');
      }

      const amountsMin = {
        CURRENCY_A: calculateSlippageAmount(currencyAmountA, allowedSlippage)[0],
        CURRENCY_B: calculateSlippageAmount(currencyAmountB, allowedSlippage)[0],
      };

      if (!currencyA || !currencyB) throw new Error('missing tokens');
      const liquidityAmount = parsedAmounts.LIQUIDITY;
      if (!liquidityAmount) throw new Error('missing liquidity amount');

      const currencyBIsNative = currencyB.isNative;
      const oneCurrencyIsNative = currencyA.isNative || currencyBIsNative;

      let methodNames: string[], args: Array<string | string[] | number | boolean>;
      // we have approval, use normal remove liquidity
      if (approval === ApprovalState.APPROVED) {
        // removeLiquidityETH
        if (oneCurrencyIsNative) {
          methodNames = ['removeLiquidityETH', 'removeLiquidityETHSupportingFeeOnTransferTokens'];
          args = [
            (currencyBIsNative ? currencyA : currencyB)?.wrapped?.address ?? '',
            liquidityAmount.quotient.toString(),
            amountsMin[currencyBIsNative ? 'CURRENCY_A' : 'CURRENCY_B'].toString(),
            amountsMin[currencyBIsNative ? 'CURRENCY_B' : 'CURRENCY_A'].toString(),
            account,
            deadline.toHexString(),
          ];
        }
        // removeLiquidity
        else {
          methodNames = ['removeLiquidity'];
          args = [
            currencyA.wrapped?.address ?? '',
            currencyB.wrapped?.address ?? '',
            liquidityAmount.quotient.toString(),
            amountsMin.CURRENCY_A.toString(),
            amountsMin.CURRENCY_B.toString(),
            account,
            deadline.toHexString(),
          ];
        }
      }
      // we have a signature, use permit versions of remove liquidity
      else if (signatureData !== null) {
        // removeLiquidityETHWithPermit
        if (oneCurrencyIsNative) {
          methodNames = ['removeLiquidityETHWithPermit', 'removeLiquidityETHWithPermitSupportingFeeOnTransferTokens'];
          args = [
            (currencyBIsNative ? currencyA : currencyB)?.wrapped?.address ?? '',
            liquidityAmount.quotient.toString(),
            amountsMin[currencyBIsNative ? 'CURRENCY_A' : 'CURRENCY_B'].toString(),
            amountsMin[currencyBIsNative ? 'CURRENCY_B' : 'CURRENCY_A'].toString(),
            account,
            signatureData.deadline,
            false,
            signatureData.v,
            signatureData.r,
            signatureData.s,
          ];
        }
        // removeLiquidityETHWithPermit
        else {
          methodNames = ['removeLiquidityWithPermit'];
          args = [
            currencyA.wrapped?.address ?? '',
            currencyB.wrapped?.address ?? '',
            liquidityAmount.quotient.toString(),
            amountsMin.CURRENCY_A.toString(),
            amountsMin.CURRENCY_B.toString(),
            account,
            signatureData.deadline,
            false,
            signatureData.v,
            signatureData.r,
            signatureData.s,
          ];
        }
      } else {
        throw new Error('Attempting to confirm without approval or a signature. Please contact support.');
      }

      const safeGasEstimates: (BigNumber | undefined)[] = await Promise.all(
        methodNames.map((methodName) =>
          routerContract.estimateGas[methodName](...args)
            .then(calculateGasMargin)
            .catch((error) => {
              console.error(`estimateGas failed`, methodName, args, error);
              return undefined;
            }),
        ),
      );

      const indexOfSuccessfulEstimation = safeGasEstimates.findIndex((safeGasEstimate) =>
        BigNumber.isBigNumber(safeGasEstimate),
      );

      // all estimations failed...
      if (indexOfSuccessfulEstimation === -1) {
        console.error('This transaction would fail. Please contact support.');
      } else {
        const methodName = methodNames[indexOfSuccessfulEstimation];
        const safeGasEstimate = safeGasEstimates[indexOfSuccessfulEstimation];

        toggleTransactionConfirm();
        setAttemptingTxn(true);

        try {
          const response: TransactionResponse = await routerContract[methodName](...args, {
            gasLimit: safeGasEstimate,
          });

          addTransaction(response, {
            summary: `Remove ${parsedAmounts.CURRENCY_A?.toSignificant(3)} ${
              currencyA?.symbol
            } and ${parsedAmounts.CURRENCY_B?.toSignificant(3)} ${currencyB?.symbol}`,
          });

          setTxHash(response.hash);
        } catch (error) {
          // we only care if the error is something _other_ than the user rejected the tx
          console.error(error);
        } finally {
          setAttemptingTxn(false);
        }
      }
    },
    [
      account,
      addTransaction,
      allowedSlippage,
      approval,
      chainId,
      currencyA,
      currencyB,
      deadline,
      library,
      parsedAmounts,
      routerContract,
      signatureData,
      toggleReviewLiquidity,
      toggleTransactionConfirm,
    ],
  );

  const _onCloseTransactionConfirmModal = useCallback(() => {
    toggleTransactionConfirm();
    if (txHash) {
      updateBurnPercent('0');
      setTxHash('');
    }
  }, [toggleTransactionConfirm, txHash, updateBurnPercent]);

  const oneCurrencyIsNative = currencyA?.isNative || currencyB?.isNative;
  const oneCurrencyIsWrapped = Boolean(
    chainId &&
      getWrapped(appChainId)[chainId] &&
      (currencyA?.equals(getWrapped(appChainId)[chainId]) || currencyB?.equals(getWrapped(appChainId)[chainId])),
  );

  const renderContent = useCallback(() => {
    if (!currencyA || !currencyB) return null;
    return (
      <>
        <Flex sx={{ alignItems: 'center', justifyContent: 'space-between', marginBottom: 26 }}>
          <Flex>
            <DualTokenLogo currencyA={currencyA} currencyB={currencyB} />
            <Text sx={{ marginLeft: 12, fontWeight: 'bold' }}>{`${currencyA.symbol}/${currencyB.symbol}`}</Text>
          </Flex>
          <Flex>
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

        <AmountSlider sx={{ marginBottom: 24 }} onSlide={(value) => updateBurnPercent(`${value}`)} />
        <Flex sx={{ justifyContent: 'space-between', marginBottom: 12 }}>
          <Text sx={{ fontWeight: 'bold', color: 'white.300' }}>{`Remove pooled ${currencyA.symbol}:`}</Text>
          <Flex>
            <Text sx={{ fontWeight: 'bold', color: 'white.300', marginRight: '8px' }}>
              {formattedAmounts.CURRENCY_A}
            </Text>
            <TokenLogo currency={currencyA} />
          </Flex>
        </Flex>
        <Flex sx={{ justifyContent: 'space-between', marginBottom: 12 }}>
          <Text sx={{ fontWeight: 'bold', color: 'white.300' }}>{`Remove pooled ${currencyB.symbol}:`}</Text>
          <Flex>
            <Text sx={{ fontWeight: 'bold', color: 'white.300', marginRight: '8px' }}>
              {formattedAmounts.CURRENCY_B}
            </Text>
            <TokenLogo currency={currencyB} />
          </Flex>
        </Flex>
        <Divider sx={{ marginBottom: 12 }} />
        <Flex sx={{ justifyContent: 'space-between', marginBottom: 12 }}>
          <Text sx={{ fontWeight: 'bold', color: 'white.300' }}>{`Remove pool tokens:`}</Text>
          <Text sx={{ fontWeight: 'bold', color: 'white.300', marginRight: '8px' }}>{formattedAmounts.LIQUIDITY}</Text>
        </Flex>
        <Flex sx={{ justifyContent: 'space-between', marginBottom: 12 }}>
          <Text sx={{ fontWeight: 'bold', color: 'white.300' }}>{`Remove pool share:`}</Text>
          <Text
            sx={{ fontWeight: 'bold', color: 'white.300', marginRight: '8px' }}
          >{`${formattedAmounts.LIQUIDITY_PERCENT}%`}</Text>
        </Flex>

        {(oneCurrencyIsWrapped || oneCurrencyIsNative) && (
          <Flex
            sx={{
              alignItems: 'center',
              '& label': {
                width: 'initial',
              },
            }}
          >
            <Text sx={{ fontWeight: 'bold', color: 'white.300' }}>{`Collect as ${
              appChainId === SupportedChainId.SMART_CHAIN ? 'BNB' : 'ETH'
            }`}</Text>
            <Switch
              defaultChecked={oneCurrencyIsNative}
              sx={{ marginLeft: 12 }}
              onChange={({ target }) => {
                if (oneCurrencyIsNative) {
                  // wrap
                  navigate(
                    buildRoute(
                      {
                        address0: getAddress(currencyA.isNative ? getWrapped(appChainId)[chainId ?? -1] : currencyA),
                        address1: getAddress(currencyB.isNative ? getWrapped(appChainId)[chainId ?? -1] : currencyB),
                      },
                      { path: routes['pool-remove'] },
                    ),
                  );
                } else if (oneCurrencyIsWrapped) {
                  // unwrap
                  navigate(
                    buildRoute(
                      {
                        address0: getAddress(
                          currencyA.equals(getWrapped(appChainId)[chainId ?? -1])
                            ? { symbol: appChainId === SupportedChainId.SMART_CHAIN ? 'BNB' : 'ETH' }
                            : currencyA,
                        ),
                        address1: getAddress(
                          currencyB.equals(getWrapped(appChainId)[chainId ?? -1])
                            ? { symbol: appChainId === SupportedChainId.SMART_CHAIN ? 'BNB' : 'ETH' }
                            : currencyB,
                        ),
                      },
                      { path: routes['pool-remove'] },
                    ),
                  );
                }
              }}
            />
          </Flex>
        )}

        {!account ? (
          <Button
             sx={{ marginTop: 24, background: 'linear-gradient(59deg, #ff0600 0%, #ffb400 100%)' }}
            onClick={() => {
              toggleConnectWallet();
            }}
          >
            Connect to wallet
          </Button>
        ) : approval !== ApprovalState.APPROVED || signatureData !== null ? (
          <Button
            variant="buttons.secondary"
            disabled={approval === ApprovalState.PENDING}
            sx={{ marginTop: 24 }}
            onClick={_onAttemptToApprove}
          >
            {approval === ApprovalState.PENDING ? <Spinner size={24} color={'white.400'} /> : `Approve`}
          </Button>
        ) : (
          <Button
            variant="gradient"
            disabled={!isValid}
            sx={{ marginTop: 24 }}
            onClick={() => {
              toggleReviewLiquidity();
            }}
          >
            {error ? t(error as any) : 'Remove liquidity'}
          </Button>
        )}
      </>
    );
  }, [
    _onAttemptToApprove,
    account,
    appChainId,
    approval,
    chainId,
    currencyA,
    currencyB,
    error,
    formattedAmounts.CURRENCY_A,
    formattedAmounts.CURRENCY_B,
    formattedAmounts.LIQUIDITY,
    formattedAmounts.LIQUIDITY_PERCENT,
    isUpToExtraSmall,
    isValid,
    navigate,
    oneCurrencyIsNative,
    oneCurrencyIsWrapped,
    signatureData,
    t,
    toggleConnectWallet,
    toggleReviewLiquidity,
    toggleTransactionSettings,
    updateBurnPercent,
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
              navigate(-1);
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
              Remove liquidity
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
        </Flex>
      </Flex>
      <TransactionSettingsModal active={activeTransactionSettings} onClose={_onCloseTransactionSettingsModal} />
      <ReviewRemoveLiquidityModal
        active={activeReviewLiquidity}
        currencyA={parsedAmounts.CURRENCY_A}
        currencyB={parsedAmounts.CURRENCY_B}
        liquidity={parsedAmounts.LIQUIDITY}
        liquidityPercent={formattedAmounts.LIQUIDITY_PERCENT}
        onClose={_onCloseReviewLiquidityModal}
      />
      <TransactionConfirmationModal
        active={activeTransactionConfirm}
        attemptingTxn={attemptingTxn}
        txHash={txHash}
        description={`Removing ${parsedAmounts.CURRENCY_A?.toFixed(6)} ${
          currencyA?.symbol
        } and ${parsedAmounts.CURRENCY_B?.toFixed(6)} ${currencyB?.symbol}`}
        onClose={_onCloseTransactionConfirmModal}
      />
    </>
  );
}
