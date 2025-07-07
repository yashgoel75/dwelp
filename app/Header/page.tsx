import Image from "next/image";
import logo from "@/app/assets/dwelpLogo.png";
import vipsLogo from "@/app/assets/vipsLogo.png";

const Header = () => {
    return (
        <>
            <div className="flex justify-center items-center gap-4 py-3">
                <Image src={logo} height={100} alt="dwelp Logo"></Image>
                <h2 className="text-3xl mr-3">X</h2>
                <Image src={vipsLogo} height={75} alt="VIPS Logo"></Image>
            </div>    
        </>
    )
}

export default Header;