export interface Call {
  address: string;
  callData: string;
  gasRequired?: number;
}

export function toCallKey(call: Call): string {
  let key = `${call.address}-${call.callData}`;
  if (call.gasRequired) {
    if (!Number.isSafeInteger(call.gasRequired)) {
      throw new Error(`Invalid number: ${call.gasRequired}`);
    }
    key += `-${call.gasRequired}`;
  }
  return key;
}

export function parseCallKey(callKey: string): Call {
  const [address, callData, gasRequired] = callKey.split('-');
  if (!address || !callData) {
    throw new Error(`Invalid call key: ${callKey}`);
  }
  return {
    address,
    callData,
    gasRequired: !!gasRequired ? Number.parseInt(gasRequired) : undefined,
  };
}
