import { UnsupportedChainIdError } from '@web3-react/core';
import { useCallback } from 'react';
import { Button, Flex, Text } from 'theme-ui';

import { mediaWidthTemplates } from '../../constants/media';
import { useAppContext } from '../../context';
import useActiveWeb3React from '../../hooks/useActiveWeb3React';
import useAppChainId from '../../hooks/useAppChainId';
import { useWalletBalances } from '../../hooks/useWalletBalances';
import { ellipsis } from '../../utils/strings';
import IdentityLogo from '../logos/identity.logo';
import { getChainName, switchChain } from '../managers/switchChain';
import ConnectWalletModal from '../modals/connect-wallet.modal';

export default function ConnectWalletButton() {
  
  const { activeConnectWallet, toggleConnectWallet } = useAppContext();
  const { active, account, chainId, error } = useActiveWeb3React();
  const appChainId = useAppChainId();
  const userBalance = useWalletBalances(account ? [account] : [])?.[account ?? ''];

  const renderConnect = useCallback(() => {
    if (!!error) return null;

    return (
      <>
        {chainId !== appChainId && !!account ? (
          <Button
            variant="buttons.primary"
            sx={{ height: 40, fontSize: 0, paddingX: 16, background: 'linear-gradient(59deg, #ff0600 0%, #ffb400 100%)' }}
            onClick={() => {
              switchChain(appChainId);
            }}
          >
            {`Switch to ${getChainName(appChainId)}`}
          </Button>
        ) : active && !!account ? (
          <Flex sx={{ alignItems: 'center' }}>
            <Text
              sx={{
                marginRight: 16,
                fontWeight: 'bold',
                fontSize: 2,
                color: 'white.300',
                ...mediaWidthTemplates.upToExtraSmall({
                  display: 'none',
                }),
              }}
            >{`${userBalance?.toSignificant(3) || 0} ${userBalance?.currency.symbol ?? ''}`}</Text>
            <Button
              variant="buttons.small-ghost"
              sx={{ alignItems: 'center', backgroundColor: 'dark.500', color: 'white.200' }}
              onClick={() => {
                toggleConnectWallet();
              }}
            >
              <IdentityLogo sx={{ marginRight: 16 }} />
              {ellipsis(account, { left: 6, right: 4 })}
            </Button>
          </Flex>
        ) : (
          <Button
            variant="buttons.primary"
            sx={{ height: 40, fontSize: 0, paddingX: 16 , background: 'linear-gradient(59deg, #ff0600 0%, #ffb400 100%)' }}
            onClick={() => {
              toggleConnectWallet();
            }}
          >
            Connect to wallet
          </Button>
        )}
      </>
    );
  }, [account, active, appChainId, chainId, error, toggleConnectWallet, userBalance]);

  return (
    <>
      {!!error && error instanceof UnsupportedChainIdError && (
        <Button
          variant="buttons.small-error"
          sx={{background: 'linear-gradient(59deg, #ff0600 0%, #ffb400 100%)' }}
          onClick={() => {
            toggleConnectWallet();
          }}
        >
          Wrong network
        </Button>
      )}
      {renderConnect()}
      <ConnectWalletModal
        active={activeConnectWallet}
        onClose={() => {
          toggleConnectWallet();
        }}
      />
    </>
  );
}
