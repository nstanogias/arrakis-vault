"use client";

import { getVaultData, VaultData } from "@/contracts/vault";
import { Address } from "@/types";
import { useEffect, useState } from "react";

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

    fetchVaultData();
  }, [vaultAddress]);

  return { vaultData, loading, error };
};
