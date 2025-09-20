import Image from "next/image";
import React from "react";

const GoogleAuth = () => {
  return (
    <button className="flex items-center justify-center w-full border border-gray-300 hover:border-gray-400 p-3 rounded-xl transition-colors bg-white hover:bg-gray-50">
      <Image src="/google.svg" alt="Google" width={20} height={20} className="mr-3" />
      <span className="font-medium text-gray-700">Continue with Google</span>
    </button>
  );
};

export default GoogleAuth;