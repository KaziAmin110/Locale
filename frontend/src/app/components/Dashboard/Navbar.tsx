import Image from "next/image";
import NavButton from "./NavButton";
import ProfileDisplay from "./ProfileDisplay";

interface NavbarProps {
  activeTab: string;
  onTabChange: (tabName: string) => void;
}

const Navbar = ({ activeTab, onTabChange }: NavbarProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-center md:justify-between items-center w-full px-6 py-4">
      <Image src={"/logo.svg"} alt="Logo" width={120} height={120} />

      <div className="flex items-center justify-evenly flex-wrap flex-1 max-w-5xl">
        <NavButton
          imageSrc="/homes.png"
          text="Homes"
          isSelected={activeTab === "Homes"}
          onClick={() => onTabChange("Homes")}
        />
        <NavButton
          imageSrc="/balloon.png"
          text="Experiences"
          isSelected={activeTab === "Experiences"}
          onClick={() => onTabChange("Experiences")}
        />
        <NavButton
          imageSrc="/services.png"
          text="Services"
          isSelected={activeTab === "Services"}
          onClick={() => onTabChange("Services")}
        />
      </div>

      <ProfileDisplay imageSrc="/profile.jpg" />
    </div>
  );
};

export default Navbar;
