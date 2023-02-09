import * as jspb from 'google-protobuf'



export class SearchRequest extends jspb.Message {
  getKeyword(): string;
  setKeyword(value: string): SearchRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SearchRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SearchRequest): SearchRequest.AsObject;
  static serializeBinaryToWriter(message: SearchRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SearchRequest;
  static deserializeBinaryFromReader(message: SearchRequest, reader: jspb.BinaryReader): SearchRequest;
}

export namespace SearchRequest {
  export type AsObject = {
    keyword: string,
  }
}

export class SearchResponse extends jspb.Message {
  getRespList(): Array<SearchResult>;
  setRespList(value: Array<SearchResult>): SearchResponse;
  clearRespList(): SearchResponse;
  addResp(value?: SearchResult, index?: number): SearchResult;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SearchResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SearchResponse): SearchResponse.AsObject;
  static serializeBinaryToWriter(message: SearchResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SearchResponse;
  static deserializeBinaryFromReader(message: SearchResponse, reader: jspb.BinaryReader): SearchResponse;
}

export namespace SearchResponse {
  export type AsObject = {
    respList: Array<SearchResult.AsObject>,
  }
}

export class SearchResult extends jspb.Message {
  getName(): string;
  setName(value: string): SearchResult;

  getAddress(): string;
  setAddress(value: string): SearchResult;

  getSymbol(): string;
  setSymbol(value: string): SearchResult;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SearchResult.AsObject;
  static toObject(includeInstance: boolean, msg: SearchResult): SearchResult.AsObject;
  static serializeBinaryToWriter(message: SearchResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SearchResult;
  static deserializeBinaryFromReader(message: SearchResult, reader: jspb.BinaryReader): SearchResult;
}

export namespace SearchResult {
  export type AsObject = {
    name: string,
    address: string,
    symbol: string,
  }
}

export class GetMetricRequest extends jspb.Message {
  getKeyword(): string;
  setKeyword(value: string): GetMetricRequest;

  getMetric(): string;
  setMetric(value: string): GetMetricRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetMetricRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetMetricRequest): GetMetricRequest.AsObject;
  static serializeBinaryToWriter(message: GetMetricRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetMetricRequest;
  static deserializeBinaryFromReader(message: GetMetricRequest, reader: jspb.BinaryReader): GetMetricRequest;
}

export namespace GetMetricRequest {
  export type AsObject = {
    keyword: string,
    metric: string,
  }
}

export class GetMetricResponse extends jspb.Message {
  getRespList(): Array<GetMetricResult>;
  setRespList(value: Array<GetMetricResult>): GetMetricResponse;
  clearRespList(): GetMetricResponse;
  addResp(value?: GetMetricResult, index?: number): GetMetricResult;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetMetricResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetMetricResponse): GetMetricResponse.AsObject;
  static serializeBinaryToWriter(message: GetMetricResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetMetricResponse;
  static deserializeBinaryFromReader(message: GetMetricResponse, reader: jspb.BinaryReader): GetMetricResponse;
}

export namespace GetMetricResponse {
  export type AsObject = {
    respList: Array<GetMetricResult.AsObject>,
  }
}

export class GetMetricResult extends jspb.Message {
  getTimestamp(): number;
  setTimestamp(value: number): GetMetricResult;

  getValue(): number;
  setValue(value: number): GetMetricResult;

  getGrowth(): number;
  setGrowth(value: number): GetMetricResult;

  getRanking(): number;
  setRanking(value: number): GetMetricResult;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetMetricResult.AsObject;
  static toObject(includeInstance: boolean, msg: GetMetricResult): GetMetricResult.AsObject;
  static serializeBinaryToWriter(message: GetMetricResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetMetricResult;
  static deserializeBinaryFromReader(message: GetMetricResult, reader: jspb.BinaryReader): GetMetricResult;
}

export namespace GetMetricResult {
  export type AsObject = {
    timestamp: number,
    value: number,
    growth: number,
    ranking: number,
  }
}

export class GetCryptoInfoRequest extends jspb.Message {
  getKeyword(): string;
  setKeyword(value: string): GetCryptoInfoRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetCryptoInfoRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetCryptoInfoRequest): GetCryptoInfoRequest.AsObject;
  static serializeBinaryToWriter(message: GetCryptoInfoRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetCryptoInfoRequest;
  static deserializeBinaryFromReader(message: GetCryptoInfoRequest, reader: jspb.BinaryReader): GetCryptoInfoRequest;
}

export namespace GetCryptoInfoRequest {
  export type AsObject = {
    keyword: string,
  }
}

export class GetCryptoInfoResponse extends jspb.Message {
  getCoinname(): string;
  setCoinname(value: string): GetCryptoInfoResponse;

  getRank(): number;
  setRank(value: number): GetCryptoInfoResponse;

  getDescription(): string;
  setDescription(value: string): GetCryptoInfoResponse;

  getPrice(): number;
  setPrice(value: number): GetCryptoInfoResponse;

  getPricechange24h(): number;
  setPricechange24h(value: number): GetCryptoInfoResponse;

  getMaketcap(): number;
  setMaketcap(value: number): GetCryptoInfoResponse;

  getMaketcapchange24h(): number;
  setMaketcapchange24h(value: number): GetCryptoInfoResponse;

  getVolume(): number;
  setVolume(value: number): GetCryptoInfoResponse;

  getCirculatingsupply(): number;
  setCirculatingsupply(value: number): GetCryptoInfoResponse;

  getTotalsupply(): number;
  setTotalsupply(value: number): GetCryptoInfoResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetCryptoInfoResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetCryptoInfoResponse): GetCryptoInfoResponse.AsObject;
  static serializeBinaryToWriter(message: GetCryptoInfoResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetCryptoInfoResponse;
  static deserializeBinaryFromReader(message: GetCryptoInfoResponse, reader: jspb.BinaryReader): GetCryptoInfoResponse;
}

export namespace GetCryptoInfoResponse {
  export type AsObject = {
    coinname: string,
    rank: number,
    description: string,
    price: number,
    pricechange24h: number,
    maketcap: number,
    maketcapchange24h: number,
    volume: number,
    circulatingsupply: number,
    totalsupply: number,
  }
}

