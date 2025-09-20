'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Match {
  id: string;
  type: 'apartment' | 'person' | 'spot';
  name: string;
  image: string;
  description: string;
  matchedAt: string;
  lastMessage?: string;
  unreadCount?: number;
}

export default function MatchesPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'apartments' | 'people' | 'spots'>('all');

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5002/api/matches', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMatches(data.matches || []);
      } else {
        // Use mock matches if API fails
        setMatches(getMockMatches());
      }
    } catch (error) {
      console.error('Error loading matches:', error);
      // Use mock matches
      setMatches(getMockMatches());
    } finally {
      setLoading(false);
    }
  };

  const getMockMatches = (): Match[] => [
    {
      id: '1',
      type: 'apartment',
      name: 'Modern Downtown Apartment',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop',
      description: 'Beautiful 2BR apartment in downtown',
      matchedAt: '2 hours ago',
      lastMessage: 'Hi! I\'m interested in viewing this apartment.',
      unreadCount: 2
    },
    {
      id: '2',
      type: 'person',
      name: 'Alex',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b5c0804?w=400&h=400&fit=crop',
      description: 'Love exploring the city and trying new restaurants!',
      matchedAt: '1 day ago',
      lastMessage: 'Hey! Want to grab coffee sometime?',
      unreadCount: 1
    },
    {
      id: '3',
      type: 'spot',
      name: 'Blue Bottle Coffee',
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop',
      description: 'Artisanal coffee shop with great atmosphere',
      matchedAt: '3 days ago',
      lastMessage: 'This place has amazing pastries!'
    },
    {
      id: '4',
      type: 'apartment',
      name: 'Cozy Studio with Garden',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
      description: 'Charming studio with private garden access',
      matchedAt: '1 week ago',
      lastMessage: 'The garden looks beautiful!'
    },
    {
      id: '5',
      type: 'person',
      name: 'Jordan',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      description: 'Fitness enthusiast and coffee lover',
      matchedAt: '1 week ago',
      lastMessage: 'Thanks for the gym recommendation!'
    }
  ];

  const filteredMatches = matches.filter(match => {
    if (activeTab === 'all') return true;
    return match.type === activeTab.slice(0, -1) as 'apartment' | 'person' | 'spot';
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'apartment': return '🏠';
      case 'person': return '👥';
      case 'spot': return '📍';
      default: return '💫';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'apartment': return 'bg-blue-100 text-blue-800';
      case 'person': return 'bg-green-100 text-green-800';
      case 'spot': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
              <button
                onClick={() => router.back()}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center mr-3">
                <span className="text-white text-lg font-bold">C</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Matches</h1>
            </div>
            
            <button
              onClick={() => router.push('/swipe')}
              className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Keep Swiping
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
          {(['all', 'apartments', 'people', 'spots'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <span className="text-lg">
                  {tab === 'all' ? '💫' : tab === 'apartments' ? '🏠' : tab === 'people' ? '👥' : '📍'}
                </span>
                <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Matches Grid */}
        {filteredMatches.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-gray-400 text-3xl">💫</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No matches yet</h3>
            <p className="text-gray-600 mb-6">Start swiping to find your perfect matches!</p>
            <button
              onClick={() => router.push('/swipe')}
              className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg"
            >
              Start Swiping
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMatches.map((match) => (
              <div
                key={match.id}
                onClick={() => router.push(`/chat/${match.id}`)}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
              >
                {/* Image */}
                <div className="relative h-48">
                  <Image
                    src={match.image}
                    alt={match.name}
                    fill
                    className="object-cover"
                  />
                  
                  {/* Type Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getTypeColor(match.type)}`}>
                      {getTypeIcon(match.type)} {match.type}
                    </span>
                  </div>

                  {/* Unread Badge */}
                  {match.unreadCount && match.unreadCount > 0 && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                      {match.unreadCount}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {match.name}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {match.description}
                  </p>
                  
                  {match.lastMessage && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1">Last message:</p>
                      <p className="text-gray-700 text-sm line-clamp-1">
                        {match.lastMessage}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Matched {match.matchedAt}
                    </span>
                    <button className="text-gray-900 hover:text-gray-700 font-semibold text-sm">
                      View Chat →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="mt-12 bg-gray-50 rounded-2xl p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Match Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {matches.length}
              </div>
              <div className="text-sm text-gray-600">Total Matches</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {matches.filter(m => m.type === 'apartment').length}
              </div>
              <div className="text-sm text-gray-600">Apartments</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {matches.filter(m => m.type === 'person').length}
              </div>
              <div className="text-sm text-gray-600">People</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {matches.filter(m => m.type === 'spot').length}
              </div>
              <div className="text-sm text-gray-600">Spots</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}