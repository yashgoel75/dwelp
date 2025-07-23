"use client";

import Image from "next/image";
import logo from "@/app/assets/dwelpLogo.png";
import { dwelpContractConfig } from "../constants/dwelpConfig";
import { useReadContract, useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import favicon from "@/app/favicon.ico";
import { useTheme } from "../context/theme";
import darkLogo from "@/app/assets/dwelpLogoDark.png";

const Header = () => {
  console.log("Current theme: ", useTheme().theme);
  const { theme, toggleTheme } = useTheme();
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
      <div className={`${theme === "dark" ? "bg-gray-900 text-white" : null}`}>
        <div
          className={`${
            theme === "dark" ? "bg-gray-900 text-white" : null
          } flex justify-between ${
            isMobile ? "w-95/100" : "w-9/10"
          } m-auto items-center`}
        >
          <Image
            src={isMobile ? favicon : theme === "dark" ? darkLogo : logo}
            height={isMobile ? 70 : 110}
            className={`${isMobile ? "px-2" : "px-7"} py-2`}
            alt="dwelp."
          ></Image>
          <div className="flex gap-4 items-center">
            <div
              onClick={() => {
                router.push("/Student/Dashboard");
              }}
              className={`flex items-center ${isMobile ? "text-sm" : null} ${
                theme === "dark" ? "bg-red-800" : "bg-red-400"
              } px-3 py-2 rounded-lg shadow-lg text-white font-bold hover:cursor-pointer hover:scale-105 transition`}
            >
              {isMobile ? (
                <p>Student Dash</p>
              ) : (
                <p>Go to Student Dashboard</p>
              )}
            </div>
            <div>
              <ConnectButton chainStatus={"none"} accountStatus={"avatar"} />
            </div>
            <div
              title={
                theme === "dark"
                  ? "Switch to Light Mode"
                  : "Switch to Dark Mode"
              }
            >
              <svg
                className={`${isMobile ? "mr-2" : "mr-7"}`}
                xmlns="http://www.w3.org/2000/svg"
                height="28px"
                viewBox="0 -960 960 960"
                width="28px"
                fill={theme === "dark" ? "#ffffff" : "#000000"}
                onClick={toggleTheme}
              >
                <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm40-83q119-15 199.5-104.5T800-480q0-123-80.5-212.5T520-797v634Z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
