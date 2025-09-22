import React, { useEffect, useState } from 'react'
import type { Apartment, Person, Spot } from '@/lib/api'

type ItemType = Apartment | Person | Spot
type TabType = 'apartments' | 'people' | 'spots'

interface MatchModalProps {
  isOpen: boolean
  item: ItemType | null
  type: TabType
  onClose: () => void
}

export default function MatchModal({ isOpen, item, type, onClose }: MatchModalProps) {
  const [showAnimation, setShowAnimation] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShowAnimation(true)
      const timer = setTimeout(() => {
        onClose()
      }, 5000)
      return () => clearTimeout(timer)
    } else {
      setShowAnimation(false)
    }
  }, [isOpen, onClose])

  if (!isOpen || !item) return null

  const displayName = 'title' in item ? item.title : item.name
  
  const getMatchMessage = () => {
    switch (type) {
      case 'apartments':
        return `Great news! You and the landlord both liked this apartment!`
      case 'people':
        return `You and ${displayName} liked each other!`
      case 'spots':
        return `This spot is now on your favorites list!`
      default:
        return `It's a match!`
    }
  }

  const getActionButton = () => {
    switch (type) {
      case 'apartments':
        return 'Contact Landlord'
      case 'people':
        return 'Start Chatting'
      case 'spots':
        return 'View Details'
      default:
        return 'View Matches'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        className={`bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl transform transition-all duration-500 ${
          showAnimation ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
        }`}
      >
        <div className="relative mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto animate-pulse">
            <svg 
              className="w-10 h-10 text-white animate-bounce" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-4 h-4 text-primary animate-ping`}
                style={{
                  left: `${20 + (i * 10)}%`,
                  top: `${10 + (i * 15)}%`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '2s'
                }}
              >
                ♥
              </div>
            ))}
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          It's a Match!
        </h2>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          {getMatchMessage()}
        </p>

        {item.photos && item.photos[0] && (
          <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-6 border-4 border-primary/20">
            <img 
              src={item.photos[0]} 
              alt={displayName}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex flex-col space-y-3">
          <button
            onClick={() => {
              if (type === 'apartments') {
                window.location.href = '/matches'
              } else if (type === 'people') {
                window.location.href = '/chat'
              } else {
                window.location.href = '/favorites'
              }
            }}
            className="w-full bg-primary hover:bg-primary-hover text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            {getActionButton()}
          </button>
          
          <button
            onClick={onClose}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-4 px-6 rounded-2xl font-semibold transition-all duration-200"
          >
            Keep Swiping
          </button>
        </div>
      </div>
    </div>
  )
}