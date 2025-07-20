"use client";

import Image from "next/image";
import logo from "@/app/assets/dwelpLogo.png";
import { dwelpContractConfig } from "./constants/dwelpConfig";
import { useReadContract, useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
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
      if (isAdmin && isConnected && isFetched) {
        router.push("/Dashboard");
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, [isAdmin]);

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
      <div className="min-h-screen flex flex-col justify-center items-center">
        <Image
          src={logo}
          width={isMobile ? 250 : 400}
          alt="dwelp. x VIPS"
        ></Image>
        <div
          className={`${
            isMobile ? "flex flex-col gap-4" : "flex gap-6"
          } items-center justify-center`}
        >
          <div
            className={`flex justify-center rounded-lg shadow-lg ${
              isConnected ? null : "w-[180px] bg-[#f41919ff]"
            } text-white font-bold hover:cursor-pointer hover:scale-105 transition`}
          >
            <ConnectButton
              label="Continue as Admin"
              chainStatus={"icon"}
              accountStatus={"address"}
            />
          </div>
          <div
            onClick={() => {
              router.push("/Student/Dashboard");
            }}
            className="px-3 py-2 w-[180px] flex justify-center items-center rounded-lg shadow-lg bg-orange-500 text-white font-bold hover:cursor-pointer hover:scale-105 transition"
          >
            Continue as Student
          </div>
        </div>

        {isFetched &&
          isConnected &&
          (!isAdmin ? (
            <div
              className={`${
                isMobile ? "w-[250px] text-md" : "text-lg"
              } flex justify-center items-center mt-7 px-3 py-1 rounded-lg bg-red-500 text-white font-bold`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="22px"
                viewBox="0 -960 960 960"
                width="22px"
                fill="#ffffff"
              >
                <path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
              </svg>
              &nbsp;
              {isMobile ? (
                <p>Permission Aborted!</p>
              ) : (
                <p>
                  Permission Aborted! The connected wallet does not belong to
                  the Admin
                </p>
              )}
            </div>
          ) : (
            <>
              <div>
                <div
                  className={`${
                    isMobile ? "w-[250px] m-auto" : null
                  } flex justify-center items-center mt-7 px-3 py-1 rounded-md bg-green-600 text-white font-bold`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="22px"
                    viewBox="0 -960 960 960"
                    width="22px"
                    fill="#ffffff"
                  >
                    <path d="m344-60-76-128-144-32 14-148-98-112 98-112-14-148 144-32 76-128 136 58 136-58 76 128 144 32-14 148 98 112-98 112 14 148-144 32-76 128-136-58-136 58Zm34-102 102-44 104 44 56-96 110-26-10-112 74-84-74-86 10-112-110-24-58-96-102 44-104-44-56 96-110 24 10 112-74 86 74 84-10 114 110 24 58 96Zm102-318Zm-42 142 226-226-56-58-170 170-86-84-56 56 142 142Z" />
                  </svg>
                  &nbsp;Approved
                </div>
                <div
                  className={`${
                    isMobile ? "w-[250px] m-auto" : " w-[375px]"
                  } mt-4 flex justify-center items-center m-auto px-3 py-1 rounded-md bg-yellow-500 text-yellow-900 font-bold mb-2`}
                >
                  <svg
                    className="size-5 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#992B15"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="1"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4J4z"
                    ></path>
                  </svg>
                  &nbsp; Loading... Please Wait!
                </div>
              </div>
            </>
          ))}
      </div>
    </>
  );
}
