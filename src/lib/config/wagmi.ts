import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { arbitrum } from "wagmi/chains";

export const wagmiConfig = getDefaultConfig({
  appName: "Arrakis Vault",
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID ?? "",
  chains: [arbitrum],
  ssr: true,
});
