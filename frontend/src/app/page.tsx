'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center mr-3">
                <span className="text-white text-lg font-bold">C</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">CityMate</h1>
            </div>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">Welcome, {user.name || user.email}</span>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-900 px-4 py-2 font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/login')}
                  className="text-gray-600 hover:text-gray-900 px-4 py-2 font-medium transition-colors"
                >
                  Sign in
                </button>
                <button
                  onClick={() => router.push('/onboarding')}
                  className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Get started
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Find Your Perfect
              <span className="block text-gray-600">City Match</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover apartments, meet amazing people, and explore local spots in your city. 
              Swipe your way to the perfect urban lifestyle.
            </p>
            
            {!user && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push('/onboarding')}
                  className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Start Swiping
                </button>
                <button
                  onClick={() => router.push('/login')}
                  className="bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg border-2 border-gray-200 transition-all duration-300 transform hover:scale-105"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600">
              Three ways to discover your perfect city experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Apartments */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">🏠</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Apartments</h3>
              <p className="text-gray-600 mb-6">
                Find your dream apartment with personalized recommendations based on your budget, 
                location preferences, and lifestyle.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                  Smart matching algorithm
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                  Real-time availability
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                  High-quality photos
                </div>
              </div>
            </div>

            {/* People */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">👥</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">People</h3>
              <p className="text-gray-600 mb-6">
                Connect with like-minded people in your city. Find roommates, friends, 
                or even your next adventure buddy.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                  Interest-based matching
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                  Verified profiles
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                  Safe and secure
                </div>
              </div>
            </div>

            {/* Spots */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">📍</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Local Spots</h3>
              <p className="text-gray-600 mb-6">
                Discover the best coffee shops, restaurants, gyms, and hidden gems 
                in your neighborhood.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                  Curated recommendations
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                  Real user reviews
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                  Location-based discovery
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to find your perfect city match
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sign Up</h3>
              <p className="text-gray-600">Create your profile and tell us what you're looking for</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Swipe</h3>
              <p className="text-gray-600">Browse apartments, people, and spots in your city</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Match</h3>
              <p className="text-gray-600">Get matched when both parties show interest</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                4
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect</h3>
              <p className="text-gray-600">Start conversations and make plans</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-20 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Find Your City Match?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of people discovering their perfect urban lifestyle
            </p>
            <button
              onClick={() => router.push('/onboarding')}
              className="bg-white hover:bg-gray-100 text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105"
            >
              Get Started Now
            </button>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center mr-2">
                <span className="text-white text-sm font-bold">C</span>
              </div>
              <span className="text-xl font-bold text-gray-900">CityMate</span>
            </div>
            <p className="text-gray-600">
              © 2024 CityMate. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}