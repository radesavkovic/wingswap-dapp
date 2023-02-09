export interface ListenerOptions {
  blocksPerFetch: number;
}

export interface MulticallState {
  callListeners: {
    [chainId: number]: {
      [callKey: string]: {
        [blocksPerFetch: number]: number;
      };
    };
  };

  callResults: {
    [chainId: number]: {
      [callKey: string]: {
        data?: string | null;
        blockNumber?: number;
        fetchingBlockNumber?: number;
      };
    };
  };
}
