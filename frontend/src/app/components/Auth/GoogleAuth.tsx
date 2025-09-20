'use client';

import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

const GoogleAuth = () => {
  const router = useRouter();

  const handleGoogleAuth = () => {
    // For demo purposes, just redirect to dashboard
    // In a real app, this would handle Google OAuth
    router.push('/dashboard');
  };

  return (
    <div 
      onClick={handleGoogleAuth}
      className="flex items-center justify-center w-full max-w-[450px] bg-white border border-gray-300 p-4 rounded-lg my-4 hover:border-gray-400 hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <Image src="/google.svg" alt="Google" width={20} height={20} />
      <span className="ml-3 text-gray-700 font-medium">Continue with Google</span>
    </div>
  );
};

export default GoogleAuth;
