import React from 'react';
import type { Match } from '@/lib/api';

type FilterType = 'all' | 'apartment' | 'person' | 'spot';

interface MatchListProps {
  matches: Match[];
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export default function MatchList({ matches, activeFilter, onFilterChange }: MatchListProps) {
  const filteredMatches = activeFilter === 'all' 
    ? matches 
    : matches.filter(match => match.type === activeFilter);

  return (
    <div className="space-y-4">
      {filteredMatches.map((match) => (
        <div key={match.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-4">
            <img
              src={match.photo}
              alt={match.name}
              className="w-16 h-16 rounded-2xl object-cover"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{match.name}</h3>
              <p className="text-gray-600 text-sm">{match.type}</p>
              {match.lastMessage && (
                <p className="text-gray-500 text-sm mt-1">{match.lastMessage}</p>
              )}
            </div>
            {match.unreadCount && match.unreadCount > 0 && (
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">{match.unreadCount}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
