'use client'

import { MessageCircle, Heart, Sparkles, ArrowRight } from 'lucide-react'
import MatchCard from './MatchCard'
import type { Match } from '@/lib/api'

interface MatchListProps {
  matches: Match[]
}

const MatchList = ({ matches }: MatchListProps) => {
  if (matches.length === 0) {
    return (
      <div className="text-center py-16 max-w-md mx-auto">
        <div className="relative mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart size={32} className="text-white" />
          </div>
          
          {/* Floating hearts animation */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-6 h-6 text-primary/30 animate-ping`}
                style={{
                  left: `${25 + (i * 25)}%`,
                  top: `${20 + (i * 10)}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: '3s'
                }}
              >
                💕
              </div>
            ))}
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          No matches yet
        </h3>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          Keep swiping to find your perfect matches! Your next great connection is just a swipe away.
        </p>
        
        <div className="space-y-4">
          <button 
            onClick={() => window.location.href = '/swipe'}
            className="w-full bg-primary hover:bg-primary-hover text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Start Swiping
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span>or</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>
          
          <button 
            onClick={() => window.location.href = '/discover'}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-6 rounded-2xl font-medium transition-colors"
          >
            Browse Recommendations
          </button>
        </div>
      </div>
    )
  }

  // Sort matches by timestamp (newest first)
  const sortedMatches = [...matches].sort((a, b) => {
    if (!a.timestamp && !b.timestamp) return 0
    if (!a.timestamp) return 1
    if (!b.timestamp) return -1
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  })

  return (
    <div className="space-y-6">
      {/* Recent matches section */}
      {sortedMatches.some(m => {
        if (!m.timestamp) return false
        const matchTime = new Date(m.timestamp)
        const now = new Date()
        const diffHours = (now.getTime() - matchTime.getTime()) / (1000 * 60 * 60)
        return diffHours < 24
      }) && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">New Matches</h3>
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedMatches
              .filter(match => {
                if (!match.timestamp) return false
                const matchTime = new Date(match.timestamp)
                const now = new Date()
                const diffHours = (now.getTime() - matchTime.getTime()) / (1000 * 60 * 60)
                return diffHours < 24
              })
              .slice(0, 3)
              .map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
          </div>
        </div>
      )}
      
      {/* All matches section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            All Matches ({matches.length})
          </h3>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MessageCircle className="w-4 h-4" />
            <span>{matches.filter(m => m.type === 'person').length} ready to chat</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
          {sortedMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default MatchList