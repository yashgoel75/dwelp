"use client";

import Image from "next/image";
import logo from "@/app/assets/dwelpLogo.png";
import { dwelpContractConfig } from "../../constants/dwelpConfig";
import { useReadContract, useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import favicon from "@/app/favicon.ico";
import logoDark from "@/app/assets/dwelpLogoDark.png";
import { useTheme } from "@/app/context/theme";
import "./page.css";

const Header = () => {
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

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [showMobileNavigation, setIsShowNavigation] = useState(false);

  return (
    <>
      {showMobileNavigation ? (
        <div
          className={`${
            theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100"
          }`}
        >
          <div
            className={`${
              theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 "
            } navigationOnMobile ${
              showMobileNavigation ? "slide-down" : "slide-up"
            } rounded-b-xl shadow-lg w-95/100 flex flex-col pb-5`}
          >
            <div
              className={`${
                theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100"
              } flex justify-between ${
                isMobile ? "w-98/100" : "w-9/10"
              } m-auto items-center`}
            >
              <Image
                src={isMobile ? favicon : theme === "dark" ? logoDark : logo}
                height={isMobile ? 60 : 110}
                className={`${isMobile ? "px-2" : "px-7"} py-2`}
                alt="dwelp."
              ></Image>
              <div
                className="flex lg:hidden"
                onClick={() => setIsShowNavigation(false)}
              >
                <svg
                  className="mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill={theme === "dark" ? "#ffffff" : "#000000"}
                >
                  <path d="M256-213.85 213.85-256l224-224-224-224L256-746.15l224 224 224-224L746.15-704l-224 224 224 224L704-213.85l-224-224-224 224Z" />
                </svg>
              </div>
            </div>
            <div
              className={`${
                theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100"
              } w-95/100 flex flex-col gap-2`}
            >
              <div
                className="flex gap-2 items-center text-lg"
                onClick={() => {
                  router.push("/Dashboard");
                }}
              >
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill={theme === "dark" ? "#ffffff" : "#000000"}
                  >
                    <path d="M480-166.16 220-307.39v-216.92L81.54-600 480-816.92 878.46-600v287.69h-60v-254.46L740-524.31v216.92L480-166.16ZM480-452l273.62-148L480-748 206.38-600 480-452Zm0 217.54 200-108v-149.85L480-383.15 280-492.31v149.85l200 108ZM480-452Zm0 72.31Zm0 0Z" />
                  </svg>
                </div>
                <div>Go to Admin Dashboard</div>
              </div>
              <div className="flex gap-2 items-center text-lg">
                <div
                  onClick={() => {
                    router.push("/Dashboard");
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill={theme === "dark" ? "#ffffff" : "#000000"}
                  >
                    <path d="M480.07-100q-78.84 0-148.21-29.92t-120.68-81.21q-51.31-51.29-81.25-120.63Q100-401.1 100-479.93q0-78.84 29.92-148.21t81.21-120.68q51.29-51.31 120.63-81.25Q401.1-860 479.93-860q78.84 0 148.21 29.92t120.68 81.21q51.31 51.29 81.25 120.63Q860-558.9 860-480.07q0 78.84-29.92 148.21t-81.21 120.68q-51.29 51.31-120.63 81.25Q558.9-100 480.07-100ZM510-161.85q121.31-11.53 205.65-101.42Q800-353.15 800-480t-83.96-216.35q-83.96-89.5-206.04-101.8v636.3Z" />
                  </svg>
                </div>
                <div onClick={toggleTheme}>
                  {theme === "dark" ? (
                    <p>Switch to Light Mode</p>
                  ) : (
                    <p>Switch to Dark Mode</p>
                  )}
                </div>
              </div>
              <ConnectButton chainStatus="full" accountStatus="avatar" />
            </div>
          </div>
        </div>
      ) : null}
      <div className={`${theme === "dark" ? "bg-gray-900 text-white" : null}`}>
        {isFetched && isConnected && isAdmin ? (
          <>
            <div
              className={`${
                theme === "dark" ? "bg-gray-900 text-white" : null
              } flex justify-between w-98/100 md:w-9/10 m-auto items-center`}
            >
              <Image
                src={isMobile ? favicon : theme === "dark" ? logoDark : logo}
                height={isMobile ? 60 : 110}
                className={`${isMobile ? "px-2" : "px-7"} py-2`}
                alt="dwelp."
              ></Image>
              <div
                className="flex lg:hidden"
                onClick={() => setIsShowNavigation(true)}
              >
                <svg
                  className="mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill={theme === "dark" ? "#ffffff" : "#000000"}
                >
                  <path d="M140-254.62v-59.99h680v59.99H140ZM140-450v-60h680v60H140Zm0-195.39v-59.99h680v59.99H140Z" />
                </svg>
              </div>
              <div className="flex gap-4 items-center hidden lg:flex">
                <div
                  onClick={() => router.push("/Dashboard")}
                  className={`${isMobile ? "text-sm px-2" : "px-3"} ${
                    theme === "dark" ? "bg-red-800" : "bg-red-400"
                  } flex items-center py-2 rounded-lg shadow-lg text-white font-bold hover:cursor-pointer hover:scale-105 transition`}
                >
                  {isMobile ? (
                    <p>Admin Portal</p>
                  ) : (
                    <p>Go to Admin Dashboard</p>
                  )}
                </div>
                <div>
                  <ConnectButton
                    chainStatus={isMobile ? "icon" : "full"}
                    accountStatus="avatar"
                  />
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
                    height={isMobile ? "24px" : "28px"}
                    viewBox="0 -960 960 960"
                    width={isMobile ? "24px" : "28px"}
                    fill={theme === "dark" ? "#ffffff" : "#000000"}
                    onClick={toggleTheme}
                  >
                    <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm40-83q119-15 199.5-104.5T800-480q0-123-80.5-212.5T520-797v634Z" />
                  </svg>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex justify-between w-95/100 md:w-9/10 m-auto items-center">
            <div
              className={`${
                theme === "dark" ? "bg-gray-900 text-white" : null
              } flex justify-center items-center`}
            >
              <Image
                className="px-7 py-2"
                src={isMobile ? favicon : theme === "dark" ? logoDark : logo}
                height={isMobile ? 90 : 110}
                alt="dwelp logo"
              />
            </div>
            <div
              title={
                theme === "dark"
                  ? "Switch to Light Mode"
                  : "Switch to Dark Mode"
              }
            >
              <svg
                className="mr-7"
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
        )}
      </div>
    </>
  );
};

export default Header;
