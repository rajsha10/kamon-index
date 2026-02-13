import {
  IndexerGrpcExplorerApi,
  IndexerGrpcSpotApi,
  IndexerGrpcDerivativesApi,
  IndexerGrpcAccountApi,
  ChainGrpcBankApi,
  ChainGrpcStakingApi,
  ChainGrpcGovApi
} from "@injectivelabs/sdk-ts";
import { getNetworkEndpoints, Network } from "@injectivelabs/networks";

const network = Network.MainnetSentry;
const endpoints = getNetworkEndpoints(network);

export const explorerApi = new IndexerGrpcExplorerApi(endpoints.explorer!);
export const spotApi = new IndexerGrpcSpotApi(endpoints.indexer);
export const derivativesApi = new IndexerGrpcDerivativesApi(endpoints.indexer);
export const accountApi = new IndexerGrpcAccountApi(endpoints.indexer);
export const bankApi = new ChainGrpcBankApi(endpoints.grpc);
export const stakingApi = new ChainGrpcStakingApi(endpoints.grpc);
export const govApi = new ChainGrpcGovApi(endpoints.grpc);