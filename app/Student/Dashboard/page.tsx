"use client";

import Header from "../Header/page";
import { useState, useRef, useEffect } from "react";
import { useReadContract } from "wagmi";
import { dwelpAbi } from "@/app/constants/dwelpAbi";
import Footer from "@/app/Footer/page";
import { useTheme } from "@/app/context/theme";
import { useChainId } from "wagmi";
import { useAccount } from "wagmi";
const Dashboard = () => {
  const { address } = useAccount();
  const chainId = useChainId();
  const { theme } = useTheme();
  interface FileType {
    name: string;
    ipfs: string;
  }
  const [currentChainId, setCurrentChainId] = useState(80002);
  const DWELP_ADDRESS_POLYGONAMOY =
    "0x82f7af6b80b556bf98a1ff0859d9fb2581633235";
  const DWELP_ADDRESS_SEPOLIA = "0x71c13b050790d8d37cf9a867d62ef32e407dca33";
  const [DWELP_ADDRESS, setDWELP_ADDRESS] = useState("0x");
  const [chainIdToUse, setChainIdToUse] = useState(80002);
  console.log("wagmi's chain: ", chainId);
  useEffect(() => {
    if (address) {
      setChainIdToUse(chainId);
      if (chainId === 80002) {
        setDWELP_ADDRESS(DWELP_ADDRESS_POLYGONAMOY);
        console.log("DWELP_ADDRESS: ", DWELP_ADDRESS);
      } else {
        setDWELP_ADDRESS(DWELP_ADDRESS_SEPOLIA);
        console.log("DWELP_ADDRESS: ", DWELP_ADDRESS);
      }
    } else {
      setChainIdToUse(currentChainId);
      if (currentChainId === 80002) {
        setDWELP_ADDRESS(DWELP_ADDRESS_POLYGONAMOY);
        console.log("DWELP_ADDRESS: ", DWELP_ADDRESS);
      } else {
        setDWELP_ADDRESS(DWELP_ADDRESS_SEPOLIA);
        console.log("DWELP_ADDRESS: ", DWELP_ADDRESS);
      }
    }
  }, [chainId, currentChainId]);

  const [viewNoticesButton, setViewNoticesButton] = useState(false);
  const [verifyCirculateButton, setVerifyCirculateButton] = useState(true);
  const [verifyEmailButton, setVerifyEmailButton] = useState(false);

  const handleViewNoticesButton = () => {
    setVerifyCirculateButton(false);
    setVerifyEmailButton(false);
    setViewNoticesButton(true);
  };
  const handleVerifyCirculateButton = () => {
    setViewNoticesButton(false);
    setVerifyEmailButton(false);
    setVerifyCirculateButton(true);
  };
  const [isVerified, setIsVerified] = useState(false);
  const [isNotVerified, setIsNotVerified] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File>();
  const [hash, setHash] = useState("");
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsNotVerified(false);
    setIsVerified(false);
    setFile(undefined);
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    setFile(file);
    console.log(file);
    const arrayBuffer = await file.arrayBuffer();

    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);

    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex =
      "0x" + hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    console.log("Hash in Function: ", hashHex);
    setHash(hashHex);
  };
  console.log("Hash: ", hash);

  const { data: fileData, isLoading: isSignatureLoading } = useReadContract({
    abi: dwelpAbi,
    address: DWELP_ADDRESS as `0x${string}`,
    functionName: "getFile",
    args: [hash],
    chainId: chainIdToUse,
  });
  console.log("Chain Id To use: ", chainIdToUse);
  console.log("Result:", fileData);
  if (!isSignatureLoading && !fileData) {
    console.log("Verification Failed");
  }
  const signature = Array.isArray(fileData) ? fileData[0] : undefined;
  console.log("Signature:", signature);

  const verifyFile = async (hash: string) => {
    setHash(hash);
    const res = await fetch("/api/verify-hash", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ hash, signature }),
    });
    console.log("Signature:", signature);
    const result = await res.json();
    console.log("Signature valid?", result.valid);
    if (result.valid) {
      setIsVerified(true);
      setIsNotVerified(false);
    } else {
      setIsNotVerified(true);
      setIsVerified(false);
    }
  };

  const { data: files } = useReadContract({
    abi: dwelpAbi,
    address: DWELP_ADDRESS as `0x${string}`,
    functionName: "getFiles",
    chainId: chainIdToUse,
  }) as { data: FileType[] | undefined };
  console.log("Notice: ", files);

  useEffect(() => {
    if (files) {
      console.log("Notice: ", files);
    }
  }, [files]);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCurrentChainId = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const currentChain = e.target.value;
    console.log(currentChain);
    if (currentChain === "Polygon Amoy") {
      setCurrentChainId(80002);
    } else {
      setCurrentChainId(11155111);
    }
  };

  return (
    <>
      <div className={`${theme === "dark" ? "bg-gray-800 text-white" : null}`}>
        <div className="sticky left-0 top-0 z-10 backdrop-blur-md">
          <Header />
        </div>
        <div className="border border-1 border-gray-300 mb-2"></div>

        <div className="w-11/12 m-auto mt-3">
          <div className="text-center text-2xl mt-5">
            <strong>Dwelp. University</strong>
          </div>

          <div className="flex mt-8 justify-center gap-5">
            <button
              className={`font-bold px-3 py-1 rounded-md outline-2 hover:cursor-pointer focus:outline-2 focus:outline-offset-2 ${
                viewNoticesButton
                  ? theme === "dark"
                    ? "bg-red-800 text-white outline-red-800 focus:outline-red-800 text-red-800"
                    : "bg-red-400 text-white outline-red-400 focus:outline-red-500 text-red-500"
                  : theme === "dark"
                  ? "bg-white text-black"
                  : "outline-red-400 focus:outline-red-500 text-red-500"
              } transition`}
              onClick={handleViewNoticesButton}
            >
              View Notices
            </button>
            <button
              className={`font-bold px-3 py-1 rounded-md outline-2 hover:cursor-pointer focus:outline-2 focus:outline-offset-2 ${
                verifyCirculateButton
                  ? theme === "dark"
                    ? "bg-red-800 text-white outline-red-800 focus:outline-red-800 text-red-800"
                    : "bg-red-400 text-white outline-red-400 focus:outline-red-500 text-red-500"
                  : theme === "dark"
                  ? "bg-white text-black"
                  : "outline-red-400 focus:outline-red-500 text-red-500"
              } transition`}
              onClick={handleVerifyCirculateButton}
            >
              Verify a Notice
            </button>
            {/* <button
            className={`font-bold text-red-500 px-3 py-1 rounded-md outline-red-400 outline-2 hover:cursor-pointer focus:outline-2 focus:outline-offset-2 focus:outline-red-500 ${
              verifyEmailButton
                ? "bg-red-400 text-white"
                : "bg-white text-black"
            } transition`}
            onClick={handleVerifyEmailButton}
          >
            Verify an Email
          </button> */}
          </div>
          {viewNoticesButton ? (
            <>
              <div
                className={`${
                  theme === "dark" ? "bg-gray-900" : null
                } sm:w-98/100 md:w-9/10 m-auto h-fit min-h-[500px] mb-7 pb-7 border border-1 border-red-100 shadow-lg rounded-lg mt-5 px-3`}
              >
                <div className="px-3 py-2 text-center text-lg font-bold">
                  Notices
                </div>
                {!address ? (
                  <div className="m-auto flex justify-end mb-2 mr-4">
                    <select
                      id="chainIdSelection"
                      onChange={handleCurrentChainId}
                    >
                      <option>Polygon Amoy</option>
                      <option>SepoliaETH</option>
                    </select>
                  </div>
                ) : null}
                <div>
                  {Array.isArray(files) && files.length > 0 ? (
                    <ul className="space-y-4">
                      {(Array.isArray(files) ? [...files].reverse() : []).map(
                        (file, index) => (
                          <li
                            key={index}
                            className={isMobile ? "px-1" : "px-4"}
                          >
                            <div className="flex w-full">
                              <div className="flex items-center md:w-90/100 text-lg wrap">
                                {file.name}
                              </div>
                              <div className="flex my-1 justify-end items-center 30/100 md:w-10/100">
                                <a
                                  href={`${file.ipfs}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`${
                                    theme === "dark"
                                      ? "bg-red-800"
                                      : "bg-red-400"
                                  } underline ml-2 shadow-md text-center px-3 py-1 rounded-md h-fit text-white font-bold hover:cursor-pointer hover:scale-105 transition`}
                                >
                                  <button className="hover:cursor-pointer">
                                    View
                                  </button>
                                </a>
                              </div>
                            </div>
                            <div className="border-1 rounded border-gray-100 mt-2"></div>
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <div className="m-auto flex justify-center items-center">
                      No notices found!
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : null}

          {verifyCirculateButton ? (
            <>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
              ></input>
              <div
                className={`${
                  theme === "dark" ? "bg-gray-900" : "bg-white"
                } sm:w-98/100 md:w-9/10 m-auto h-[500px] border border-1 border-red-100 shadow-lg mb-7 rounded-lg mt-5`}
              >
                <div className="px-3 py-2 text-center text-lg font-bold">
                  Verify Notice
                </div>
                <div
                  onClick={() => {
                    fileInputRef.current?.click();
                  }}
                  className={`${
                    theme === "dark"
                      ? "border-white-200 text-white bg-gray-800"
                      : "border-red-200 text-red-800 bg-red-50"
                  } font-semibold text-lg border-2 border-dashed rounded-md w-9/10 md:w-[400px] h-[200px] m-auto flex flex-col justify-center items-center hover:cursor-pointer`}
                >
                  {file ? (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="40px"
                        viewBox="0 -960 960 960"
                        width="40px"
                        fill={theme === "dark" ? "#ffffff" : "#992B15"}
                      >
                        <path d="M240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z" />
                      </svg>
                      {file.name.length > 30
                        ? file.name.slice(0, 20) +
                          "..." +
                          file.name.slice(file.name.length - 10)
                        : file.name}
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="40px    "
                        viewBox="0 -960 960 960"
                        width="40px  "
                        fill={theme === "dark" ? "#ffffff" : "#992B15"}
                      >
                        <path d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
                      </svg>

                      <div>Select a File</div>
                    </>
                  )}
                </div>
                <div>
                  <button
                    onClick={() => {
                      if (!hash) {
                        alert("Please upload a file first.");
                        return;
                      }
                      if (!signature || isSignatureLoading) {
                        setIsVerified(false);
                        setIsNotVerified(true);
                        return;
                      }
                      verifyFile(hash);
                    }}
                    className={`${
                      theme === "dark"
                        ? "outline-red-800 bg-red-800 text-white hover:bg-red-700"
                        : "outline-red-400 bg-red-400 text-white hover:bg-red-500"
                    } flex justify-center items-center px-3 py-1 rounded-md font-bold mt-2 w-fit m-auto hover:cursor-pointer transition`}
                  >
                    {"Verify"}
                  </button>
                </div>
                {isVerified ? (
                  <div
                    className={`flex justify-center items-center text-center m-auto px-3 py-1 rounded-md bg-green-600 text-white mt-3 text-center font-bold ${
                      isMobile
                        ? "w-9/10 text-sm"
                        : "w-[500px] text-lg text-center"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height={isMobile ? "20px" : "24px"}
                      viewBox="0 -960 960 960"
                      width={isMobile ? "20px" : "24px"}
                      fill="#ffffff"
                    >
                      <path d="m344-60-76-128-144-32 14-148-98-112 98-112-14-148 144-32 76-128 136 58 136-58 76 128 144 32-14 148 98 112-98 112 14 148-144 32-76 128-136-58-136 58Zm34-102 102-44 104 44 56-96 110-26-10-112 74-84-74-86 10-112-110-24-58-96-102 44-104-44-56 96-110 24 10 112-74 86 74 84-10 114 110 24 58 96Zm102-318Zm-42 142 226-226-56-58-170 170-86-84-56 56 142 142Z" />
                    </svg>
                    &nbsp;Verified by Dwelp
                  </div>
                ) : null}
                {isNotVerified ? (
                  <div
                    className={`flex justify-center text-center m-auto px-3 py-1 rounded-md bg-red-500 text-white mt-3 font-bold ${
                      isMobile
                        ? "w-9/10 text-sm"
                        : "items-center w-[500px] text-lg text-center"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height={isMobile ? "20px" : "24px"}
                      viewBox="0 -960 960 960"
                      width={isMobile ? "20px" : "24px"}
                      fill="#ffffff"
                    >
                      <path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                    </svg>
                    &nbsp;This document is not originally verified by Dwelp
                  </div>
                ) : null}
              </div>
            </>
          ) : null}
          {verifyEmailButton ? (
            <>
              <div className="w-9/10 m-auto h-[500px] mb-7 border border-1 border-red-100 shadow-lg rounded-lg mt-5">
                <div className="px-3 py-2 text-center text-lg font-bold">
                  Send Mail
                </div>
              </div>
            </>
          ) : null}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Dashboard;
