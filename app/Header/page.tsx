"use client";

import Image from "next/image";
import logo from "@/app/assets/dwelpLogo.png";
import vipsLogo from "@/app/assets/vipsLogo.png";
import { ConnectButton } from "@rainbow-me/rainbowkit";
const Header = () => {
  return (
    <>
      <div className="flex justify-between items-center gap-4 py-3 px-7">
        <Image className="my-1 px-4 rounded-[25px]" src={logo} height={110} alt="dwelp Logo"></Image>
        <ConnectButton label="Continue to Dwelp."/>
      </div>
    </>
  );
};

export default Header;
