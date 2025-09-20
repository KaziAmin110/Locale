'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Match {
  id: string;
  type: 'apartment' | 'person' | 'spot';
  item: any;
  matched_at: string;
}

const MatchesPage = () => {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'apartment' | 'person' | 'spot'>('all');

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5002/api/matches');
      const data = await response.json();
      
      if (data.success) {
        setMatches(data.matches || []);
      }
    } catch (error) {
      console.error('Error loading matches:', error);
      // Fallback to mock data
      setMatches([
        {
          id: '1',
          type: 'apartment',
          item: {
            id: '1',
            address: '123 Main St, San Francisco',
            price: 2500,
            bedrooms: 2,
            bathrooms: 1,
            images: ['/api/placeholder/400/300']
          },
          matched_at: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          type: 'person',
          item: {
            id: '2',
            name: 'Sarah Johnson',
            age: 28,
            bio: 'Love hiking and cooking',
            images: ['/api/placeholder/400/300']
          },
          matched_at: '2024-01-14T15:45:00Z'
        },
        {
          id: '3',
          type: 'spot',
          item: {
            id: '3',
            name: 'Blue Bottle Coffee',
            category: 'Coffee Shop',
            rating: 4.5,
            images: ['/api/placeholder/400/300']
          },
          matched_at: '2024-01-13T09:20:00Z'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredMatches = matches.filter(match => 
    activeFilter === 'all' || match.type === activeFilter
  );

  const handleMessage = (match: Match) => {
    if (match.type === 'person') {
      router.push(`/chat/${match.id}`);
    } else {
      // For apartments and spots, show details or contact info
      alert(`Contact information for ${match.item.name || match.item.address}`);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading matches...</p>
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
              <a href="/dashboard" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">Dashboard</a>
              <a href="/swipe" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">Swipe</a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Matches</h1>
          <p className="text-lg text-gray-600">People, places, and spaces you've connected with</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            {[
              { key: 'all', label: 'All' },
              { key: 'apartment', label: 'Apartments' },
              { key: 'person', label: 'People' },
              { key: 'spot', label: 'Spots' }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key as any)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeFilter === filter.key
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Matches Grid */}
        {filteredMatches.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-gray-400">💔</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No matches yet</h3>
            <p className="text-gray-600 mb-6">Start swiping to find your perfect matches!</p>
            <a href="/swipe" className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium">
              Start Swiping
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMatches.map((match) => (
              <div key={match.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                {/* Image */}
                <div className="aspect-w-16 aspect-h-12 bg-gray-200">
                  {match.item.images && match.item.images.length > 0 ? (
                    <img 
                      src={match.item.images[0]} 
                      alt={match.item.name || match.item.address}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      match.type === 'apartment' ? 'bg-blue-100 text-blue-800' :
                      match.type === 'person' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {match.type.charAt(0).toUpperCase() + match.type.slice(1)}
                    </span>
                    <span className="text-sm text-gray-500">{formatDate(match.matched_at)}</span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {match.item.name || match.item.address}
                  </h3>

                  <div className="space-y-1 mb-4">
                    {match.type === 'apartment' && (
                      <>
                        <p className="text-sm text-gray-600">
                          ${match.item.price?.toLocaleString()}/month
                        </p>
                        <p className="text-sm text-gray-600">
                          {match.item.bedrooms} bed • {match.item.bathrooms} bath
                        </p>
                      </>
                    )}
                    {match.type === 'person' && (
                      <>
                        <p className="text-sm text-gray-600">{match.item.age} years old</p>
                        <p className="text-sm text-gray-600">{match.item.bio}</p>
                      </>
                    )}
                    {match.type === 'spot' && (
                      <>
                        <p className="text-sm text-gray-600">{match.item.category}</p>
                        <p className="text-sm text-gray-600">{match.item.rating} stars</p>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => handleMessage(match)}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    {match.type === 'person' ? 'Message' : 'View Details'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MatchesPage;
