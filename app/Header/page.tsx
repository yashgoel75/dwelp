"use client";

import Image from "next/image";
import logo from "@/app/assets/dwelpLogo.png";
import { dwelpContractConfig } from "../constants/dwelpConfig";
import { useReadContract, useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Header = () => {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const DWELP_ADDRESS = "0x46bfeE41540a0a88030FCbc7287563BBFbEF8a7d";
  const { data: admin, isFetched } = useReadContract({
    ...dwelpContractConfig,
    functionName: "admin",
    args: [],
  });

  const [isAdmin, setIsAdmin] = useState(false);
  console.log("Admin is: ", admin);
  console.log("Address is: ", address);
  useEffect(() => {
    if (isFetched && isConnected && admin && address) {
      setIsAdmin(admin === address);
    }
  }, [admin, address, isFetched, isConnected]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!address || !isAdmin) {
        router.push("/");
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [address, isAdmin]);

  return (
    <>
      <div className="flex justify-between w-9/10 m-auto items-center">
        <Image src={logo} height={110} className="px-7 py-2" alt="dwelp."></Image>
        <div className="flex gap-4">
          <div
            onClick={() => {
              router.push("/Student/Dashboard");
            }}
            className="px-3 py-2 rounded-lg shadow-lg bg-red-400 text-white font-bold hover:cursor-pointer hover:scale-105 transition"
          >
            Go to Student Dashboard
          </div>
          <ConnectButton chainStatus={"none"} accountStatus={"avatar"} />
        </div>
      </div>
    </>
  );
};

export default Header;
