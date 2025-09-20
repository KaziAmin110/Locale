'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function GoogleAuth() {
  const [loading, setLoading] = useState(false);

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      // Simulate Google OAuth - in real app, this would redirect to Google
      console.log('Google OAuth initiated');
      // For demo purposes, simulate success
      setTimeout(() => {
        setLoading(false);
        alert('Google OAuth would redirect to Google in production');
      }, 1000);
    } catch (error) {
      setLoading(false);
      console.error('Google OAuth error:', error);
    }
  };

  return (
    <button
      onClick={handleGoogleAuth}
      disabled={loading}
      className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
    >
      <Image
        src="https://developers.google.com/identity/images/g-logo.png"
        alt="Google"
        width={20}
        height={20}
        className="mr-3"
      />
      <span className="text-sm font-medium text-gray-700">
        {loading ? 'Signing in...' : 'Continue with Google'}
      </span>
    </button>
  );
}
