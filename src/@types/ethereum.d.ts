interface RequestArguments {
  method: string;
  params?: unknown[] | object;
}

interface Window {
  ethereum?: {
    isMetaMask?: true;
    on?: (...args: any[]) => void;
    removeListener?: (...args: any[]) => void;
    autoRefreshOnNetworkChange?: boolean;
    request(args: RequestArguments): Promise<unknown>;
  };
  web3?: Record<string, unknown>;
}
