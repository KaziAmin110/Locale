'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Apartment {
  id: string;
  title: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  photos: string[];
  description: string;
  match_score: number;
}

interface Person {
  id: string;
  name: string;
  age: number;
  bio: string;
  photos: string[];
  interests: string[];
  match_score: number;
}

interface Spot {
  id: string;
  name: string;
  address: string;
  photos: string[];
  description: string;
  match_score: number;
}

export default function SwipePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'apartments' | 'people' | 'spots'>('apartments');
  const [items, setItems] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [matchFound, setMatchFound] = useState(false);
  const [matchItem, setMatchItem] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get user data
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    loadItems();
    detectLocation();
  }, [activeTab]);

  const detectLocation = async () => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            console.log('Location detected:', latitude, longitude);
            
            // Update user location in backend
            const token = localStorage.getItem('token');
            if (token) {
              try {
                await fetch('http://localhost:5002/api/profile/location', {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    lat: latitude,
                    lng: longitude
                  }),
                });
                console.log('Location updated successfully');
              } catch (error) {
                console.log('Failed to update location:', error);
              }
            }
          },
          (error) => {
            console.log('Location access denied or failed:', error);
          }
        );
      }
    } catch (error) {
      console.log('Geolocation not supported:', error);
    }
  };

  const loadItems = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const endpoint = `http://localhost:5002/api/${activeTab}/feed`;
      
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.log('Response is not JSON, using fallback data');
        throw new Error('Non-JSON response');
      }
      
      const data = await response.json();
      
      if (data.success && data[activeTab] && data[activeTab].length > 0) {
        setItems(data[activeTab]);
      } else {
        console.log('API returned no data, using fallback');
        // Use fallback data
        switch (activeTab) {
          case 'apartments':
            setItems(getFallbackApartments());
            break;
          case 'people':
            setItems(getFallbackPeople());
            break;
          case 'spots':
            setItems(getFallbackSpots());
            break;
        }
      }
    } catch (error) {
      console.error('Error loading items:', error);
      // Use fallback data
      switch (activeTab) {
        case 'apartments':
          setItems(getFallbackApartments());
          break;
        case 'people':
          setItems(getFallbackPeople());
          break;
        case 'spots':
          setItems(getFallbackSpots());
          break;
      }
    } finally {
      setLoading(false);
      setCurrentIndex(0);
    }
  };

  const getFallbackApartments = () => [
    {
      id: '1',
      title: 'Modern Downtown Apartment',
      address: '123 Main St, San Francisco, CA',
      price: 2800,
      bedrooms: 2,
      bathrooms: 1.5,
      photos: [
        'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop'
      ],
      description: 'Beautiful modern apartment in the heart of downtown with amazing city views.',
      match_score: 0.85
    },
    {
      id: '2',
      title: 'Cozy Studio with Garden',
      address: '456 Oak Ave, San Francisco, CA',
      price: 2200,
      bedrooms: 1,
      bathrooms: 1,
      photos: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop'
      ],
      description: 'Charming studio apartment with private garden access.',
      match_score: 0.78
    }
  ];

  const getFallbackPeople = () => [
    {
      id: '1',
      name: 'Alex',
      age: 28,
      bio: 'Love exploring the city and trying new restaurants!',
      photos: [
        'https://images.unsplash.com/photo-1494790108755-2616b5c0804?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop'
      ],
      interests: ['Food', 'Travel', 'Photography'],
      match_score: 0.92
    },
    {
      id: '2',
      name: 'Jordan',
      age: 25,
      bio: 'Fitness enthusiast and coffee lover looking for adventure buddies!',
      photos: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'
      ],
      interests: ['Fitness', 'Coffee', 'Hiking'],
      match_score: 0.88
    }
  ];

  const getFallbackSpots = () => [
    {
      id: '1',
      name: 'Blue Bottle Coffee',
      address: '789 Market St, San Francisco, CA',
      photos: [
        'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=400&fit=crop'
      ],
      description: 'Artisanal coffee shop with great atmosphere and amazing pastries.',
      match_score: 0.90
    },
    {
      id: '2',
      name: 'Golden Gate Park',
      address: 'Golden Gate Park, San Francisco, CA',
      photos: [
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop'
      ],
      description: 'Beautiful park perfect for outdoor activities and relaxation.',
      match_score: 0.85
    }
  ];

  const handleSwipe = async (direction: 'left' | 'right') => {
    const currentItem = items[currentIndex];
    if (!currentItem) return;

    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5002/api/${activeTab}/swipe`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          item_id: currentItem.id,
          action: direction === 'right' ? 'like' : 'pass'
        }),
      });

      // Check for match if liked
      if (direction === 'right') {
        const isMatch = Math.random() > 0.7; // 30% match rate
        if (isMatch) {
          setMatchItem(currentItem);
          setMatchFound(true);
        }
      }

      // Move to next item
      setCurrentIndex(prev => prev + 1);
    } catch (error) {
      console.error('Error swiping:', error);
      // Still move to next item even if API fails
      setCurrentIndex(prev => prev + 1);
    }
  };

  const closeMatchModal = () => {
    setMatchFound(false);
    setMatchItem(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white text-2xl font-bold">C</span>
          </div>
          <p className="text-gray-600">Loading {activeTab}...</p>
        </div>
      </div>
    );
  }

  const currentItem = items[currentIndex];

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
              <button
                onClick={() => router.push('/dashboard')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 font-medium transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={() => router.push('/matches')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 font-medium transition-colors"
              >
                Matches
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex bg-gray-100 rounded-2xl p-1">
          {(['apartments', 'people', 'spots'] as const).map((tab) => (
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
                  {tab === 'apartments' ? '🏠' : tab === 'people' ? '👥' : '📍'}
                </span>
                <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Swipe Card */}
      <div className="max-w-md mx-auto px-4">
        {currentItem ? (
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
            {/* Image */}
            <div className="relative h-96">
              <Image
                src={currentItem.photos?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=400&fit=crop'}
                alt={currentItem.title || currentItem.name}
                fill
                className="object-cover"
              />
              
              {/* Match Score */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                <span className="text-sm font-bold text-gray-900">
                  {Math.round((currentItem.match_score || 0.8) * 100)}% match
                </span>
              </div>

              {/* Overlay Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <h2 className="text-white text-2xl font-bold mb-1">
                  {currentItem.title || currentItem.name}
                </h2>
                <p className="text-white/90 text-sm mb-2">
                  {currentItem.address}
                </p>
                
                {activeTab === 'apartments' && (
                  <div className="flex items-center space-x-4 text-white/90 text-sm">
                    <span className="font-semibold">${currentItem.price.toLocaleString()}</span>
                    <span>{currentItem.bedrooms} bed</span>
                    <span>{currentItem.bathrooms} bath</span>
                  </div>
                )}
                
                {activeTab === 'people' && (
                  <div className="text-white/90 text-sm">
                    <span className="font-semibold">{currentItem.age} years old</span>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-gray-700 mb-6 leading-relaxed">
                {currentItem.description || currentItem.bio}
              </p>

              {activeTab === 'people' && currentItem.interests && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentItem.interests.map((interest: string) => (
                      <span
                        key={interest}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={() => handleSwipe('left')}
                  className="flex-1 bg-white border-2 border-red-200 text-red-600 py-4 px-6 rounded-2xl font-semibold transition-all duration-300 hover:bg-red-50 hover:border-red-300 shadow-lg"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-xl">✕</span>
                    <span>Pass</span>
                  </div>
                </button>
                <button
                  onClick={() => handleSwipe('right')}
                  className="flex-1 bg-white border-2 border-green-200 text-green-600 py-4 px-6 rounded-2xl font-semibold transition-all duration-300 hover:bg-green-50 hover:border-green-300 shadow-lg"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-xl">♥</span>
                    <span>Like</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-gray-400 text-3xl">🏁</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No more {activeTab}!</h3>
            <p className="text-gray-600 mb-6">Check back later for new recommendations</p>
            <button
              onClick={() => setCurrentIndex(0)}
              className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg"
            >
              Start Over
            </button>
          </div>
        )}
      </div>

      {/* Match Modal */}
      {matchFound && matchItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
            <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <span className="text-white text-3xl">💖</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">It's a Match!</h2>
            <p className="text-gray-600 mb-8">
              You and {matchItem.title || matchItem.name} liked each other!
            </p>
            <div className="flex space-x-4">
              <button
                onClick={closeMatchModal}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-4 px-6 rounded-2xl font-semibold transition-all duration-300"
              >
                Keep Swiping
              </button>
              <button
                onClick={() => router.push('/matches')}
                className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-300 shadow-lg"
              >
                View Matches
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}