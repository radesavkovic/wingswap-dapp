import { TokenList, Version } from '@manekiswap/token-lists';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

import { DEFAULT_LIST_OF_LISTS } from '../constants/token-lists';
import contenthashToUri from '../utils/contenthashToUri';
import { parseENSAddress } from '../utils/parseENSAddress';
import uriToHttp from '../utils/uriToHttp';

const schema = require('@manekiswap/token-lists/dist/tokenlist.schema.json');

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const tokenListValidator = ajv.compile(schema);

/**
 * Contains the logic for resolving a list URL to a validated token list
 * @param listUrl list url
 * @param resolveENSContentHash resolves an ens name to a contenthash
 */
export async function getTokenList(
  listUrl: string,
  resolveENSContentHash: (ensName: string) => Promise<string>,
): Promise<TokenList> {
  const parsedENS = parseENSAddress(listUrl);
  let urls: string[];
  if (parsedENS) {
    let contentHashUri;
    try {
      contentHashUri = await resolveENSContentHash(parsedENS.ensName);
    } catch (error) {
      console.debug(`Failed to resolve ENS name: ${parsedENS.ensName}`, error);
      throw new Error(`Failed to resolve ENS name: ${parsedENS.ensName}`);
    }
    let translatedUri;
    try {
      translatedUri = contenthashToUri(contentHashUri);
    } catch (error) {
      console.debug('Failed to translate contenthash to URI', contentHashUri);
      throw new Error(`Failed to translate contenthash to URI: ${contentHashUri}`);
    }
    urls = uriToHttp(`${translatedUri}${parsedENS.ensPath ?? ''}`);
  } else {
    urls = uriToHttp(listUrl);
  }
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const isLast = i === urls.length - 1;
    let response;
    try {
      response = await fetch(url);
    } catch (error) {
      console.debug('Failed to fetch list', listUrl, error);
      if (isLast) throw new Error(`Failed to download list ${listUrl}`);
      continue;
    }

    if (!response.ok) {
      if (isLast) throw new Error(`Failed to download list ${listUrl}`);
      continue;
    }

    const json = await response.json();
    if (!tokenListValidator(json)) {
      const validationErrors: string =
        tokenListValidator.errors?.reduce<string>((memo, error) => {
          const add = `${error.instancePath} ${error.message ?? ''}`;
          return memo.length > 0 ? `${memo}; ${add}` : `${add}`;
        }, '') ?? 'unknown error';
      throw new Error(`Token list failed validation: ${validationErrors}`);
    }

    return json as TokenList;
  }
  throw new Error('Unrecognized list URL protocol.');
}

const DEFAULT_LIST_PRIORITIES = DEFAULT_LIST_OF_LISTS.reduce<{ [listUrl: string]: number }>((memo, listUrl, index) => {
  memo[listUrl] = index + 1;
  return memo;
}, {});

// use ordering of default list of lists to assign priority
export function sortByListPriority(urlA: string, urlB: string) {
  if (DEFAULT_LIST_PRIORITIES[urlA] && DEFAULT_LIST_PRIORITIES[urlB]) {
    return DEFAULT_LIST_PRIORITIES[urlA] - DEFAULT_LIST_PRIORITIES[urlB];
  }
  return 0;
}

export function listVersionLabel(version: Version): string {
  return `v${version.major}.${version.minor}.${version.patch}`;
}
