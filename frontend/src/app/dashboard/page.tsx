'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalSwipes: 0,
    matches: 0,
    apartmentsViewed: 0,
    peopleMet: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user data
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userData || !token) {
      router.push('/login');
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/login');
      return;
    }

    // Load user stats
    loadUserStats();
  }, [router]);

  const loadUserStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5002/api/profile/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        // Use mock stats if API fails
        setStats({
          totalSwipes: 42,
          matches: 8,
          apartmentsViewed: 15,
          peopleMet: 12
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
      // Use mock stats
      setStats({
        totalSwipes: 42,
        matches: 8,
        apartmentsViewed: 15,
        peopleMet: 12
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading) {
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
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user?.name || 'User'}</span>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900 px-4 py-2 font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name || 'User'}!
          </h2>
          <p className="text-gray-600">
            Ready to discover more amazing places and people in {user?.location || 'your city'}?
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => router.push('/swipe')}
            className="bg-gray-900 hover:bg-gray-800 text-white p-6 rounded-2xl text-left transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">💫</span>
              <h3 className="text-xl font-bold">Start Swiping</h3>
            </div>
            <p className="text-gray-300">
              Discover apartments, people, and local spots
            </p>
          </button>

          <button
            onClick={() => router.push('/matches')}
            className="bg-white hover:bg-gray-50 text-gray-900 p-6 rounded-2xl text-left transition-all duration-300 transform hover:scale-105 shadow-lg border border-gray-200"
          >
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">💖</span>
              <h3 className="text-xl font-bold">View Matches</h3>
            </div>
            <p className="text-gray-600">
              See your connections and start conversations
            </p>
          </button>

          <button
            onClick={() => router.push('/profile')}
            className="bg-white hover:bg-gray-50 text-gray-900 p-6 rounded-2xl text-left transition-all duration-300 transform hover:scale-105 shadow-lg border border-gray-200"
          >
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">👤</span>
              <h3 className="text-xl font-bold">Edit Profile</h3>
            </div>
            <p className="text-gray-600">
              Update your information and photos
            </p>
          </button>
        </div>

        {/* Stats Section */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Activity</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stats.totalSwipes}
              </div>
              <div className="text-sm text-gray-600">Total Swipes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stats.matches}
              </div>
              <div className="text-sm text-gray-600">Matches</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stats.apartmentsViewed}
              </div>
              <div className="text-sm text-gray-600">Apartments</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stats.peopleMet}
              </div>
              <div className="text-sm text-gray-600">People Met</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Matches */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Matches</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 text-lg">🏠</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Modern Downtown Apartment</div>
                  <div className="text-sm text-gray-600">Matched 2 hours ago</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 text-lg">👥</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Alex</div>
                  <div className="text-sm text-gray-600">Matched yesterday</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 text-lg">📍</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Blue Bottle Coffee</div>
                  <div className="text-sm text-gray-600">Matched 3 days ago</div>
                </div>
              </div>
            </div>
            <button
              onClick={() => router.push('/matches')}
              className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 rounded-xl font-semibold transition-colors"
            >
              View All Matches
            </button>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Recommendations</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 text-lg">🏠</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Studio in Mission District</div>
                  <div className="text-sm text-gray-600">$2,400/month • 95% match</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 text-lg">👥</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Jordan</div>
                  <div className="text-sm text-gray-600">25 • Fitness & Coffee • 92% match</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 text-lg">📍</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Golden Gate Park</div>
                  <div className="text-sm text-gray-600">Outdoor Activities • 88% match</div>
                </div>
              </div>
            </div>
            <button
              onClick={() => router.push('/swipe')}
              className="w-full mt-4 bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-xl font-semibold transition-colors"
            >
              Start Swiping
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}