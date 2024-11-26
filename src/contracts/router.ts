import { waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { wagmiConfig } from "@/lib/config/wagmi";
import { Address, TokenBalance } from "@/types";
import { routerAbi } from "./abis/router";
import { zeroAddress } from "viem";
import { ContractCallResponseStatus } from "@/types/enums";
import { getMintAmounts } from "./resolver";

export const ROUTER_ADDRESS = "0x6aC8Bab8B775a03b8B72B2940251432442f61B94";

export const addLiquidity = async (
  tokenAmount0: TokenBalance,
  tokenAmount1: TokenBalance,
  vault: Address,
  user: Address
) => {
  try {
    const mintAmounts = await getMintAmounts(vault, tokenAmount0, tokenAmount1);

    if (mintAmounts.status === ContractCallResponseStatus.Failure) {
      throw new Error("Failed to get mint amounts");
    }

    const result = await writeContract(wagmiConfig, {
      address: ROUTER_ADDRESS,
      abi: routerAbi,
      functionName: "addLiquidity",
      args: [
        {
          amount0Max: tokenAmount0.balance,
          amount1Max: tokenAmount1.balance,
          amount0Min: mintAmounts.data.amount0,
          amount1Min: mintAmounts.data.amount1,
          amountSharesMin: mintAmounts.data.mintAmount,
          vault: vault,
          receiver: user,
          gauge: zeroAddress,
        },
      ],
    });

    const transactionReceipt = await waitForTransactionReceipt(wagmiConfig, {
      hash: result,
    });

    return {
      status: ContractCallResponseStatus.Success,
      data: transactionReceipt,
    };
  } catch (error) {
    console.log(error);
    return {
      status: ContractCallResponseStatus.Failure,
      error: "Failed to add Liquidity",
    };
  }
};
