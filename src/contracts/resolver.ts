import { wagmiConfig } from "@/lib/config/wagmi";
import { Address, ContractCallResponse, TokenBalance } from "@/types";
import { readContract } from "@wagmi/core";
import { resolverAbi } from "./abis/resolver";
import { ContractCallResponseStatus } from "@/types/enums";

export const RESOLVER_ADDRESS = "0x535c5fdf31477f799366df6e4899a12a801cc7b8";

export const getMintAmounts = async (
  vaultV2: Address,
  amount0Max: TokenBalance,
  amount1Max: TokenBalance
): Promise<
  ContractCallResponse<{
    amount0: bigint;
    amount1: bigint;
    mintAmount: bigint;
  }>
> => {
  try {
    const result = await readContract(wagmiConfig, {
      address: RESOLVER_ADDRESS,
      abi: resolverAbi,
      functionName: "getMintAmounts",
      args: [vaultV2, amount0Max.balance, amount1Max.balance],
    });

    return {
      status: ContractCallResponseStatus.Success,
      data: {
        amount0: result[0],
        amount1: result[1],
        mintAmount: result[2],
      },
    };
  } catch (error) {
    console.log(error);
    return {
      status: ContractCallResponseStatus.Failure,
      error: "Failed to get min amounts",
    };
  }
};
