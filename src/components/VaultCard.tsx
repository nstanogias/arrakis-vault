"use client";

import { useRouter } from "next/navigation";
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Button } from "./ui/button";
import Image from "next/image";
import { VaultCardData } from "@/types";

type Props = VaultCardData;

const VaultCard = ({
  vaultAddress,
  token0,
  token1,
  network,
  tvl,
  volume30d,
  return30d,
  dailyVolumeTvl,
}: Props) => {
  const router = useRouter();

  return (
    <Card className="w-full max-w-md bg-white border rounded-lg shadow-md sm:max-w-sm lg:max-w-lg">
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center">
          <Image
            src="/assets/images/weth.webp"
            alt="USDC"
            width={40}
            height={40}
            className="rounded-full"
          />
          <Image
            src="/assets/images/reth.webp"
            alt="ETH"
            width={40}
            height={40}
            className="rounded-full ml-2"
          />
        </div>
        <span className="text-sm text-gray-500 font-medium">{network}</span>
      </CardHeader>

      <CardContent>
        <CardTitle className="text-lg font-semibold">
          {token0} / {token1} vault
        </CardTitle>

        <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <span className="block font-bold text-gray-900">{tvl}</span>
            <span>TVL</span>
          </div>
          <div>
            <span className="block font-bold text-gray-900">{return30d}</span>
            <span>Return vs holding 30D</span>
          </div>
          <div>
            <span className="block font-bold text-gray-900">{volume30d}</span>
            <span>Volume 30D</span>
          </div>
          <div>
            <span className="block font-bold text-gray-900">
              {dailyVolumeTvl}
            </span>
            <span>Daily volume/TVL</span>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          onClick={() => router.push(`/vault/${vaultAddress}`)}
          className="w-full text-white bg-gray-900 hover:bg-gray-700"
          data-testid="go-to-vault"
        >
          GO TO VAULT &gt;
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VaultCard;
