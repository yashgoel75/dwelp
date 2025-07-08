import Image from "next/image";
import logo from "@/app/assets/dwelpLogo.png";
import vipsLogo from "@/app/assets/vipsLogo.png";

const Header = () => {
  return (
    <>
      <div className="flex justify-center items-center gap-4 py-3">
        <Image className="my-1 px-4 rounded-[25px]" src={logo} height={110} alt="dwelp Logo"></Image>
      </div>
    </>
  );
};

export default Header;
