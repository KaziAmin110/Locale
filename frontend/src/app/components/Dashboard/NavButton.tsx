import Image from "next/image";
import React from "react";

const NavButton = ({
  imageSrc,
  text,
  isSelected,
  onClick,
}: {
  imageSrc: string;
  text: string;
  isSelected?: boolean;
  onClick?: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col md:flex-row items-center gap-2 p-2 text-black hover:cursor-pointer ${
        isSelected
          ? "border-b-3 border-green-600 font-semibold"
          : "text-gray-600 hover:text-gray-800 font-semibold  hover:scale-105 transition-transform duration-200"
      }`}
    >
      <Image src={imageSrc} alt={text} width={45} height={45} />
      <span>{text}</span>
    </button>
  );
};

export default NavButton;
