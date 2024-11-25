import { ContractCallResponseStatus, Network, TokenSymbol } from "./enums";

export interface VaultCardData {
  vaultAddress: string;
  token0: TokenSymbol;
  token1: TokenSymbol;
  network: Network;
  tvl: string;
  volume30d: string;
  return30d: string;
  dailyVolumeTvl: string;
}

export type Address = `0x${string}`;

type SuccessfullResponse<T> = {
  status: ContractCallResponseStatus.Success;
  data: T;
};

type ErrorResponse = {
  status: ContractCallResponseStatus.Failure;
  error: string;
};

export type ContractCallResponse<T> = SuccessfullResponse<T> | ErrorResponse;

export type TokenBalance = {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  balance: bigint;
};
