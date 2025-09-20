'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  interests: string[];
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate user data loading
    // In a real app, this would come from your auth system
    const mockUser: User = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      age: 25,
      interests: ['Technology', 'Music', 'Travel']
    };
    
    setTimeout(() => {
      setUser(mockUser);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-sm font-bold">C</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">CityMate</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user?.name}</span>
              <button className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">Sign out</button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}</h1>
          <p className="text-lg text-gray-600">Continue your journey to find the perfect place</p>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Explore</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/swipe" className="group">
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <div className="w-6 h-6 bg-blue-600 rounded"></div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">Find Apartments</h3>
                    <p className="text-gray-600 text-sm">Discover your perfect home</p>
                  </div>
                </div>
                <div className="text-blue-600 text-sm font-medium">Start exploring →</div>
              </div>
            </Link>

            <Link href="/swipe" className="group">
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <div className="w-6 h-6 bg-green-600 rounded"></div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600">Find Roommates</h3>
                    <p className="text-gray-600 text-sm">Connect with compatible people</p>
                  </div>
                </div>
                <div className="text-green-600 text-sm font-medium">Start exploring →</div>
              </div>
            </Link>

            <Link href="/swipe" className="group">
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <div className="w-6 h-6 bg-purple-600 rounded"></div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600">Find Local Spots</h3>
                    <p className="text-gray-600 text-sm">Explore nearby places</p>
                  </div>
                </div>
                <div className="text-purple-600 text-sm font-medium">Start exploring →</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Apartments Viewed</h3>
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-blue-600 rounded"></div>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">24</p>
              <p className="text-sm text-gray-600 mt-1">+3 this week</p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Matches</h3>
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-green-600 rounded"></div>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">8</p>
              <p className="text-sm text-gray-600 mt-1">+2 this week</p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Conversations</h3>
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-purple-600 rounded"></div>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">3</p>
              <p className="text-sm text-gray-600 mt-1">Active now</p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600">Profile Score</h3>
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-yellow-600 rounded"></div>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">85%</p>
              <p className="text-sm text-gray-600 mt-1">Complete profile</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <div className="w-5 h-5 bg-blue-600 rounded"></div>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900">Liked apartment in Downtown</h3>
                  <p className="text-sm text-gray-600">2 hours ago</p>
                </div>
                <div className="text-sm text-gray-500">$2,400/month</div>
              </div>
            </div>
            
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <div className="w-5 h-5 bg-green-600 rounded"></div>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900">New match with Sarah</h3>
                  <p className="text-sm text-gray-600">5 hours ago</p>
                </div>
                <div className="text-sm text-gray-500">Roommate</div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <div className="w-5 h-5 bg-purple-600 rounded"></div>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900">Discovered new coffee shop</h3>
                  <p className="text-sm text-gray-600">1 day ago</p>
                </div>
                <div className="text-sm text-gray-500">Local Spot</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recommended for You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Complete Your Profile</h3>
              <p className="text-gray-600 mb-4">Add more details to get better matches</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div className="bg-blue-600 h-2 rounded-full" style={{width: '85%'}}></div>
              </div>
              <button className="text-blue-600 text-sm font-medium">Complete profile →</button>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Explore New Areas</h3>
              <p className="text-gray-600 mb-4">Discover apartments in neighborhoods you haven't explored</p>
              <button className="text-green-600 text-sm font-medium">Explore areas →</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;