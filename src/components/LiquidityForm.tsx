"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import TokenInput from "./TokenInput";
import { Button } from "./ui/button";
import { useAccount } from "wagmi";
import WalletConnectButton from "./WalletConnectButton";
import { VaultData } from "@/contracts/vault";
import { formatTokenBalance, imageSrcMapper } from "@/lib/utils";
import Image from "next/image";
import { getTokenBalance } from "@/contracts/erc20";
import LiquidityStepsModal from "./LiquidityStepsModal";

interface Props {
  vaultData: VaultData;
}
const LiquidityForm = ({ vaultData }: Props) => {
  const account = useAccount();
  const [isModalOpen, setModalOpen] = useState(false);
  const { control, watch, setValue } = useForm({
    defaultValues: {
      token0: "",
      token1: "",
    },
  });

  const [userBalances, setUserBalances] = useState<number[]>([0, 0]);

  const token0Value = watch("token0");
  const token1Value = watch("token1");

  const token0ExceedsBalance = +token0Value > userBalances[0];
  const token1ExceedsBalance = +token1Value > userBalances[1];

  useEffect(() => {
    const fetchBalances = async () => {
      if (!account.isConnected || !account.address) return;
      const [userBalanceToken0, userBalanceToken1] = await Promise.all([
        getTokenBalance(account.address, vaultData.token0),
        getTokenBalance(account.address, vaultData.token1),
      ]);
      if (
        userBalanceToken0.status === "failure" ||
        userBalanceToken1.status === "failure"
      ) {
        console.error("Failed to fetch token balances");
        return;
      }
      setUserBalances([
        formatTokenBalance(
          userBalanceToken0.data.balance,
          userBalanceToken0.data.decimals
        ),
        formatTokenBalance(
          userBalanceToken1.data.balance,
          userBalanceToken1.data.decimals
        ),
      ]);
    };
    fetchBalances();
  }, [account]);

  // Bi-Directional Sync
  useEffect(() => {
    // we need this to avoide infinite loops when user is typing
    if (document.activeElement?.id === "token0") {
      const token0Number = parseFloat(token0Value) || 0;
      setValue("token1", (token0Number * 2).toFixed(8));
    }
  }, [token0Value, setValue]);

  // Bi-Directional Sync
  useEffect(() => {
    if (document.activeElement?.id === "token1") {
      const token1Number = parseFloat(token1Value) || 0;
      setValue("token0", (token1Number / 2).toFixed(8));
    }
  }, [token1Value, setValue]);

  const handleInputChange = (value: string): string => {
    value = value.replace(/[^0-9.]/g, "");

    if (value.startsWith(".")) {
      value = "0" + value;
    }

    const parts = value.split(".");
    if (parts.length > 2) {
      value = parts[0] + "." + parts[1];
    }

    return value;
  };

  const handleMaxToken0Balance = () => {
    const maxValue = userBalances[0].toString();
    setValue("token0", maxValue);
    setValue("token1", (+maxValue * 2).toString());
  };

  const handleMaxToken1Balance = () => {
    const maxValue = userBalances[1].toString();
    setValue("token1", maxValue);
    setValue("token0", (+maxValue / 2).toString());
  };

  const handleFormSubmit = () => {
    setModalOpen(true);
  };

  return (
    <div className="p-6 space-y-4 bg-white rounded shadow-lg max-w-lg mx-auto">
      <div className="mb-4">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">Add Liquidity</h2>
          <div className="flex justify-center items-center space-x-2">
            <Image
              src="/assets/images/arb.webp"
              alt="arbitrum"
              width={24}
              height={24}
            />
            <span className="font-medium text-gray-500">Arbitrum</span>
          </div>
        </div>

        <div className="flex justify-center items-center">
          <Image
            src={imageSrcMapper[vaultData.token0.symbol]}
            alt={vaultData.token0.symbol}
            width={24}
            height={24}
          />
          <Image
            src={imageSrcMapper[vaultData.token1.symbol]}
            alt={vaultData.token1.symbol}
            width={24}
            height={24}
            className="-ml-[5px]"
          />
          <span className="text-sm font-medium text-gray-500 ml-2">
            {vaultData.token0.symbol}/{vaultData.token1.symbol}
          </span>
        </div>
      </div>

      <Controller
        name="token0"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TokenInput
            id="token0"
            value={value}
            onChange={(val) => onChange(handleInputChange(val))}
            tokenName={vaultData.token0.symbol}
            balance={userBalances[0]}
            onMaxClick={handleMaxToken0Balance}
            hasError={token0ExceedsBalance}
          />
        )}
      />

      <Controller
        name="token1"
        control={control}
        render={({ field: { onChange, value } }) => (
          <TokenInput
            id="token1"
            value={value}
            onChange={(val) => onChange(handleInputChange(val))}
            tokenName={vaultData.token1.symbol}
            balance={userBalances[1]}
            onMaxClick={handleMaxToken1Balance}
            hasError={token1ExceedsBalance}
          />
        )}
      />

      {account.isConnected ? (
        <Button
          type="submit"
          onClick={handleFormSubmit}
          className={`w-full ${
            token0ExceedsBalance || token1ExceedsBalance
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600"
          }`}
          disabled={token0ExceedsBalance || token1ExceedsBalance}
        >
          {token0ExceedsBalance || token1ExceedsBalance
            ? "Insufficient Funds"
            : "Confirm"}
        </Button>
      ) : (
        <WalletConnectButton className="w-full bg-orange-500 hover:bg-orange-600" />
      )}

      <LiquidityStepsModal
        isOpen={isModalOpen}
        token0Value={+token0Value}
        token1Value={+token1Value}
        token0Info={vaultData.token0}
        token1Info={vaultData.token1}
        vaultAddress={vaultData.address}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default LiquidityForm;
