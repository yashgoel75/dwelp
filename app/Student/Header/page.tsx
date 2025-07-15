"use client"

import Image from "next/image"
import logo from "@/app/assets/dwelpLogo.png"
const Header = () => {
    return (
        <>
            <div className="flex justify-center items-center"><Image className="px-7 py-2" src={logo} height={110} alt="Dwelp. x VIPS"></Image></div>
        </>
    )
}

export default Header