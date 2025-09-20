'use client'

import { MessageCircle, Heart } from 'lucide-react'
import MatchCard from './MatchCard'
import type { Match } from '@/lib/api'

interface MatchListProps {
  matches: Match[]
}

const MatchList = ({ matches }: MatchListProps) => {
  if (matches.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart size={32} className="text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No matches yet</h3>
        <p className="text-gray-600 mb-6">Keep swiping to find your perfect matches!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  )
}

export default MatchList