import Image from "next/image";
import React from "react";

const ProfileDisplay = ({ imageSrc }: { imageSrc: string }) => {
  return (
    <div className="flex p-2 rounded-full items-center justify-center border-2 border-green-500 hover:scale-105 transition-transform cursor-pointer">
      <Image src={imageSrc} alt="Profile" width={40} height={40} />
    </div>
  );
};

export default ProfileDisplay;
