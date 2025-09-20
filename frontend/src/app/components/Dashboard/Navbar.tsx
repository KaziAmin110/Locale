import Image from "next/image";
import NavButton from "./NavButton";
import ProfileDisplay from "./ProfileDisplay";

const Navbar = () => {
  return (
    <div className="flex justify-between items-center w-full px-6 py-4">
      <Image src={"/logo.svg"} alt="Logo" width={120} height={120} />

      <div className="flex items-center gap-6">
        <NavButton imageSrc="/homes.png" text="Homes" isSelected={true} />
        <NavButton imageSrc="/balloon.png" text="Experiences" />
        <NavButton imageSrc="/services.png" text="Services" />
      </div>

      <ProfileDisplay />
    </div>
  );
};

export default Navbar;
