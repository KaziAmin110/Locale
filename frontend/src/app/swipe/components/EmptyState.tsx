import React from 'react'

type TabType = 'apartments' | 'people' | 'spots'

interface EmptyStateProps {
  activeTab: TabType
  onRefresh: () => void
}

export default function EmptyState({ activeTab, onRefresh }: EmptyStateProps) {
  const getEmptyStateContent = () => {
    switch (activeTab) {
      case 'apartments':
        return {
          icon: '🏠',
          title: 'No more apartments!',
          subtitle: 'You\'ve seen all available apartments in your area'
        }
      case 'people':
        return {
          icon: '👥',
          title: 'No more people!',
          subtitle: 'You\'ve seen everyone nearby'
        }
      case 'spots':
        return {
          icon: '📍',
          title: 'No more spots!',
          subtitle: 'You\'ve explored all the spots in your area'
        }
      default:
        return {
          icon: '🏁',
          title: `No more ${activeTab}!`,
          subtitle: 'Check back later for new recommendations'
        }
    }
  }

  const content = getEmptyStateContent()

  return (
    <div className="text-center py-12 max-w-sm mx-auto">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="text-4xl">{content.icon}</span>
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        {content.title}
      </h3>
      
      <p className="text-gray-600 mb-8 leading-relaxed">
        {content.subtitle}
      </p>
      
      <button
        onClick={onRefresh}
        className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
      >
        Start Over
      </button>
    </div>
  )
}