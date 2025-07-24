"use client";
import Header from "../Header/page";
import { useState, useRef, useEffect } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { dwelpAbi } from "../constants/dwelpAbi";
import { usePublicClientByChain } from "@/utils/viemConfig";
import Footer from "../Footer/page";
import { useTheme } from "../context/theme";
import { useChainId } from "wagmi";

const Dashboard = () => {
  const publicClient = usePublicClientByChain();
  const chainId = useChainId();

  useEffect(() => {
    console.log("Current Chain ID:", chainId);
  }, [chainId]);
  const { theme } = useTheme();
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const DWELP_ADDRESS_POLYGONAMOY =
    "0x82f7af6b80b556bf98a1ff0859d9fb2581633235";
  const DWELP_ADDRESS_SEPOLIA = "0x71c13b050790d8d37cf9a867d62ef32e407dca33";

  const [DWELP_ADDRESS, setDWELP_ADDRESS] = useState("");
  const [isSepoliaDisclaimer, setIsSepoliaDisclaimer] = useState(true);

  useEffect(() => {
    if (chainId === 80002) {
      setDWELP_ADDRESS(DWELP_ADDRESS_POLYGONAMOY);
      console.log(DWELP_ADDRESS);
    } else {
      setDWELP_ADDRESS(DWELP_ADDRESS_SEPOLIA);
      setIsSepoliaDisclaimer(true);
      console.log("DWELP ADDRESS: ", DWELP_ADDRESS);
    }
  }, [chainId]);

  const [circulateButton, setCirculateButton] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File>();
  const [fileName, setFileName] = useState("");
  const [hashLoading, setHashLoading] = useState(false);
  const [hash, setHash] = useState("");
  const [signLoading, setSignLoading] = useState(false);
  const [signature, setSignature] = useState("");
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState("");
  const [isWriteContractPending, setIsWriteContractPending] = useState(false);
  const [isWriteContractSuccess, setIsWriteContractSuccess] = useState(false);
  const [isWriteContractError, setIsWriteContractError] = useState(false);

  const handleCirculateButton = () => {
    setCirculateButton(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(undefined);
    setFileName("");
    setHash("");
    setSignature("");
    setSignLoading(false);
    setHashLoading(false);
    setUrl("");
    setIsWriteContractError(false);
    setIsWriteContractPending(false);
    setIsWriteContractSuccess(false);

    const files = e.target.files;

    if (!files || files.length === 0) return;
    const file = files[0];
    if (file.size > 25 * 1024 * 1024) {
      alert("File size exceeds 25 MB limit");
      return;
    }
    if (!file.name.endsWith(".pdf")) {
      alert("Please upload a PDF file");
      return;
    }
    console.log("File: ", file);
    setFile(file);
    setHashLoading(true);
    setSignLoading(true);
    setUrl("");

    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex =
      "0x" + hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    setHash(hashHex);

    const res = await fetch("/api/sign-hash", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ hash: hashHex }),
    });

    const data = await res.json();
    console.log("Signature (base64):", data.signature);
    setSignature(data.signature);
    console.log("SHA-256 hash of uploaded PDF:", hashHex);
  };

  const uploadFile = async () => {
    try {
      if (!file) {
        alert("No file selected");
        return;
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
      const writeContractHash = await writeContractAsync({
        address: DWELP_ADDRESS as `0x${string}`,
        abi: dwelpAbi,
        functionName: "addFile",
        args: [hash, fileName, signature, signedUrl],
        account: address,
        chainId: chainId,
      });

      console.log("Transaction hash:", writeContractHash);
      setIsWriteContractSuccess(false);
      setIsWriteContractError(false);
      setIsWriteContractPending(true);
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: writeContractHash,
      });
      console.log(receipt);
      if (receipt.status === "success") {
        setIsWriteContractError(false);
        setIsWriteContractPending(false);
        setIsWriteContractSuccess(true);
      } else if (receipt.status === "reverted") {
        setIsWriteContractPending(false);
        setIsWriteContractSuccess(false);
        setIsWriteContractError(true);
      }
    } catch (e) {
      console.log(e);
      setUploading(false);
      console.log("Trouble uploading file");
    }
  };

  const handleFileUrl = () => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  return (
    <>
      <div
        className={`w-full ${
          theme === "dark" ? "bg-gray-800 text-white" : null
        } transition`}
      >
        <div className="sticky left-0 top-0 z-10 backdrop-blur-md">
          <Header />
          <div className="border border-1 border-gray-300 mb-2"></div>
        </div>

        {chainId != 80002 && isSepoliaDisclaimer ? (
          <div
            className={`${
              theme === "dark"
                ? "text-red-800 bg-white"
                : "text-red-500 bg-amber-100"
            } flex justify-center m-auto rounded-md px-5 py-1 text-sm md:text-base text-center w-95/100 md:w-fit transition`}
          >
            <div>
              You&apos;re currently on the Sepolia Testnet. For lower gas fees
              and faster transactions, consider switching to Polygon Amoy.
            </div>
            <div
              className={`${
                theme === "dark" ? "bg-red-800" : "bg-red-400"
              } rounded-full flex justify-center items-center ml-5 hover:cursor-pointer w-[24px] h-[24px] transition`}
              onClick={() => setIsSepoliaDisclaimer(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#ffffff"
              >
                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
              </svg>
            </div>
          </div>
        ) : null}
        <div className="w-11/12 m-auto">
          <div className="text-center text-2xl mt-5">
            <strong>Dwelp. University</strong>
          </div>
          <div className="flex mt-8 justify-center gap-5">
            <button
              className={`${
                theme === "dark"
                  ? "bg-red-800 outline-red-800 text-white focus:outline-red-500"
                  : "bg-red-400 outline-red-400 text-white focus:outline-red-500"
              } font-bold text-red-500 px-3 py-1 rounded-md outline-2 hover:cursor-pointer focus:outline-2 focus:outline-offset-2 transition`}
              onClick={() => handleCirculateButton}
            >
              Circulate a Notice
            </button>
            {/* <button
              className={`font-bold text-red-500 px-3 py-1 rounded-md outline-red-400 outline-2 hover:cursor-pointer focus:outline-2 focus:outline-offset-2 focus:outline-red-500 ${
                emailButton ? "bg-red-400 text-white" : "bg-white text-black"
              } transition`}
              onClick={handleEmailButton}
            >
              Send an Email
            </button> */}
          </div>
          {circulateButton ? (
            <>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
              ></input>
              <div
                className={`sm:w-98/100 md:w-9/10 m-auto ${
                  theme === "dark"
                    ? "bg-gray-900 text-white border-white-100"
                    : "border-red-100"
                } ${
                  isWriteContractError ||
                  isWriteContractPending ||
                  isWriteContractSuccess
                    ? "h-[705px]"
                    : "h-[670px]"
                } mb-7 border border-1 shadow-lg rounded-lg mt-5 transition`}
              >
                <div className="px-3 py-2 text-center text-lg font-bold">
                  Circulate Notice
                </div>
                <div
                  onClick={() => {
                    fileInputRef.current?.click();
                  }}
                  className={`${
                    theme === "dark"
                      ? "bg-gray-800 text-white border-white-200"
                      : "text-red-800 bg-red-50 border-red-200"
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
                        ? file.name.slice(0, 20) +
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
                        width="40px  "
                        fill={theme === "dark" ? "#ffffff" : "#992B15"}
                      >
                        <path d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
                      </svg>

                      <div>Select a File</div>
                    </>
                  )}
                </div>
                <div
                  className={`${
                    theme === "dark" ? "bg-gray-900 text-white" : null
                  } text-center mt-1 text-red-600 font-semibold font-[Poppins] transition`}
                >
                  Max file size: 25 MB
                </div>
                <div>
                  <button
                    onClick={uploadFile}
                    className={`${
                      theme === "dark"
                        ? "bg-red-800 outline-red-800 hover:bg-red-700"
                        : "bg-red-400 outline-red-400 hover:bg-red-500"
                    } flex justify-center items-center px-3 py-1 rounded-md text-white font-bold mt-2 w-fit m-auto transition ${
                      uploading
                        ? "opacity-50 hover:cursor-not-allowed"
                        : "hover:cursor-pointer"
                    }`}
                  >
                    {uploading ? "Uploading" : "Upload"}
                  </button>
                </div>

                <div className="w-95/100 mt-3 m-auto">
                  {isWriteContractPending ? (
                    <div className="flex justify-center items-center m-auto px-3 py-1 rounded-md bg-yellow-500 text-yellow-900 font-bold mb-2">
                      <svg
                        className="size-5 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill={theme === "dark" ? "#ffffff" : "#992B15"}
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
                      &nbsp; Uploading... Please Wait!
                    </div>
                  ) : null}
                  {isWriteContractSuccess ? (
                    <div className="flex justify-center items-center m-auto px-3 py-1 rounded-md bg-green-500 text-green-900 font-bold mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#314D1C"
                      >
                        <path d="m344-60-76-128-144-32 14-148-98-112 98-112-14-148 144-32 76-128 136 58 136-58 76 128 144 32-14 148 98 112-98 112 14 148-144 32-76 128-136-58-136 58Zm34-102 102-44 104 44 56-96 110-26-10-112 74-84-74-86 10-112-110-24-58-96-102 44-104-44-56 96-110 24 10 112-74 86 74 84-10 114 110 24 58 96Zm102-318Zm-42 142 226-226-56-58-170 170-86-84-56 56 142 142Z" />
                      </svg>
                      &nbsp; Upload Success
                    </div>
                  ) : null}
                  <label>
                    <strong>Notice</strong>
                  </label>
                  <br></br>
                  <div
                    className={`${
                      theme === "dark"
                        ? "bg-gray-900 text-white"
                        : "border-red-400 outline-red-400"
                    } flex justify-center items-center border-1 outline-offset-1 rounded-md transition`}
                  >
                    <input
                      placeholder="Semester 4 (Batch 2023-27) - Fee Notice (July 12, 2025)"
                      className="rounded-md outline-none outline-offset-1 px-3 py-1 border-red-400 w-full"
                      value={fileName}
                      onChange={(e) => {
                        setFileName(e.target.value);
                        console.log("File Name: ", fileName);
                      }}
                    />
                    <button
                      onClick={(e) => {
                        navigator.clipboard.writeText(hash);

                        const button = e.currentTarget;
                        const svg = button.querySelector("svg");

                        if (!svg) return;

                        svg.innerHTML = `
      <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
    `;

                        setTimeout(() => {
                          svg.innerHTML = `
        <path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 
        23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 
        33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 
        0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z" />
      `;
                        }, 2000);
                      }}
                      className="hover:scale-105 transition mr-1"
                      title="Copy to clipboard"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="20px"
                        viewBox="0 -960 960 960"
                        width="20px"
                        fill={theme === "dark" ? "#ffffff" : "#992B15"}
                      >
                        <path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z" />
                      </svg>
                    </button>
                  </div>
                  <div className="mt-3 m-auto">
                    <label>
                      <strong>Hash of the File</strong>
                    </label>
                    <br></br>
                    <div
                      className={`${
                        theme === "dark"
                          ? "bg-gray-900 text-white"
                          : "border-red-400 outline-red-400"
                      } flex justify-center items-center border-1 outline-offset-1 rounded-md transition`}
                    >
                      <input
                        readOnly
                        disabled
                        placeholder=""
                        className="rounded-md outline-none outline-offset-1 px-3 py-1 border-red-400 w-full"
                        value={hashLoading && !hash ? "Loading..." : hash}
                      />
                      <button
                        onClick={(e) => {
                          navigator.clipboard.writeText(hash);

                          const button = e.currentTarget;
                          const svg = button.querySelector("svg");

                          if (!svg) return;

                          svg.innerHTML = `
      <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
    `;

                          setTimeout(() => {
                            svg.innerHTML = `
        <path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 
        23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 
        33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 
        0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z" />
      `;
                          }, 2000);
                        }}
                        className="hover:scale-105 transition mr-1"
                        title="Copy to clipboard"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="20px"
                          viewBox="0 -960 960 960"
                          width="20px"
                          fill={theme === "dark" ? "#ffffff" : "#992B15"}
                        >
                          <path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="w-95/100 mt-3 m-auto">
                  <label>
                    <strong>Digital Signature of the File</strong>
                  </label>
                  <br></br>
                  <div
                    className={`${
                      theme === "dark"
                        ? "bg-gray-900 text-white"
                        : "border-red-400 outline-red-400"
                    } flex border-1 outline-offset-1 rounded-md transition`}
                  >
                    <input
                      readOnly
                      disabled
                      placeholder=""
                      className="rounded-md outline-none outline-offset-1 px-3 py-1 border-red-400 w-full"
                      value={
                        signLoading && !signature ? "Loading..." : signature
                      }
                    ></input>
                    <button
                      onClick={(e) => {
                        navigator.clipboard.writeText(signature);

                        const button = e.currentTarget;
                        const svg = button.querySelector("svg");

                        if (!svg) return;

                        svg.innerHTML = `
      <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
    `;

                        setTimeout(() => {
                          svg.innerHTML = `
        <path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 
        23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 
        33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 
        0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z" />
      `;
                        }, 2000);
                      }}
                      className="hover:scale-105 transition mr-1"
                      title="Copy to clipboard"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="20px"
                        viewBox="0 -960 960 960"
                        width="20px"
                        fill={theme === "dark" ? "#ffffff" : "#992B15"}
                      >
                        <path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="w-95/100 mt-3 m-auto">
                  <label>
                    <strong>IPFS URL of the File</strong>
                  </label>
                  <br></br>
                  <div
                    className={`${
                      theme === "dark"
                        ? "bg-gray-900 text-white"
                        : "border-red-400 outline-red-400"
                    } flex border-1 outline-offset-1 rounded-md transition`}
                  >
                    <input
                      readOnly
                      className="rounded-md outline-none outline-offset-1 px-3 py-1 border-red-400 w-full"
                      placeholder=""
                      value={url}
                    ></input>
                    <button
                      onClick={(e) => {
                        navigator.clipboard.writeText(url);

                        const button = e.currentTarget;
                        const svg = button.querySelector("svg");

                        if (!svg) return;

                        svg.innerHTML = `
      <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
    `;

                        setTimeout(() => {
                          svg.innerHTML = `
        <path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 
        23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 
        33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 
        0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z" />
      `;
                        }, 2000);
                      }}
                      className="hover:scale-105 transition mr-1"
                      title="Copy to clipboard"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="20px"
                        viewBox="0 -960 960 960"
                        width="20px"
                        fill={theme === "dark" ? "#ffffff" : "#992B15"}
                      >
                        <path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="w-95/100 m-auto mt-2">
                  <div
                    onClick={handleFileUrl}
                    className={`${
                      theme === "dark" ? "bg-red-800" : "bg-red-400"
                    } flex px-3 py-1 text-white rounded-md w-fit ${
                      url && !uploading
                        ? "hover:cursor-pointer"
                        : "opacity-50 disabled hover:cursor-not-allowed"
                    } transition`}
                  >
                    Go to the file
                  </div>
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
