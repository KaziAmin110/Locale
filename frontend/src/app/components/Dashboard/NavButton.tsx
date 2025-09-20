import Image from "next/image";
import React from "react";

const NavButton = ({
  imageSrc,
  text,
  isSelected,
}: {
  imageSrc: string;
  text: string;
  isSelected?: boolean;
}) => {
  return (
    <button
      className={`flex items-center gap-2 p-2 text-black ${
        isSelected
          ? "underline font-semibold"
          : "text-gray-600 hover:text-gray-800"
      }`}
    >
      <Image src={imageSrc} alt={text} width={40} height={40} />
      <span>{text}</span>
    </button>
  );
};

export default NavButton;
