import Image from "next/image";
import React from "react";

const GoogleAuth = () => {
  return (
    <div className="flex items-center justify-center w-full max-w-[450px] border-2 border-b-4 border-gray-300 p-2 rounded-full my-4 hover:border-gray-400 cursor-pointer">
      <Image src="/google.svg" alt="Google" width={25} height={25} />
    </div>
  );
};

export default GoogleAuth;
