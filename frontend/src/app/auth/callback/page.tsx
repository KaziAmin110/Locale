'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GoogleCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the authorization code from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        if (error) {
          console.error('Google OAuth error:', error);
          router.push('/login?error=' + encodeURIComponent(error));
          return;
        }

        if (!code) {
          console.error('No authorization code received');
          router.push('/login?error=no_code');
          return;
        }

        // Send the code to backend for token exchange
        const response = await fetch('http://localhost:5002/api/auth/google-callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: code,
            redirect_uri: 'http://localhost:3000/auth/callback'
          }),
        });

        const data = await response.json();

        if (data.success) {
          // Store token and user data
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          
          // Redirect based on onboarding status
          if (data.needs_onboarding) {
            router.push('/onboarding');
          } else {
            router.push('/dashboard');
          }
        } else {
          console.error('Google callback error:', data.error);
          router.push('/login?error=' + encodeURIComponent(data.error));
        }
      } catch (err) {
        console.error('Callback error:', err);
        router.push('/login?error=network_error');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Completing Google Sign-In</h2>
        <p className="text-gray-600">Please wait while we authenticate your account...</p>
      </div>
    </div>
  );
}
