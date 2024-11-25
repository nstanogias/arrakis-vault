import { wagmiConfig } from "@/lib/config/wagmi";
import { helperAbi } from "./abis/helper";
import { vaultAbi } from "./abis/vault";
import { readContracts } from "@wagmi/core";
import { Address, ContractCallResponse, TokenBalance } from "@/types";
import { ContractCallResponseStatus } from "@/types/enums";
import { getTokenInfo } from "./erc20";

const VAULT_ADDRESS = "0x4ca9fb1f302b6bd8421bad9debd22198eb6ab723";
const HELPER_ADDRESS = "0x89E4bE1F999E3a58D16096FBe405Fc2a1d7F07D6";

const vaultContract = {
  address: VAULT_ADDRESS,
  abi: vaultAbi,
} as const;

const helperContract = {
  address: HELPER_ADDRESS,
  abi: helperAbi,
} as const;

export interface VaultData {
  address: Address;
  token0: TokenBalance;
  token1: TokenBalance;
}

export const getVaultData = async (
  vaultAddress: Address
): Promise<ContractCallResponse<VaultData>> => {
  const result = await readContracts(wagmiConfig, {
    contracts: [
      {
        ...vaultContract,
        functionName: "token0",
      },
      {
        ...vaultContract,
        functionName: "token1",
      },
      {
        ...helperContract,
        functionName: "totalUnderlying",
        args: [vaultAddress],
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

  const token0Address = result[0].result!;
  const token1Address = result[1].result!;

  const [token0Info, token1Info] = await Promise.all([
    getTokenInfo(token0Address),
    getTokenInfo(token1Address),
  ]);

  if (
    token0Info.status === ContractCallResponseStatus.Failure ||
    token1Info.status === ContractCallResponseStatus.Failure
  ) {
    return {
      status: ContractCallResponseStatus.Failure,
      error: "Failed to fetch token info",
    };
  }

  return {
    status: ContractCallResponseStatus.Success,
    data: {
      address: vaultAddress,
      token0: {
        address: token0Address,
        balance: result[2].result![0],
        ...token0Info.data,
      },
      token1: {
        address: token1Address,
        balance: result[2].result![1],
        ...token1Info.data,
      },
    },
  };
};
