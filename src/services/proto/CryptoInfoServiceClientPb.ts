/**
 * @fileoverview gRPC-Web generated client stub for 
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as CryptoInfo_pb from './CryptoInfo_pb';


export class CryptoInfoClient {
  client_: grpcWeb.AbstractClientBase;
  hostname_: string;
  credentials_: null | { [index: string]: string; };
  options_: null | { [index: string]: any; };

  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; }) {
    if (!options) options = {};
    if (!credentials) credentials = {};
    options['format'] = 'binary';

    this.client_ = new grpcWeb.GrpcWebClientBase(options);
    this.hostname_ = hostname;
    this.credentials_ = credentials;
    this.options_ = options;
  }

  methodInfoGetCryptoInfo = new grpcWeb.MethodDescriptor(
    '/CryptoInfo/GetCryptoInfo',
    grpcWeb.MethodType.UNARY,
    CryptoInfo_pb.GetCryptoInfoRequest,
    CryptoInfo_pb.GetCryptoInfoResponse,
    (request: CryptoInfo_pb.GetCryptoInfoRequest) => {
      return request.serializeBinary();
    },
    CryptoInfo_pb.GetCryptoInfoResponse.deserializeBinary
  );

  getCryptoInfo(
    request: CryptoInfo_pb.GetCryptoInfoRequest,
    metadata: grpcWeb.Metadata | null): Promise<CryptoInfo_pb.GetCryptoInfoResponse>;

  getCryptoInfo(
    request: CryptoInfo_pb.GetCryptoInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: CryptoInfo_pb.GetCryptoInfoResponse) => void): grpcWeb.ClientReadableStream<CryptoInfo_pb.GetCryptoInfoResponse>;

  getCryptoInfo(
    request: CryptoInfo_pb.GetCryptoInfoRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: CryptoInfo_pb.GetCryptoInfoResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CryptoInfo/GetCryptoInfo',
        request,
        metadata || {},
        this.methodInfoGetCryptoInfo,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CryptoInfo/GetCryptoInfo',
    request,
    metadata || {},
    this.methodInfoGetCryptoInfo);
  }

  methodInfoGetMetric = new grpcWeb.MethodDescriptor(
    '/CryptoInfo/GetMetric',
    grpcWeb.MethodType.UNARY,
    CryptoInfo_pb.GetMetricRequest,
    CryptoInfo_pb.GetMetricResponse,
    (request: CryptoInfo_pb.GetMetricRequest) => {
      return request.serializeBinary();
    },
    CryptoInfo_pb.GetMetricResponse.deserializeBinary
  );

  getMetric(
    request: CryptoInfo_pb.GetMetricRequest,
    metadata: grpcWeb.Metadata | null): Promise<CryptoInfo_pb.GetMetricResponse>;

  getMetric(
    request: CryptoInfo_pb.GetMetricRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: CryptoInfo_pb.GetMetricResponse) => void): grpcWeb.ClientReadableStream<CryptoInfo_pb.GetMetricResponse>;

  getMetric(
    request: CryptoInfo_pb.GetMetricRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: CryptoInfo_pb.GetMetricResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CryptoInfo/GetMetric',
        request,
        metadata || {},
        this.methodInfoGetMetric,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CryptoInfo/GetMetric',
    request,
    metadata || {},
    this.methodInfoGetMetric);
  }

  methodInfoSearch = new grpcWeb.MethodDescriptor(
    '/CryptoInfo/Search',
    grpcWeb.MethodType.UNARY,
    CryptoInfo_pb.SearchRequest,
    CryptoInfo_pb.SearchResponse,
    (request: CryptoInfo_pb.SearchRequest) => {
      return request.serializeBinary();
    },
    CryptoInfo_pb.SearchResponse.deserializeBinary
  );

  search(
    request: CryptoInfo_pb.SearchRequest,
    metadata: grpcWeb.Metadata | null): Promise<CryptoInfo_pb.SearchResponse>;

  search(
    request: CryptoInfo_pb.SearchRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: CryptoInfo_pb.SearchResponse) => void): grpcWeb.ClientReadableStream<CryptoInfo_pb.SearchResponse>;

  search(
    request: CryptoInfo_pb.SearchRequest,
    metadata: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: CryptoInfo_pb.SearchResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/CryptoInfo/Search',
        request,
        metadata || {},
        this.methodInfoSearch,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/CryptoInfo/Search',
    request,
    metadata || {},
    this.methodInfoSearch);
  }

}

