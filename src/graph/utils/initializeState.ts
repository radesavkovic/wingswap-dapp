import { SupportedChainId } from '@wingsswap/sdk';

export default function initializeState(defaultState = {}) {
  return Object.keys(SupportedChainId)
    .filter((key) => isNaN(Number(key)))
    .reduce((memo, key) => {
      return { ...memo, [SupportedChainId[key]]: defaultState };
    }, {});
}
