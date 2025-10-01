"use client";

import Header from "../Header/page";
import { useState, useRef, useEffect } from "react";
import { useReadContract } from "wagmi";
import { dwelpAbi } from "@/app/constants/dwelpAbi";
import Footer from "@/app/Footer/page";
import { useTheme } from "@/app/context/theme";
import { useChainId } from "wagmi";
import { useAccount } from "wagmi";
import { GoogleGenAI } from "@google/genai";
import "./page.css";

interface ProgressBarProps {
  file?: File;
  uploading: boolean;
  loading: boolean;
  response: string | null;
  theme: 'light' | 'dark';
}

const ProgressBar = ({ file, uploading, loading, response, theme }: ProgressBarProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
  });

  useEffect(() => {
    console.log("ProgressBar State:", {
      file: !!file,
      uploading,
      loading,
      response: !!response,
    });

    if (!file) {
      setCurrentStep(0);
    } else if (file && !uploading && !loading && !response) {
      setCurrentStep(1);
    } else if (uploading) {
      setCurrentStep(2);
    } else if (loading) {
      setCurrentStep(3);
    } else if (response && response.length > 0) {
      setCurrentStep(4);
    }
  }, [file, uploading, loading, response]);

  const steps = [
    {
      label: "Select File",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#ffffff"
        >
          <path d="M240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h360l200 200v520q0 33-23.5 56.5T720-80H240Zm0-80h480v-480H560v-160H240v640Zm240-40q67 0 113.5-47T640-360v-160h-80v160q0 33-23 56.5T480-280q-33 0-56.5-23.5T400-360v-220q0-9 6-14.5t14-5.5q9 0 14.5 5.5T440-580v220h80v-220q0-42-29-71t-71-29q-42 0-71 29t-29 71v220q0 66 47 113t113 47ZM240-800v160-160 640-640Z" />
        </svg>
      ),
    },
    {
      label: "File Uploaded",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#ffffff"
        >
          <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
        </svg>
      ),
    },
    {
      label: "Uploading to IPFS",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#ffffff"
        >
          <path d="M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H260Zm0-80h480q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-83-58.5-141.5T480-720q-83 0-141.5 58.5T280-520h-20q-58 0-99 41t-41 99q0 58 41 99t99 41Zm220-240Z" />
        </svg>
      ),
    },
    {
      label: "Extracting Content",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#ffffff"
        >
          <path d="M80-720v-200h200v80H160v120H80Zm720 0v-120H680v-80h200v200h-80ZM80-40v-200h80v120h120v80H80Zm600 0v-80h120v-120h80v200H680ZM280-240h400v-480H280v480Zm0 80q-33 0-56.5-23.5T200-240v-480q0-33 23.5-56.5T280-800h400q33 0 56.5 23.5T760-720v480q0 33-23.5 56.5T680-160H280Zm80-400h240v-80H360v80Zm0 120h240v-80H360v80Zm0 120h240v-80H360v80Zm-80 80v-480 480Z" />
        </svg>
      ),
    },
    {
      label: "Complete",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#ffffff"
        >
          <path d="m438-240 226-226-58-58-169 169-84-84-57 57 142 142ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 onest-normal">
      <div className="relative flex items-center justify-between mb-8 onest-normal">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col items-center flex-1 relative z-10"
          >
            <div
              className={`w-10 h-10 onest-normal rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                index < currentStep
                  ? theme === "dark"
                    ? "bg-green-600 text-white"
                    : "bg-green-500 text-white"
                  : index === currentStep
                  ? theme === "dark"
                    ? "bg-red-800 text-white animate-pulse"
                    : "bg-red-400 text-white animate-pulse"
                  : theme === "dark"
                  ? "bg-gray-700 text-gray-400"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              {index < currentStep ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#ffffff"
                >
                  <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                </svg>
              ) : (
                step.icon
              )}
            </div>

            <div
              className={`mt-2 text-xs md:text-sm font-medium text-center transition-all duration-300 onest-normal ${
                index <= currentStep
                  ? theme === "dark"
                    ? "text-white"
                    : "text-gray-800"
                  : "text-gray-400"
              }`}
            >
              {step.label}
            </div>
          </div>
        ))}

        <div
          className="absolute top-5 left-0 right-0 flex justify-between px-5 onest-normal"
          style={{ zIndex: 0 }}
        >
          {steps.slice(0, -1).map((_, index) => (
            <div
              key={index}
              className={`h-1 transition-all duration-300  onest-normal${
                index < currentStep
                  ? theme === "dark"
                    ? "bg-green-600"
                    : "bg-green-500"
                  : theme === "dark"
                  ? "bg-gray-700"
                  : "bg-gray-200"
              }`}
              style={{ width: "calc(100% / 4.2)" }}
            />
          ))}
        </div>
      </div>

      <div
        className={`w-full h-2 rounded-full overflow-hidden onest-normal ${
          theme === "dark" ? "bg-gray-700" : "bg-gray-200"
        }`}
      >
        <div
          className={`h-full transition-all duration-500 ease-out onest-normal ${
            theme === "dark" ? "bg-red-800" : "bg-red-400"
          }`}
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />
      </div>

      <div className="mt-4 text-center onest-normal">
        {currentStep === 0 && (
          <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
            Please select a file to begin
          </p>
        )}
        {currentStep === 1 && (
          <p className={theme === "dark" ? "text-white" : "text-gray-800"}>
            File ready for verification
          </p>
        )}
        {currentStep === 2 && (
          <p className={theme === "dark" ? "text-white" : "text-gray-800"}>
            Uploading file to IPFS...
          </p>
        )}
        {currentStep === 3 && (
          <p className={theme === "dark" ? "text-white" : "text-gray-800"}>
            Extracting content from PDF...
          </p>
        )}
        {currentStep === 4 && (
          <p className={theme === "dark" ? "text-green-400" : "text-green-600"}>
            Processing complete!
          </p>
        )}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [isNotVerified, setIsNotVerified] = useState(false);

  const { address } = useAccount();
  const chainId = useChainId();
  const { theme } = useTheme();
  interface FileType {
    name: string;
    ipfs: string;
  }
  const [currentChainId, setCurrentChainId] = useState(80002);
  const DWELP_ADDRESS_POLYGONAMOY =
    "0x604cD9d6B85E5b6139026DEfca10055da4F229e3";
  const DWELP_ADDRESS_SEPOLIA = "0x686ac3ebba672c0e6eb9835f3de35ae6075bd211";
  const [DWELP_ADDRESS, setDWELP_ADDRESS] = useState("0x");
  const [chainIdToUse, setChainIdToUse] = useState(80002);
  const [selectedChain, setSelectedChain] = useState("Polygon Amoy");

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
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File>();
  const [hash, setHash] = useState("");
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsNotVerified(false);
    setIsVerified(false);
    setFile(undefined);
    setResponse("");
    setUrl("");
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

  const [, setUrl] = useState<string | null>("");
  const [uploading, setUploading] = useState(false);

  const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY || "",
  });

  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);
  async function ocr(url: string) {
    const pdfResp = await fetch(url!.toString()).then((response) =>
      response.arrayBuffer()
    );

    const contents = [
      { text: "Extract the content as an OCR" },
      {
        inlineData: {
          mimeType: "application/pdf",
          data: Buffer.from(pdfResp).toString("base64"),
        },
      },
    ];
    setLoading(true);
    try {
      const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents,
      });
      const text = result.text;
      console.log("OCR Response:", text);
      setResponse(text || "");
      setLoading(false);
      return text;
    } catch (error) {
      console.error("OCR Error:", error);
      setLoading(false);
      setResponse("Error extracting content from PDF");
      return "";
    }
  }

  const uploadFile = async () => {
    try {
      if (!file) {
        alert("No file selected");
        return null;
      }
      setUrl("Uploading... Please Wait");
      setUploading(true);
      const data = new FormData();
      data.set("file", file);
      const uploadRequest = await fetch("/api/files", {
        method: "POST",
        body: data,
      });
      const signedUrl = await uploadRequest.json();
      console.log("CID is: ", signedUrl);
      setUrl(signedUrl);
      setUploading(false);
      console.log("URL: ", signedUrl);
      return signedUrl;
    } catch (error) {
      console.error("Upload failed:", error);
      setUploading(false);
      setUrl("Upload failed. Try again.");
      return null;
    }
  };

  const verifyFile = async (hash: string) => {
    try {
      setHash(hash);
      const res = await fetch("/api/verify-hash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hash, signature }),
      });

      const result = await res.json();

      if (result.valid) {
        setIsVerified(true);
        setIsNotVerified(false);
      } else {
        setIsVerified(false);
        setIsNotVerified(true);
      }

      const uploadedUrl = await uploadFile();
      if (uploadedUrl) {
        console.log("File uploaded successfully:", uploadedUrl);

        await ocr(uploadedUrl);
      }
    } catch (error) {
      console.error("Verification failed:", error);
      setIsVerified(false);
      setIsNotVerified(true);
      setLoading(false);
      setUploading(false);
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
    setSelectedChain(currentChain);
    console.log(currentChain);
    if (currentChain === "Polygon Amoy") {
      setCurrentChainId(80002);
    } else {
      setCurrentChainId(11155111);
    }
  };

  return (
    <>
      <div
        className={`${
          theme === "dark" ? "bg-gray-800 text-white" : null
        } transition`}
      >
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
          </div>
          {viewNoticesButton ? (
            <>
              <div
                className={`${
                  theme === "dark" ? "bg-gray-900" : null
                } sm:w-98/100 md:w-9/10 m-auto h-fit min-h-[500px] mb-7 pb-7 border border-1 border-red-100 shadow-lg rounded-lg mt-5 px-3 transition`}
              >
                <div className="px-3 py-2 text-center text-lg font-bold">
                  Notices
                </div>
                {!address ? (
                  <div
                    className={`${
                      theme === "dark" ? "bg-red-800" : "bg-red-400"
                    } m-auto flex justify-end mb-2 text-white px-2 py-1 w-fit rounded-md transition`}
                  >
                    <select
                      id="chainIdSelection"
                      value={selectedChain}
                      onChange={handleCurrentChainId}
                      className={`${
                        theme === "dark" ? "bg-red-800" : "bg-red-400"
                      } text-white outline-none border-none focus:ring-0 transition`}
                    >
                      <option>Polygon Amoy</option>
                      <option>SepoliaETH</option>
                    </select>
                  </div>
                ) : null}
                <div className="mt-2">
                  {Array.isArray(files) && files.length > 0 ? (
                    <ul className="space-y-4">
                      {(Array.isArray(files) ? [...files].reverse() : []).map(
                        (file, index) => (
                          <li
                            key={index}
                            className={isMobile ? "px-1" : "px-4"}
                          >
                            <div className="flex w-full">
                              <div
                                className={`${
                                  isMobile ? "text-base" : "text-lg"
                                } flex items-center w-70/100 md:w-90/100 wrap`}
                              >
                                {file.name}
                              </div>
                              <div className="flex my-1 justify-end items-center w-30/100 md:w-10/100">
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
                } sm:w-98/100 md:w-9/10 m-auto min-h-[500px] border border-1 border-red-100 shadow-lg mb-7 rounded-lg mt-5 pb-7 transition`}
              >
                <div className="px-3 py-2 text-center text-lg font-bold">
                  Verify Notice
                </div>
                {!address ? (
                  <div
                    className={`${
                      theme === "dark" ? "bg-red-800" : "bg-red-400"
                    } m-auto flex justify-end mb-2 text-white px-2 py-1 w-fit rounded-md transition`}
                  >
                    <select
                      id="chainIdSelection"
                      value={selectedChain}
                      onChange={handleCurrentChainId}
                      className={`${
                        theme === "dark" ? "bg-red-800" : "bg-red-400"
                      } text-white outline-none border-none focus:ring-0 transition`}
                    >
                      <option>Polygon Amoy</option>
                      <option>SepoliaETH</option>
                    </select>
                  </div>
                ) : null}

                <div
                  onClick={() => {
                    fileInputRef.current?.click();
                  }}
                  className={`${
                    theme === "dark"
                      ? "border-white-200 text-white bg-gray-800"
                      : "border-red-200 text-red-800 bg-red-50"
                  } font-semibold text-lg border-2 border-dashed rounded-md w-9/10 md:w-[400px] h-[200px] m-auto flex flex-col justify-center items-center hover:cursor-pointer transition`}
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
                        ? file.name.slice(0, 18) +
                          "..." +
                          file.name.slice(file.name.length - 10)
                        : file.name}
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="40px"
                        viewBox="0 -960 960 960"
                        width="40px"
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
                      verifyFile(hash);
                    }}
                    className={`${
                      theme === "dark"
                        ? "outline-red-800 bg-red-800 text-white hover:bg-red-700"
                        : "outline-red-400 bg-red-400 text-white hover:bg-red-500"
                    } flex justify-center items-center px-3 py-1 rounded-md font-bold mt-2 w-fit m-auto hover:cursor-pointer transition`}
                  >
                    {uploading ? "Uploading" : "Verify"}
                  </button>
                </div>

                {response && isVerified ? (
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
                {response && isNotVerified ? (
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

                {file && (
                  <ProgressBar
                    file={file}
                    uploading={uploading}
                    loading={loading}
                    response={response}
                    theme={theme === "dark" ? "dark" : "light"}
                  />
                )}

                {response && response.length > 0 ? (
                  <div
                    className={`mt-6 mx-4 p-6 rounded-lg shadow-md onest-normal ${
                      theme === "dark"
                        ? "bg-gray-800 border border-gray-300"
                        : "bg-white border border-red-100"
                    }`}
                  >
                    <div className="flex items-center mb-3">
                      <h3
                        className={`font-bold text-xl ${
                          theme === "dark" ? "text-white" : "text-red-500"
                        }`}
                      >
                        Extracted Content Summary
                      </h3>
                    </div>
                    <div
                      className={`text-base leading-relaxed whitespace-pre-wrap ${
                        theme === "dark" ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      {response}
                    </div>
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
