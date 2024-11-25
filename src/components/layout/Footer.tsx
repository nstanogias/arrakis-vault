import React from "react";
import Image from "next/image";
import Logo from "../Logo";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-4 px-6">
      <Logo />
      <p className="text-center">
        Created by <span className="font-semibold">Nikolaos Stanogias</span>
      </p>
      <div className="flex justify-center mt-4 space-x-4">
        <a
          href="https://github.com/nstanogias"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/assets/icons/github.svg"
            alt="GitHub"
            width={24}
            height={24}
          />
        </a>
        <a
          href="https://www.linkedin.com/in/nikolaos-stanogias-7a359a50/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="/assets/icons/linkedin.svg"
            alt="LinkedIn"
            width={24}
            height={24}
          />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
