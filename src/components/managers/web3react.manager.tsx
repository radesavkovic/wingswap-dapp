import { useWeb3React } from '@web3-react/core';
import { PropsWithChildren, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Flex, Heading, Spinner } from 'theme-ui';

import { network } from '../../connectors';
import { NetworkContextName } from '../../constants';
import useEagerConnect from '../../hooks/useEagerConnect';
import useInactiveListener from '../../hooks/useInactiveListener';

export default function Web3ReactManager({ children }: PropsWithChildren<{}>) {
  const { t } = useTranslation(['error']);
  const { active } = useWeb3React();
  const { active: networkActive, error: networkError, activate: activateNetwork } = useWeb3React(NetworkContextName);

  // try to eagerly connect to an injected provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  // after eagerly trying injected, if the network connect ever isn't active or in an error state, activate itd
  useEffect(() => {
    if (triedEager && !networkActive && !networkError && !active) {
      activateNetwork(network);
    }
  }, [triedEager, networkActive, networkError, activateNetwork, active]);

  // when there's no account connected, react to logins (broadly speaking) on the injected provider, if it exists
  useInactiveListener(!triedEager);

  // handle delayed loader state
  const [showLoader, setShowLoader] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoader(true);
    }, 600);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  // on page load, do nothing until we've tried to connect to the injected connector
  if (!triedEager) {
    return null;
  }

  // if the account context isn't active, and there's an error on the network context, it's an irrecoverable error
  if (!active && networkError && networkError.message.indexOf('Unsupported chain id') === -1) {
    return (
      <Flex
        sx={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 48, backgroundColor: 'background' }}
      >
        <Heading variant="styles.h1">{t('error:web3')}</Heading>
      </Flex>
    );
  }

  // if neither context is active, spin
  if (!active && !networkActive) {
    return showLoader ? (
      <Flex sx={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'background' }}>
        <Spinner />
      </Flex>
    ) : null;
  }

  return <>{children}</>;
}
