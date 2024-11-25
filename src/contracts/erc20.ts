import { Address, ContractCallResponse } from "@/types";
import { rEthAbi } from "./abis/rEth";
import { wEthAbi } from "./abis/wEth";
import { readContracts } from "@wagmi/core";
import { wagmiConfig } from "@/lib/config/wagmi";
import { ContractCallResponseStatus } from "@/types/enums";

const WETH_ADDRESS = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1";
const rETH_ADDRESS = "0xEC70Dcb4A1EFa46b8F2D97C310C9c4790ba5ffA8";

const wEthContract = {
  address: WETH_ADDRESS,
  abi: wEthAbi,
} as const;

const rEthContract = {
  address: rETH_ADDRESS,
  abi: rEthAbi,
} as const;

interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
}

export const getTokenInfo = async (
  tokenAddress: Address
): Promise<ContractCallResponse<TokenInfo>> => {
  const contract = tokenAddress === WETH_ADDRESS ? wEthContract : rEthContract;
  const result = await readContracts(wagmiConfig, {
    contracts: [
      {
        ...contract,
        functionName: "name",
      },
      {
        ...contract,
        functionName: "symbol",
      },
      {
        ...contract,
        functionName: "decimals",
      },
    ],
  });

  const error = result.find((res) => res.status === "failure");
  if (error) {
    return {
      status: ContractCallResponseStatus.Failure,
      error: error.error.message,
    };
  }

  return {
    status: ContractCallResponseStatus.Success,
    data: {
      name: result[0].result!,
      symbol: result[1].result!,
      decimals: result[2].result!,
    },
  };
};
