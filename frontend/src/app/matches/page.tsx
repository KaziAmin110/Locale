'use client'

import { useState, useEffect } from 'react'
import { Heart, MapPin, Users } from 'lucide-react'
import { ApiService } from '@/lib/api'
import Header from '../components/Header'
import MatchList from './components/MatchList'
import LoadingSpinner from '../components/LoadingSpinner'
import type { Match } from '@/lib/api'

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<'all' | 'apartment' | 'person' | 'spot'>('all')

  useEffect(() => {
    loadMatches()
  }, [])

  const loadMatches = async () => {
    try {
      const response = await ApiService.getMatches()
      if (response.success) {
        setMatches(response.matches)
      }
    } catch (error) {
      console.error('Failed to load matches:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterOptions = [
    { id: 'all' as const, label: 'All', icon: Heart, count: matches.length },
    { id: 'apartment' as const, label: 'Homes', icon: MapPin, count: matches.filter(m => m.type === 'apartment').length },
    { id: 'person' as const, label: 'People', icon: Users, count: matches.filter(m => m.type === 'person').length },
    { id: 'spot' as const, label: 'Places', icon: MapPin, count: matches.filter(m => m.type === 'spot').length },
  ]

  const filteredMatches = activeFilter === 'all' 
    ? matches 
    : matches.filter(match => match.type === activeFilter)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 pt-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Matches</h2>
          
          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {filterOptions.map(({ id, label, icon: Icon, count }) => (
              <button
                key={id}
                onClick={() => setActiveFilter(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-colors ${
                  activeFilter === id
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon size={18} />
                <span>{label}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeFilter === id
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <MatchList 
            matches={filteredMatches} 
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        )}
      </div>
    </div>
  )
}