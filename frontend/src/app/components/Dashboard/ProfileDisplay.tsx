import Image from "next/image";
import React from "react";

const ProfileDisplay = ({ imageSrc }: { imageSrc: string }) => {
  return (
    <div className="hidden md:flex items-center justify-center border-2 border-gray-300 p-1 rounded-full hover:scale-105 transition-transform cursor-pointer">
      <Image
        src={imageSrc}
        alt="Profile"
        width={40}
        height={40}
        className="object-cover rounded-full"
      />
    </div>
  );
};

export default ProfileDisplay;
