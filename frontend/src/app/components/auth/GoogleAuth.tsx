"use client";
import Image from "next/image";
import React from "react";
import { ApiService } from "../../../lib/api";

const GoogleAuth = () => {
  const handleGoogleAuth = async () => {
    try {
      // Get the Google auth URL from backend
      const response = await fetch('http://localhost:5003/api/auth/google-auth-url?redirect_uri=http://localhost:3000/auth/callback');
      const data = await response.json();
      
      if (data.success) {
        // Redirect to Google OAuth
        window.location.href = data.auth_url;
      } else {
        console.error('Failed to get Google auth URL:', data.error);
        alert('Failed to initiate Google authentication');
      }
    } catch (error) {
      console.error('Google auth error:', error);
      alert('Failed to initiate Google authentication');
    }
  };

  return (
    <button 
      onClick={handleGoogleAuth}
      className="flex items-center justify-center w-full border border-gray-300 hover:border-gray-400 p-3 rounded-xl transition-colors bg-white hover:bg-gray-50"
    >
      <Image src="/google.svg" alt="Google" width={20} height={20} className="mr-3" />
      <span className="font-medium text-gray-700">Continue with Google</span>
    </button>
  );
};

export default GoogleAuth;