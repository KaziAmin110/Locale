'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    apartments: 0,
    people: 0,
    spots: 0,
    matches: 0
  });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));
    loadStats();
    setLoading(false);
  }, [router]);

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Load apartments
      const apartmentsRes = await fetch('http://localhost:5002/api/apartments/feed', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const apartmentsData = await apartmentsRes.json();
      
      // Load people
      const peopleRes = await fetch('http://localhost:5002/api/people/feed', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const peopleData = await peopleRes.json();
      
      // Load spots
      const spotsRes = await fetch('http://localhost:5002/api/spots/feed', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const spotsData = await spotsRes.json();

      setStats({
        apartments: apartmentsData.apartments?.length || 0,
        people: peopleData.people?.length || 0,
        spots: spotsData.spots?.length || 0,
        matches: Math.floor(Math.random() * 5) + 1 // Mock matches for now
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      // Set fallback stats
      setStats({
        apartments: 12,
        people: 8,
        spots: 15,
        matches: 3
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white text-2xl font-bold">C</span>
          </div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                <span className="text-white text-lg font-bold">C</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">CityMate</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">Welcome, {user?.email}</span>
              <button 
                onClick={() => router.push('/swipe')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              >
                Start Swiping
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h2>
              <p className="text-gray-600 text-lg">Ready to find your perfect match?</p>
            </div>
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Image 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop" 
                alt="Profile" 
                width={80} 
                height={80}
                className="rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4">
                <Image src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=32&h=32&fit=crop" alt="Apartments" width={24} height={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Apartments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.apartments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4">
                <Image src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=32&h=32&fit=crop" alt="People" width={24} height={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">People</p>
                <p className="text-2xl font-bold text-gray-900">{stats.people}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                <Image src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=32&h=32&fit=crop" alt="Spots" width={24} height={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Spots</p>
                <p className="text-2xl font-bold text-gray-900">{stats.spots}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mr-4">
                <Image src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=32&h=32&fit=crop" alt="Matches" width={24} height={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Matches</p>
                <p className="text-2xl font-bold text-gray-900">{stats.matches}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button 
            onClick={() => router.push('/swipe?tab=apartments')}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 text-left group"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Image src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=40&h=40&fit=crop" alt="Apartments" width={32} height={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Find Apartments</h3>
            <p className="text-gray-600">Discover your perfect home</p>
          </button>

          <button 
            onClick={() => router.push('/swipe?tab=people')}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 text-left group"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Image src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=40&h=40&fit=crop" alt="People" width={32} height={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Meet People</h3>
            <p className="text-gray-600">Connect with roommates</p>
          </button>

          <button 
            onClick={() => router.push('/swipe?tab=spots')}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 text-left group"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Image src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=40&h=40&fit=crop" alt="Spots" width={32} height={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Explore Spots</h3>
            <p className="text-gray-600">Find cool places nearby</p>
          </button>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4">
                <Image src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=24&h=24&fit=crop" alt="Activity" width={20} height={20} />
              </div>
              <div>
                <p className="font-medium text-gray-900">Found 3 new apartments</p>
                <p className="text-sm text-gray-600">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mr-4">
                <Image src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=24&h=24&fit=crop" alt="Activity" width={20} height={20} />
              </div>
              <div>
                <p className="font-medium text-gray-900">Matched with Sarah</p>
                <p className="text-sm text-gray-600">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                <Image src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=24&h=24&fit=crop" alt="Activity" width={20} height={20} />
              </div>
              <div>
                <p className="font-medium text-gray-900">Discovered Coffee Shop</p>
                <p className="text-sm text-gray-600">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}