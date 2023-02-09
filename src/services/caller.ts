import axios, { AxiosInstance } from 'axios';

import getBackendURL from './getBackendURL';

class _Caller {
  private _instance: AxiosInstance;

  constructor() {
    const baseURL = getBackendURL();
    this._instance = axios.create({ baseURL });
  }

  get sharedInstance() {
    return this._instance;
  }
}

export default new _Caller();
