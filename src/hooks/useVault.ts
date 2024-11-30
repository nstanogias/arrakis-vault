"use client";

import { getVaultData, VaultData } from "@/contracts/vault";
import { Address } from "@/types";
import { useEffect, useState } from "react";

const mockVaultData = {
  address: "0x4ca9fb1f302b6bd8421bad9debd22198eb6ab723" as Address,
  token0: {
    address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    balance: 100000000000000000000n,
    decimals: 18,
    name: "Wrapped Ether",
    symbol: "WETH",
  },
  token1: {
    address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1" as Address,
    balance: 200000000000000000000n,
    decimals: 18,
    name: "Wrapped Ether",
    symbol: "WETH",
  },
};

export const useVault = (vaultAddress: Address) => {
  const [vaultData, setVaultData] = useState<VaultData>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVaultData = async () => {
      if (!vaultAddress) return;
      setLoading(true);
      setError(null);

      try {
        const result = await getVaultData(vaultAddress);
        console.log(result);
        if (result.status === "failure") {
          setError(result.error);
          return;
        }
        setVaultData(result.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch vault data");
      } finally {
        setLoading(false);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).isPlaywrightTest) {
      setVaultData(mockVaultData);
      return;
    }
    fetchVaultData();
  }, [vaultAddress]);

  return { vaultData, loading, error };
};
