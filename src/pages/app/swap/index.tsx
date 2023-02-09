import { JSBI } from '@wingsswap/sdk';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiArrowLeft, FiSettings } from 'react-icons/fi';
import { FiInfo } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Button, Flex, Heading, IconButton, Spinner, Text } from 'theme-ui';
import { ReactComponent as CopySVG } from '../../../assets/images/icons/copy.svg';
import useCopyClipboard from '../../../hooks/useCopyClipboard';
import { ReactComponent as SwapSVG } from '../../../assets/images/icons/swap.svg';
import confirmPriceImpactWithoutFee from '../../../components/confirmPriceImpactWithoutFee';
import CurrencyAmountInput from '../../../components/forms/currency-amount.input';
import TokenPickerInput from '../../../components/forms/token-picker.input';
import SwapPriceInfo from '../../../components/infos/swap-price.info';
import { getChainName, switchChain } from '../../../components/managers/switchChain';
import ReviewSwapModal from '../../../components/modals/review-swap.modal';
import SelectTokenModal from '../../../components/modals/select-token.modal';
import TransactionConfirmationModal from '../../../components/modals/transaction-confirmation.modal';
import TransactionSettingsModal from '../../../components/modals/transaction-settings.modal';
import Tooltip from '../../../components/tooltips/tooltip';
import { mediaWidthTemplates } from '../../../constants/media';
import { useAppContext } from '../../../context';
import { warningSeverity } from '../../../functions/prices';
import { computeFiatValuePriceImpact } from '../../../functions/trade';
import useActiveWeb3React from '../../../hooks/useActiveWeb3React';
import useAppChainId from '../../../hooks/useAppChainId';
import { ApprovalState, useApproveCallbackFromTrade } from '../../../hooks/useApproveCallback';
import useIsArgentWallet from '../../../hooks/useIsArgentWallet';
import { useIsPairUnsupported } from '../../../hooks/useIsSwapUnsupported';
import { useMediaQueryMaxWidth } from '../../../hooks/useMediaQuery';
import useMultihop from '../../../hooks/useMultihop';
import useParsedQueryString from '../../../hooks/useParsedQueryString';
import { useSwapCallback } from '../../../hooks/useSwapCallback';
import useSwapPair from '../../../hooks/useSwapPair';
import useToggle from '../../../hooks/useToggle';
import { useUSDCValue } from '../../../hooks/useUSDCPrice';
import { WrapType } from '../../../hooks/useWrapCallback';
import routes, { buildRoute } from '../../../routes';
import { getAddress } from '../../../utils/getAddress';
import AdvancedSwapDetails from './advanced-swap-details';
import { useReferralContract } from '../../../hooks/useContract';

const InfoIcon = () => <FiInfo sx={{ height: 13, width: 13, cursor: 'pointer', color: 'white.400' }} />;

const getReffer = (address: any) => {
  if (address) {
    
  
    return process.env.ROOT_URL + '?r=' + address;
  } else {
    return ''
  }
}

export default function SwapPage() {
  const navigate = useNavigate();
  const { t } = useTranslation(['error']);
 const [isCopied, setCopied] = useCopyClipboard();
  const [activeTransactionSettings, toggleTransactionSettings] = useToggle(false);
  const [activeReviewSwap, toggleReviewSwap] = useToggle(false);
  const [activeTransactionConfirm, toggleTransactionConfirm] = useToggle(false);
  const { toggleConnectWallet } = useAppContext();
  const [txHash, setTxHash] = useState<string>('');
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false); // clicked confirm

  const appChainId = useAppChainId();

  const isExpertMode = false;
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false);
  const isUpToExtraSmall = useMediaQueryMaxWidth('upToExtraSmall');
  const parsedQs = useParsedQueryString();

  const {
    disabledCurrency,
    isSelectingCurrency,
    toggleSelectCurrencyA,
    toggleSelectCurrencyB,
    onSelectCurrency,
    updateCurrencyAValue,
    updateCurrencyBValue,
    reset,
    formattedAmounts,
    parsedAmounts,
    trade,
    currencyBalances,
    currencies: { INPUT: currencyA, OUTPUT: currencyB },
    recipient,
    swapInputError,
    allowedSlippage,
    wrapType,
    execute: onWrap,
    wrapInputError,
  } = useSwapPair();

  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE;
  // const { address: recipientAddress } = useENSAddress(recipient);

  const { account } = useActiveWeb3React();
 
  const referralContract = useReferralContract();

  const [approvalState, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage);

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(trade, allowedSlippage, recipient);

  const singleHopOnly = !useMultihop();

  const fiatValueInput = useUSDCValue(parsedAmounts.INPUT);
  const fiatValueOutput = useUSDCValue(parsedAmounts.OUTPUT);
  const priceImpact = computeFiatValuePriceImpact(fiatValueInput, fiatValueOutput);

  // warnings on slippage
  const priceImpactSeverity = useMemo(() => {
    const executionPriceImpact = trade?.priceImpact;
    return warningSeverity(
      executionPriceImpact && priceImpact
        ? executionPriceImpact.greaterThan(priceImpact)
          ? executionPriceImpact
          : priceImpact
        : executionPriceImpact ?? priceImpact,
    );
  }, [priceImpact, trade]);

  const isArgentWallet = useIsArgentWallet();
  const swapIsUnsupported = useIsPairUnsupported(currencyA, currencyB);

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !isArgentWallet &&
    !swapInputError &&
    (approvalState === ApprovalState.NOT_APPROVED ||
      approvalState === ApprovalState.PENDING ||
      (approvalSubmitted && approvalState === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3 && !isExpertMode);

  const routeNotFound = !trade?.route;

  const userHasSpecifiedInputOutput = Boolean(
    currencyA && currencyB && parsedAmounts.INPUT?.greaterThan(JSBI.BigInt(0)),
  );

  const isValid = !swapInputError;

  useEffect(() => {
    if (approvalState === ApprovalState.PENDING) {
      setApprovalSubmitted(true);
    }
  }, [approvalState]);

  const _onCloseTransactionSettingsModal = useCallback(() => {
    toggleTransactionSettings();
  }, [toggleTransactionSettings]);

  const _onReset = useCallback(() => {
    reset();
  }, [reset]);

  const _onCloseReviewSwapModal = useCallback(

    async (confirm: boolean) => {
      toggleReviewSwap();

     
      if (!confirm) return;

      if (!swapCallback) return;
      if (priceImpact && !confirmPriceImpactWithoutFee(priceImpact)) return;

      toggleTransactionConfirm();
      setAttemptingTxn(true);

      try {
        const hash = await swapCallback();
        setTxHash(hash);
      } catch (error) {
        console.error(error);
      } finally {
        setAttemptingTxn(false);
      }
    },
    [toggleReviewSwap, swapCallback, priceImpact, toggleTransactionConfirm],
  );

  const _onCloseTransactionConfirmModal = useCallback(() => {
    toggleTransactionConfirm();
    if (txHash) {
      updateCurrencyAValue('');
      setTxHash('');
    }
  }, [toggleTransactionConfirm, txHash, updateCurrencyAValue]);

  const renderContent = useCallback(() => {
    return (
      <>
        <Flex sx={{ alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <Text sx={{ color: 'dark.100' }}>Select a pair</Text>
          <Flex>
            <Button variant="buttons.link" sx={{ marginRight: 16 }} onClick={_onReset}>
              Reset
            </Button>
            <Button
              variant="buttons.link"
              onClick={() => {
                toggleTransactionSettings();
              }}
            >
              <FiSettings sx={{ marginRight: '8px' }} />
              {!isUpToExtraSmall && 'Setting'}
            </Button>
          </Flex>
        </Flex>
        <Flex
          sx={{
            flexDirection: 'row',
            position: 'relative',
            marginBottom: trade?.executionPrice ? 64 : 24,
            ...mediaWidthTemplates.upToExtraSmall({ flexDirection: 'column' }),
          }}
        >
          <Flex
            sx={{
              marginRight: 16,
              flexDirection: 'column',
              position: 'relative',
              ...mediaWidthTemplates.upToExtraSmall({
                flex: 1,
                flexDirection: 'row',
                marginRight: 0,
                marginBottom: 12,
              }),
            }}
          >
            <TokenPickerInput
              sx={{
                width: 190,
                marginBottom: 16,
                ...mediaWidthTemplates.upToExtraSmall({ flex: 1, width: 'auto', marginBottom: 0, marginRight: 16 }),
              }}
              label="From"
              currency={currencyA}
              onClick={toggleSelectCurrencyA}
            />
            <TokenPickerInput
              sx={{ width: 190, ...mediaWidthTemplates.upToExtraSmall({ flex: 1, width: 'auto' }) }}
              label="To"
              currency={currencyB}
              onClick={toggleSelectCurrencyB}
            />
            <IconButton
              sx={{
                display: 'flex',
                height: 28,
                width: 28,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'dark.500',
                borderRadius: 'circle',
                position: 'absolute',
                top: `calc(50% - 14px)`,
                left: `calc(50% - 14px)`,
                '> svg': {
                  transform: 'rotate(90deg)',
                  height: 16,
                  width: 16,
                },
                ...mediaWidthTemplates.upToExtraSmall({
                  '> svg': {
                    transform: 'rotate(0deg)',
                  },
                }),
              }}
              onClick={() => {
                updateCurrencyAValue('');
                navigate(
                  buildRoute(
                    {
                      from: getAddress(currencyB),
                      to: getAddress(currencyA),
                      fromRoute: parsedQs.fromRoute as string,
                    },
                    { path: routes.swapNext },
                  ),
                );
              }}
            >
              <SwapSVG />
            </IconButton>
          </Flex>
          <Flex
            sx={{ flex: 1, flexDirection: 'column', ...mediaWidthTemplates.upToExtraSmall({ flexDirection: 'row' }) }}
          >
            <CurrencyAmountInput
              sx={{ marginBottom: 12, ...mediaWidthTemplates.upToExtraSmall({ marginBottom: 0, marginRight: 16 }) }}
              label="Amount"
              value={formattedAmounts.INPUT}
              fiatValue={fiatValueInput ?? undefined}
              onUserInput={updateCurrencyAValue}
            />
            <CurrencyAmountInput
              disabled={!!!currencyB}
              label="Amount"
              value={formattedAmounts.OUTPUT}
              fiatValue={fiatValueOutput ?? undefined}
              onUserInput={updateCurrencyBValue}
            />
          </Flex>
          {trade?.executionPrice && (
            <Flex sx={{ position: 'absolute', bottom: -40, right: 0, alignItems: 'center' }}>
              <SwapPriceInfo price={trade.executionPrice} />
              <Tooltip
                sx={{ marginLeft: 10 }}
                position="bottom"
                html={<AdvancedSwapDetails trade={trade} allowedSlippage={allowedSlippage} />}
              >
                <InfoIcon />
              </Tooltip>
            </Flex>
          )}
        </Flex>
        {swapIsUnsupported ? (
          <Button disabled>Unsupported Asset</Button>
        ) : swapInputError === 'INVALID_CHAIN_ID' && !!account ? (
            <Button
              sx={{background: 'linear-gradient(59deg, #ff0600 0%, #ffb400 100%)'}}
            onClick={() => {
              switchChain(appChainId);
            }}
          >
            {`Switch to ${getChainName(appChainId)}`}
          </Button>
        ) : !account ? (
              <Button
                 sx={{background: 'linear-gradient(59deg, #ff0600 0%, #ffb400 100%)' }}
            onClick={() => {
              toggleConnectWallet();
            }}
          >
            {`Connect to wallet`}
          </Button>
        ) : showWrap ? (
          <Button variant="gradient" disabled={!!wrapInputError} onClick={onWrap}>
            {wrapInputError
              ? wrapInputError
              : wrapType === WrapType.WRAP
              ? 'Wrap'
              : wrapType === WrapType.UNWRAP
              ? 'Unwrap'
              : null}
          </Button>
        ) : routeNotFound && userHasSpecifiedInputOutput ? (
          <Flex sx={{ flexDirection: 'column' }}>
            <Button disabled>Insufficient liquidity for this trade</Button>
            {singleHopOnly && (
              <Text sx={{ alignSelf: 'flex-end', fontSize: 0, marginTop: '8px', color: 'white.300' }}>
                Try enabling multi-hop trades
              </Text>
            )}
          </Flex>
        ) : showApproveFlow ? (
          approvalState !== ApprovalState.APPROVED ? (
            <Button
              variant="buttons.secondary"
              disabled={approvalState !== ApprovalState.NOT_APPROVED || approvalSubmitted}
              onClick={approveCallback}
            >
              {approvalState === ApprovalState.PENDING ? (
                <Spinner size={24} color={'white.400'} />
              ) : (
                `Approve ${currencyA?.symbol}`
              )}
            </Button>
          ) : (
            <Button
              variant="gradient"
              disabled={
                !isValid || approvalState !== ApprovalState.APPROVED || (priceImpactSeverity > 3 && !isExpertMode)
              }
              onClick={() => {
                toggleReviewSwap();
              }}
            >
              {priceImpactSeverity > 3 && !isExpertMode
                ? 'Price Impact High'
                : priceImpactSeverity > 2
                ? 'Swap Anyway'
                : 'Swap'}
            </Button>
          )
        ) : (
          <Button
            variant="gradient"
            disabled={!isValid || (priceImpactSeverity > 3 && !isExpertMode) || !!swapCallbackError}
            onClick={() => {
              toggleReviewSwap();
            }}
          >
            {swapInputError
              ? t(swapInputError as any)
              : priceImpactSeverity > 3 && !isExpertMode
              ? 'Price Impact Too High'
              : priceImpactSeverity > 2
              ? 'Swap Anyway'
              : 'Swap'}
          </Button>
        )}
        <Flex sx={{ flexDirection: 'column', marginTop: 16 }}>
          <Text sx={{ textAlign: "center", fontSize: '14', color: 'white.300', fontWeight: '400', fontStyle: 'inherit'}}>
             Share referral link to Earn swap rewards and get free tokens
          </Text>
           <Button
                variant="buttons.small-link"
                sx={{ textDecoration: 'none', marginRight: 16, }}
                onClick={() => setCopied(getReffer(account) || '')}
              >
                <CopySVG sx={{ marginRight: '8px' }} />
                {isCopied ? 'Copied' : 'Copy Referral Link'}
              </Button>
        </Flex>
      </>
      
    );
  }, [
    _onReset,
    account,
    allowedSlippage,
    appChainId,
    approvalState,
    approvalSubmitted,
    approveCallback,
    currencyA,
    currencyB,
    fiatValueInput,
    fiatValueOutput,
    formattedAmounts.INPUT,
    formattedAmounts.OUTPUT,
    isExpertMode,
    isUpToExtraSmall,
    isValid,
    navigate,
    onWrap,
    parsedQs.fromRoute,
    priceImpactSeverity,
    routeNotFound,
    showApproveFlow,
    showWrap,
    singleHopOnly,
    swapCallbackError,
    swapInputError,
    swapIsUnsupported,
    t,
    toggleConnectWallet,
    toggleReviewSwap,
    toggleSelectCurrencyA,
    toggleSelectCurrencyB,
    toggleTransactionSettings,
    trade,
    updateCurrencyAValue,
    updateCurrencyBValue,
    userHasSpecifiedInputOutput,
    wrapInputError,
    wrapType,
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
          position: 'relative',
        }}
      >
        <Flex sx={{ flexDirection: 'column', width: 512, maxWidth: '100vw' }}>
          <Button
            variant="buttons.link"
            sx={{
              alignSelf: 'flex-start',
              marginX: 16,
              marginBottom: 16,
              color: 'white.400',
              pointerEvents: !!parsedQs.fromRoute ? 'auto' : 'none',
            }}
            onClick={() => {
              if (parsedQs.fromRoute === routes.swap)
                navigate(
                  buildRoute(
                    {
                      from: getAddress(currencyA),
                      to: getAddress(currencyB),
                    },
                    { path: routes.swap },
                  ),
                );
            }}
          >
            {!!parsedQs.fromRoute && <FiArrowLeft sx={{ width: '24px !important' }} />}
            <Text
              sx={{
                fontSize: 32,
                lineHeight: '40px',
                fontWeight: '700',
                marginLeft: !!parsedQs.fromRoute ? 12 : 0,
                ...mediaWidthTemplates.upToSmall({
                  variant: 'styles.h4',
                }),
              }}
            >
              Swap
            </Text>
          </Button>
          <Flex
            sx={{
              marginX: 16,
              paddingX: 24,
              paddingTop: 24,
              paddingBottom: 32,
              flexDirection: 'column',
              backgroundColor: 'dark.500',
              borderRadius: 'lg',
              boxShadow: 'strong',
              ...mediaWidthTemplates.upToExtraSmall({
                paddingX: 16,
              }),
            }}
          >
            {renderContent()}
          </Flex>
        </Flex>
      </Flex>
      <SelectTokenModal
        active={isSelectingCurrency}
        title="Select token"
        disabledToken={disabledCurrency}
        onClose={onSelectCurrency}
      />
      <TransactionSettingsModal active={activeTransactionSettings} onClose={_onCloseTransactionSettingsModal} />
      <ReviewSwapModal
        active={activeReviewSwap}
        currencyA={currencyA && parsedAmounts?.INPUT}
        currencyB={currencyB && parsedAmounts?.OUTPUT}
        onClose={_onCloseReviewSwapModal}
      />
      <TransactionConfirmationModal
        active={activeTransactionConfirm}
        attemptingTxn={attemptingTxn}
        txHash={txHash}
        description={`Swapping ${parsedAmounts.INPUT?.toFixed(6)} ${
          currencyA?.symbol
        } for ${parsedAmounts.OUTPUT?.toFixed(6)} ${currencyB?.symbol}`}
        onClose={_onCloseTransactionConfirmModal}
      />
    </>
  );
}
