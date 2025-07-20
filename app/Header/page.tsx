"use client";

import Image from "next/image";
import logo from "@/app/assets/dwelpLogo.png";
import { dwelpContractConfig } from "../constants/dwelpConfig";
import { useReadContract, useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import favicon from "@/app/favicon.ico";

const Header = () => {
  const router = useRouter();
  const { address, isConnected } = useAccount();
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

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div
        className={`flex justify-between ${
          isMobile ? "w-95/100" : "w-9/10"
        } m-auto items-center`}
      >
        <Image
          src={isMobile ? favicon : logo}
          height={isMobile ? 70 : 110}
          className={`${isMobile ? "px-2" : "px-7"} py-2`}
          alt="dwelp."
        ></Image>
        <div className="flex gap-4">
          <div
            onClick={() => {
              router.push("/Student/Dashboard");
            }}
            className={`flex items-center ${
              isMobile ? "text-sm" : null
            } px-3 py-2 rounded-lg shadow-lg bg-red-400 text-white font-bold hover:cursor-pointer hover:scale-105 transition`}
          >
            {isMobile ? (
              <p>Student Dashboard</p>
            ) : (
              <p>Go to Student Dashboard</p>
            )}
          </div>
          <ConnectButton chainStatus={"none"} accountStatus={"avatar"} />
        </div>
      </div>
    </>
  );
};

export default Header;
