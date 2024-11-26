import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatUnits } from "viem";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatTokenBalance = (
  balance: bigint,
  decimals: number
): number => {
  return Number(formatUnits(balance, decimals));
};

export const imageSrcMapper: Record<string, string> = {
  WETH: "/assets/images/weth.webp",
  rETH: "/assets/images/reth.webp",
};
