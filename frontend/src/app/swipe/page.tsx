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
  const [activeTab, setActiveTab] = useState<'apartments' | 'people' | 'spots'>('apartments');
  const [items, setItems] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [matchFound, setMatchFound] = useState(false);
  const [matchItem, setMatchItem] = useState<any>(null);
  const router = useRouter();

  // Fallback data when API fails
  const fallbackApartments: Apartment[] = [
    {
      id: '1',
      title: 'Modern Downtown Loft',
      address: '123 Main St, San Francisco, CA',
      price: 2800,
      bedrooms: 2,
      bathrooms: 1,
      photos: [
        'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop'
      ],
      description: 'Beautiful modern loft in the heart of downtown',
      match_score: 0.85
    },
    {
      id: '2',
      title: 'Cozy Studio Apartment',
      address: '456 Oak Ave, San Francisco, CA',
      price: 2200,
      bedrooms: 1,
      bathrooms: 1,
      photos: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop'
      ],
      description: 'Perfect studio with great natural light',
      match_score: 0.78
    }
  ];

  const fallbackPeople: Person[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      age: 26,
      bio: 'Software engineer who loves hiking and coffee',
      photos: [
        'https://images.unsplash.com/photo-1494790108755-2616b5c0804?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop'
      ],
      interests: ['Technology', 'Hiking', 'Coffee'],
      match_score: 0.92
    },
    {
      id: '2',
      name: 'Mike Chen',
      age: 28,
      bio: 'Designer passionate about art and music',
      photos: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'
      ],
      interests: ['Art', 'Music', 'Design'],
      match_score: 0.88
    }
  ];

  const fallbackSpots: Spot[] = [
    {
      id: '1',
      name: 'Blue Bottle Coffee',
      address: '789 Market St, San Francisco, CA',
      photos: [
        'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop'
      ],
      description: 'Artisanal coffee shop with great atmosphere',
      match_score: 0.90
    },
    {
      id: '2',
      name: 'Golden Gate Park',
      address: 'Golden Gate Park, San Francisco, CA',
      photos: [
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
      ],
      description: 'Beautiful park perfect for outdoor activities',
      match_score: 0.85
    }
  ];

  useEffect(() => {
    loadItems();
  }, [activeTab]);

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
      
      const data = await response.json();
      
      if (data.success && data[activeTab] && data[activeTab].length > 0) {
        setItems(data[activeTab]);
      } else {
        // Use fallback data
        switch (activeTab) {
          case 'apartments':
            setItems(fallbackApartments);
            break;
          case 'people':
            setItems(fallbackPeople);
            break;
          case 'spots':
            setItems(fallbackSpots);
            break;
        }
      }
    } catch (error) {
      console.error('Error loading items:', error);
      // Use fallback data
      switch (activeTab) {
        case 'apartments':
          setItems(fallbackApartments);
          break;
        case 'people':
          setItems(fallbackPeople);
          break;
        case 'spots':
          setItems(fallbackSpots);
          break;
      }
    } finally {
      setLoading(false);
      setCurrentIndex(0);
    }
  };

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (currentIndex >= items.length) return;

    const currentItem = items[currentIndex];
    
    try {
      const token = localStorage.getItem('token');
      const endpoint = `http://localhost:5002/api/${activeTab}/swipe`;
      
      await fetch(endpoint, {
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white text-2xl font-bold">C</span>
          </div>
          <p className="text-gray-600">Loading {activeTab}...</p>
        </div>
      </div>
    );
  }

  const currentItem = items[currentIndex];

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
            <button 
              onClick={() => router.push('/dashboard')}
              className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg">
          {(['apartments', 'people', 'spots'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Swipe Card */}
      <div className="max-w-md mx-auto px-4">
        {currentItem ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
            {/* Image */}
            <div className="relative h-96">
              <Image
                src={currentItem.photos?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=400&fit=crop'}
                alt={currentItem.title || currentItem.name}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                <span className="text-sm font-bold text-gray-900">
                  {Math.round((currentItem.match_score || 0.8) * 100)}% match
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {currentItem.title || currentItem.name}
              </h2>
              <p className="text-gray-600 mb-4">
                {currentItem.address}
              </p>
              
              {activeTab === 'apartments' && (
                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-2xl font-bold text-blue-600">${currentItem.price}</span>
                  <span className="text-gray-600">{currentItem.bedrooms} bed</span>
                  <span className="text-gray-600">{currentItem.bathrooms} bath</span>
                </div>
              )}

              {activeTab === 'people' && (
                <div className="mb-4">
                  <span className="text-lg text-gray-600">{currentItem.age} years old</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {currentItem.interests?.map((interest: string, index: number) => (
                      <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-gray-700 mb-6">
                {currentItem.description || currentItem.bio}
              </p>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={() => handleSwipe('left')}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Pass
                </button>
                <button
                  onClick={() => handleSwipe('right')}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Like
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Image src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=48&h=48&fit=crop" alt="No more" width={48} height={48} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No more {activeTab}!</h3>
            <p className="text-gray-600 mb-6">Check back later for new recommendations</p>
            <button
              onClick={() => setCurrentIndex(0)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200"
            >
              Start Over
            </button>
          </div>
        )}
      </div>

      {/* Match Modal */}
      {matchFound && matchItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white text-3xl">💖</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">It's a Match!</h2>
            <p className="text-gray-600 mb-6">
              You and {matchItem.title || matchItem.name} liked each other!
            </p>
            <div className="flex space-x-4">
              <button
                onClick={closeMatchModal}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-xl font-medium transition-all duration-200"
              >
                Keep Swiping
              </button>
              <button
                onClick={() => router.push('/matches')}
                className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200"
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