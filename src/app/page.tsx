import Hero from "@/components/Hero";
import VaultCard from "@/components/VaultCard";
import { VaultCardData } from "@/types";
import { Network, TokenSymbol } from "@/types/enums";

export default function Home() {
  const vaults: VaultCardData[] = [
    {
      vaultAddress: "0x4ca9fb1f302b6bd8421bad9debd22198eb6ab723",
      token0: TokenSymbol.WETH,
      token1: TokenSymbol.rETH,
      network: Network.Arbitrum,
      tvl: "$5.27M",
      volume30d: "$61.83M",
      return30d: "-1.79%",
      dailyVolumeTvl: "0.51",
    },
  ];

  return (
    <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start mb-auto">
      <Hero />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-5 py-10 w-full">
        {vaults.map((vault) => (
          <VaultCard key={vault.vaultAddress} {...vault} />
        ))}
      </div>
    </main>
  );
}
