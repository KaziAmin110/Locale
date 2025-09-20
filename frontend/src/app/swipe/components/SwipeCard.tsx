import React from 'react';
import type { Apartment, Person, Spot } from '@/lib/api';

type ItemType = Apartment | Person | Spot;
type TabType = 'apartments' | 'people' | 'spots';

interface SwipeCardProps {
  item: ItemType;
  type: TabType;
  isTopCard?: boolean;
  onSwipe: (action: 'like' | 'pass') => void;
  style?: React.CSSProperties;
}

export default function SwipeCard({ item, onSwipe }: SwipeCardProps) {
  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 max-w-md mx-auto">
      <div className="relative h-96">
        <img
          src={item.photos?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=400&fit=crop'}
          alt={item.title || item.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
          <span className="text-sm font-bold text-gray-900">
            {Math.round((item.match_score || 0.8) * 100)}% match
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {item.title || item.name}
        </h2>
        <p className="text-gray-700 mb-4">
          {item.description || item.bio}
        </p>
        
        <div className="flex space-x-4">
          <button
            onClick={() => onSwipe('pass')}
            className="flex-1 bg-white border-2 border-red-200 text-red-600 py-4 px-6 rounded-2xl font-semibold transition-all duration-300 hover:bg-red-50 hover:border-red-300"
          >
            Pass
          </button>
          <button
            onClick={() => onSwipe('like')}
            className="flex-1 bg-white border-2 border-green-200 text-green-600 py-4 px-6 rounded-2xl font-semibold transition-all duration-300 hover:bg-green-50 hover:border-green-300"
          >
            Like
          </button>
        </div>
      </div>
    </div>
  );
}
