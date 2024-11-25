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
