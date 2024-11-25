import React from "react";
import Logo from "../Logo";
import WalletConnectButton from "../WalletConnectButton";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-[#FF8C00] shadow-md">
      <Logo />
      <WalletConnectButton />
    </nav>
  );
};

export default Navbar;
