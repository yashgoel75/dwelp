"use client"

import Image from "next/image";
import Header from "./Header/page";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
  return (
    <>
      <div className="min-h-screen">
        <div className="mb-1"><Header></Header></div>
        <div className="w-11/12 m-auto text-xl text-center">dwelp. <strong>x</strong> VIPS</div>
                <ConnectButton/>
      </div>
    </>
  );
}
