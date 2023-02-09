import { SupportedChainId } from '@wingsswap/sdk';
import {
  getVersionUpgrade,
  minVersionBump,
  TokenInfo,
  TokenList,
  Version,
  VersionUpgrade,
} from '@manekiswap/token-lists';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { getNetworkLibrary } from '../connectors';
import { getTokenList } from '../functions/list';
import { RootState } from '../reducers/types';
import resolveENSContentHash from '../utils/resolveENVContentHash';

const ensResolver = (chainId: number) => async (ensName: string) => {
  const library = getNetworkLibrary();

  if (!library || chainId !== SupportedChainId.MAINNET) {
    if (chainId === SupportedChainId.MAINNET) {
      const networkLibrary = getNetworkLibrary();
      const network = await networkLibrary.getNetwork();
      if (networkLibrary && network.chainId === 1) {
        return resolveENSContentHash(ensName, networkLibrary);
      }
    }
    throw new Error('Could not construct mainnet ENS resolver');
  }
  return resolveENSContentHash(ensName, library);
};

const compareVersionForUpdate = (list: TokenList, oldList: { version: Version; tokens: TokenInfo[] }) => {
  const bump = getVersionUpgrade(oldList.version, list.version);

  switch (bump) {
    case VersionUpgrade.NONE:
      console.warn(`List ${list.name} unexpected no version bump`);
      return false;
    case VersionUpgrade.PATCH:
    case VersionUpgrade.MINOR:
      const min = minVersionBump(oldList.tokens, list.tokens);
      // automatically update minor/patch as long as bump matches the min update
      if (bump >= min) {
        return true;
      } else {
        console.error(
          `List ${list.name} could not automatically update because the version bump was only PATCH/MINOR while the update had breaking changes and should have been MAJOR`,
        );
        return false;
      }
    // update any active or inactive lists
    case VersionUpgrade.MAJOR:
      return true;
  }
};

export default createAsyncThunk(
  'list/fetchTokenList',
  async (payload: { url: string; chainId: number }, { getState }) => {
    const { url, chainId } = payload;
    const oldList = (getState() as RootState).list.lists[url];
    const oldTokens = (getState() as RootState).list.tokens[url];

    let update = false;
    const list = await getTokenList(url, ensResolver(chainId));
    if (!oldList || !oldList.version) {
      update = true;
    } else {
      update = compareVersionForUpdate(list, { version: oldList.version, tokens: oldTokens });
    }

    return { update, list };
  },
);
