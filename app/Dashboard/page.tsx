"use client";
import Header from "../Header/page";
import { useState } from "react";
import { useRef } from "react";

const Dashboard = () => {
  const [circulateButton, setCirculateButton] = useState(true);
  const handleCirculateButton = () => {
    setEmailButton(false);
    setCirculateButton(true);
  };
  const [emailButton, setEmailButton] = useState(false);
  const handleEmailButton = () => {
    setCirculateButton(false);
    setEmailButton(true);
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File>();
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const uploadFile = async () => {
    try {
      if (!file) {
        alert("No file selected");
        return;
      }

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
    } catch (e) {
      console.log(e);
      setUploading(false);
      alert("Trouble uploading file");
    }
  };

  const [hash, setHash] = useState("");
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    const arrayBuffer = await file.arrayBuffer();

    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);

    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
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

    console.log("SHA-256 hash of uploaded PDF:", hashHex);
  };

  return (
    <>
      <Header />
      <div className="border border-1 border-gray-300 mb-2"></div>
      <div className="w-11/12 m-auto">
        <div className="text-center text-2xl">
          Vivekananda Institute of Professional Studies - Technical Campus
        </div>
        <div className="flex mt-10 justify-center gap-5">
          <button
            className={`font-bold text-red-500 px-3 py-1 rounded-md outline-red-400 outline-2 hover:cursor-pointer focus:outline-2 focus:outline-offset-2 focus:outline-red-500 ${
              circulateButton ? "bg-red-400 text-white" : "bg-white text-black"
            } transition`}
            onClick={handleCirculateButton}
          >
            Circulate a Notice
          </button>
          <button
            className={`font-bold text-red-500 px-3 py-1 rounded-md outline-red-400 outline-2 hover:cursor-pointer focus:outline-2 focus:outline-offset-2 focus:outline-red-500 ${
              emailButton ? "bg-red-400 text-white" : "bg-white text-black"
            } transition`}
            onClick={handleEmailButton}
          >
            Send an Email
          </button>
        </div>
        {circulateButton ? (
          <>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
            ></input>
            <div className="w-9/10 m-auto h-[500px] border border-1 border-red-100 shadow-lg rounded-lg mt-5">
              <div className="px-3 py-2 text-center text-lg font-bold">
                Circulate Notice
              </div>
              <div
                onClick={() => {
                  fileInputRef.current?.click();
                }}
                className="font-semibold text-lg border-2 border-dashed border-red-200 text-red-800 rounded-md w-[400px] h-[200px] bg-red-50 m-auto flex flex-col justify-center items-center hover:cursor-pointer"
              >
                {file ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="40px"
                      viewBox="0 -960 960 960"
                      width="40px"
                      fill="#992B15"
                    >
                      <path d="M240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z" />
                    </svg>
                    {file.name}
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="40px    "
                      viewBox="0 -960 960 960"
                      width="40px  "
                      fill="#992B15"
                    >
                      <path d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
                    </svg>

                    <div>Select a File</div>
                  </>
                )}
              </div>
              <div>
                <button
                  onClick={uploadFile}
                  className={`flex justify-center items-center px-3 py-1 rounded-md bg-red-400 text-white font-bold mt-2 w-fit m-auto hover:bg-red-500 transition ${
                    uploading
                      ? "opacity-50 hover:cursor-not-allowed"
                      : "hover:cursor-pointer"
                  }`}
                >
                  {uploading ? "Uploading" : "Upload"}
                </button>
              </div>
              {url && (
                <object
                  className="pdf"
                  data={url}
                  width="800"
                  height="500"
                ></object>
              )}

              <div className="w-95/100 mt-3 m-auto">
                <label>
                  <strong>Hash of the File</strong>
                </label>
                <br></br>
                <input
                  disabled
                  className="rounded-md border-1 outline-red-400 outline-offset-1 px-3 py-1 border-red-400 w-full hover:cursor-not-allowed"
                  value={hash}
                ></input>
              </div>
              <div className="w-95/100 mt-3 m-auto">
                <label>
                  <strong>CID</strong>
                </label>
                <br></br>
                <input className="rounded-md border-1 outline-red-400 outline-offset-1 px-3 py-1 border-red-400 w-full"></input>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="w-9/10 m-auto h-[500px] border border-1 border-red-100 shadow-lg rounded-lg mt-5">
              <div className="px-3 py-2 text-center text-lg font-bold">
                Send Mail
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Dashboard;
