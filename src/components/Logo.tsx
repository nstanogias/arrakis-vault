import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href="/">
      <div className="flex items-center justify-center md:justify-start">
        <Image
          src="/assets/icons/logo.svg"
          alt="Arrakis"
          width={40}
          height={40}
        />
        <span className="ml-3 text-xl font-bold text-white">Arrakis</span>
      </div>
    </Link>
  );
};

export default Logo;
