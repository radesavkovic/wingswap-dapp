import { getNameFromData, rmPrefix } from 'multicodec';
import { bytes, CID } from 'multiformats';
import { base58btc } from 'multiformats/bases/base58';

export function hexToUint8Array(value: string): Uint8Array {
  const hex = value.startsWith('0x') ? value.substr(2) : value;
  return bytes.fromHex(hex);
}

const UTF_8_DECODER = new TextDecoder('utf-8');

/**
 * Parse content hash
 * @see {@link https://github.com/multiformats/multicodec/blob/master/table.csv}
 */
export default function contenthashToUri(contenthash: string): string {
  const buff = hexToUint8Array(contenthash);
  const name = getNameFromData(buff);
  switch (name) {
    case 'ipfs-ns': {
      const data = rmPrefix(buff);
      const cid = CID.decode(data);
      return `ipfs://${cid.toString(base58btc.encoder)}`;
    }
    case 'ipns-ns': {
      const data = rmPrefix(buff);
      const cid = CID.decode(data);
      if (cid.multihash.code === 0x00) {
        return `ipns://${UTF_8_DECODER.decode(cid.multihash.digest).trim()}`;
      } else {
        return `ipns://${cid.toString(base58btc.encoder)}`;
      }
    }
    default:
      throw new Error(`Unrecognized name: ${name}`);
  }
}
