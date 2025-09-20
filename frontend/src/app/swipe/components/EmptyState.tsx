import React from 'react';

type TabType = 'apartments' | 'people' | 'spots';

interface EmptyStateProps {
  activeTab: TabType;
  onRefresh: () => void;
}

export default function EmptyState({ activeTab, onRefresh }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="text-gray-400 text-3xl">🏁</span>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">No more {activeTab}!</h3>
      <p className="text-gray-600 mb-6">Check back later for new recommendations</p>
      <button
        onClick={onRefresh}
        className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-2xl font-semibold transition-colors"
      >
        Start Over
      </button>
    </div>
  );
}
