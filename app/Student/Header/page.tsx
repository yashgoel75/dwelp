"use client"

import Image from "next/image"
import logo from "@/app/assets/dwelpVips.png"
const Header = () => {
    return (
        <>
            <div className="flex justify-center items-center"><Image src={logo} height={110} alt="Dwelp. x VIPS"></Image></div>
        </>
    )
}

export default Header