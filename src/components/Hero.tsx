"use client";

import Image from "next/image";
import WalletConnectButton from "./WalletConnectButton";
import { useAccount } from "wagmi";

const Hero = () => {
  const account = useAccount();

  return (
    <section className="py-5 md:py-10 px-5 md:px-10">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 ">
        <div className="flex flex-col justify-center gap-8">
          <h1 className="h1-bold">MEV-Aware Market Making</h1>
          <p className="p-regular-20 md:p-regular-24">
            Make liquidity provision more scalable and efficient than ever
          </p>
          {!account.isConnected && <WalletConnectButton />}
        </div>

        <Image
          src="/assets/images/hero.png"
          alt="hero"
          width={1000}
          height={1000}
          className="max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]"
        />
      </div>
    </section>
  );
};

export default Hero;
