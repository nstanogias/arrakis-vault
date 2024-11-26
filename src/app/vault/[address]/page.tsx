"use client";

import LiquidityForm from "@/components/LiquidityForm";
import { Button } from "@/components/ui/button";
import { useVault } from "@/hooks/useVault";
import { formatTokenBalance } from "@/lib/utils";
import { Address } from "@/types";
import { useRouter } from "next/navigation";
import { use } from "react";

export default function Vault({
  params,
}: {
  params: Promise<{ address: Address }>;
}) {
  const router = useRouter();
  const { address } = use(params);
  const { vaultData, loading, error } = useVault(address as Address);

  if (loading) return <p>Loading vault data...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!vaultData) return <p>No vault data found</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Vault Balance:</h1>
      <div className="mt-4">
        <p>
          <strong>{vaultData.token0.name}</strong>{" "}
          {formatTokenBalance(
            vaultData.token0.balance,
            vaultData.token0.decimals
          ).toFixed(5)}
        </p>
        <p>
          <strong>{vaultData?.token1.name}</strong>{" "}
          {formatTokenBalance(
            vaultData.token1.balance,
            vaultData.token1.decimals
          ).toFixed(5)}
        </p>
      </div>
      <LiquidityForm vaultData={vaultData} />
      <Button
        onClick={() => router.push("/")}
        className="w-fit text-white bg-gray-900 hover:bg-gray-700"
      >
        Back to Vaults
      </Button>
    </div>
  );
}
