export interface ApplicationState {
  blockNumber: {
    [chainId: number]: number;
  };
  subgraphStatus: {
    available: boolean | null;
    syncedBlock: number | undefined;
    headBlock: number | undefined;
  };
}
