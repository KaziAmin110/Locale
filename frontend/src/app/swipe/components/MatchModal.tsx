import React from 'react';
import type { Apartment, Person, Spot } from '@/lib/api';

type ItemType = Apartment | Person | Spot;
type TabType = 'apartments' | 'people' | 'spots';

interface MatchModalProps {
  isOpen: boolean;
  item: ItemType | null;
  type: TabType;
  onClose: () => void;
}

export default function MatchModal({ isOpen, item, onClose }: MatchModalProps) {
  if (!isOpen || !item) return null;

  const displayName = 'title' in item ? item.title : item.name;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
        <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <span className="text-white text-3xl">💖</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">It's a Match!</h2>
        <p className="text-gray-600 mb-8">
          You and {displayName} liked each other!
        </p>
        <div className="flex space-x-4">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-4 px-6 rounded-2xl font-semibold transition-colors"
          >
            Keep Swiping
          </button>
          <button
            onClick={() => window.location.href = '/matches'}
            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-4 px-6 rounded-2xl font-semibold transition-colors"
          >
            View Matches
          </button>
        </div>
      </div>
    </div>
  );
}
