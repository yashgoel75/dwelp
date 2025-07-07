import Image from "next/image";
import Header from "./Header/page";

export default function Home() {
  return (
    <>
      <div className="min-h-screen">
        <div className="mb-3"><Header></Header></div>
        <div className="w-11/12 m-auto text-xl">Welcome to dwelp.</div>
      </div>
    </>
  );
}
