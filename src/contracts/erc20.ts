import {
  Address,
  ContractCallResponse,
  TokenBalance,
  TokenInfo,
} from "@/types";
import { rEthAbi } from "./abis/rEth";
import { wEthAbi } from "./abis/wEth";
import {
  readContract,
  readContracts,
  waitForTransactionReceipt,
  writeContract,
} from "@wagmi/core";
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
      address: tokenAddress,
      name: result[0].result!,
      symbol: result[1].result!,
      decimals: result[2].result!,
    },
  };
};

export const getTokenBalance = async (
  userAddress: Address,
  token: TokenInfo
): Promise<ContractCallResponse<TokenBalance>> => {
  const contract = token.address === WETH_ADDRESS ? wEthContract : rEthContract;

  try {
    const result = await readContract(wagmiConfig, {
      address: contract.address,
      abi: contract.abi,
      functionName: "balanceOf",
      args: [userAddress],
    });

    return {
      status: ContractCallResponseStatus.Success,
      data: {
        ...token,
        balance: BigInt(result),
      },
    };
  } catch (error) {
    console.log(error);
    return {
      status: ContractCallResponseStatus.Failure,
      error: "Failed to fetch token balance",
    };
  }
};

export const getAllowance = async (
  owner: Address,
  spender: Address,
  token: TokenInfo
) => {
  const contract = token.address === WETH_ADDRESS ? wEthContract : rEthContract;

  try {
    const result = await readContract(wagmiConfig, {
      address: contract.address,
      abi: contract.abi,
      functionName: "allowance",
      args: [owner, spender],
    });

    return {
      status: ContractCallResponseStatus.Success,
      data: result,
    };
  } catch (error) {
    console.log(error);
    return {
      status: ContractCallResponseStatus.Failure,
      error: "Failed to fetch token allowance",
    };
  }
};

export const approveToken = async (spender: Address, amount: TokenBalance) => {
  const contract =
    amount.address === WETH_ADDRESS ? wEthContract : rEthContract;

  try {
    const result = await writeContract(wagmiConfig, {
      address: contract.address,
      abi: contract.abi,
      functionName: "approve",
      args: [spender, amount.balance],
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
      error: "Failed to approve token",
    };
  }
};
