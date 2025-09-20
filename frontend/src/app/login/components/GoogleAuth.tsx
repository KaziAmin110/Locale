'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function GoogleAuth() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      // Get Google OAuth URL from backend
      const response = await fetch('http://localhost:5002/api/auth/google-auth-url?redirect_uri=http://localhost:3000');
      const data = await response.json();
      
      if (data.success) {
        // Redirect to Google OAuth
        window.location.href = data.auth_url;
      } else {
        console.error('Failed to get Google auth URL:', data.error);
        alert('Failed to initiate Google authentication');
      }
    } catch (error) {
      console.error('Google OAuth error:', error);
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleGoogleAuth}
      disabled={loading}
      className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
    >
      <Image
        src="/google.svg"
        alt="Google"
        width={20}
        height={20}
        className="mr-3"
      />
      <span className="text-sm font-medium text-gray-700">
        {loading ? 'Redirecting...' : 'Continue with Google'}
      </span>
    </button>
  );
}
