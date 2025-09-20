'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import LandingNavbar from './components/LandingNavbar';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <LandingNavbar user={user} onLogout={handleLogout} />

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="mb-8">
            <Image
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=400&fit=crop" 
              alt="Modern city skyline" 
              width={800} 
              height={400}
              className="rounded-2xl shadow-2xl mx-auto mb-8"
            />
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Find your perfect place
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover apartments, connect with roommates, and explore local spots. 
            All powered by intelligent recommendations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button 
              onClick={() => router.push('/onboarding')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Get Started
            </button>
            <button 
              onClick={() => router.push('/dashboard')}
              className="border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 px-8 py-4 rounded-xl text-lg font-medium transition-all duration-200"
            >
              Dashboard
            </button>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Image src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=64&h=64&fit=crop" alt="AI" width={32} height={32} className="rounded-lg" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Matching</h3>
              <p className="text-gray-600">AI-powered recommendations for apartments, roommates, and local spots</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Image src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=64&h=64&fit=crop" alt="Verified" width={32} height={32} className="rounded-lg" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Verified Listings</h3>
              <p className="text-gray-600">All apartments and spots are verified for accuracy and quality</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Image src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=64&h=64&fit=crop" alt="Community" width={32} height={32} className="rounded-lg" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Community Driven</h3>
              <p className="text-gray-600">Connect with like-minded people in your area</p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="border-t border-gray-200 pt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How it works</h2>
            <p className="text-lg text-gray-600">Simple steps to find your perfect match</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-gray-900">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Create Profile</h3>
              <p className="text-gray-600">Tell us about your preferences, budget, and lifestyle</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-gray-900">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Matches</h3>
              <p className="text-gray-600">Our AI finds the best apartments, roommates, and spots for you</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-gray-900">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect</h3>
              <p className="text-gray-600">Message matches and arrange viewings or meetups</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>Frontend: Next.js 15.5.3 | Backend: Flask + Supabase | ML: Scikit-learn</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

