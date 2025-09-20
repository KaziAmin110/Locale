'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

export default function GoogleCallback() {
  const [status, setStatus] = useState('Processing...');
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
          setError(`Google OAuth error: ${error}`);
          setStatus('Authentication failed');
          return;
        }

        if (!code) {
          setError('No authorization code received');
          setStatus('Authentication failed');
          return;
        }

        setStatus('Exchanging code for tokens...');

        // Send code to backend
        const response = await fetch('http://localhost:5002/api/auth/google-callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: code,
            redirect_uri: 'http://localhost:3000/auth/google/callback'
          }),
        });

        const data = await response.json();

        if (data.success) {
          // Store token and user data
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          
          setStatus('Authentication successful!');
          
          // Redirect based on onboarding status
          setTimeout(() => {
            if (data.needs_onboarding) {
              router.push('/onboarding');
            } else {
              router.push('/dashboard');
            }
          }, 1500);
        } else {
          setError(data.error || 'Authentication failed');
          setStatus('Authentication failed');
        }
      } catch (err) {
        setError('Network error. Please try again.');
        setStatus('Authentication failed');
        console.error('Callback error:', err);
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-2xl font-bold">C</span>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <div className="mb-6">
            <Image
              src="/google.svg"
              alt="Google"
              width={48}
              height={48}
              className="mx-auto mb-4"
            />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {status}
          </h2>
          
          {error ? (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          ) : (
            <div className="flex items-center justify-center mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
          
          <p className="text-gray-600 mb-6">
            {error ? 'Please try again or use email/password login.' : 'Please wait while we complete your authentication...'}
          </p>
          
          {error && (
            <button
              onClick={() => router.push('/login')}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200"
            >
              Back to Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
