'use client'

import Image from 'next/image'
import { MessageCircle, MapPin, Star, Clock, Heart, Home, Users } from 'lucide-react'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import type { Match, Person, Apartment, Spot } from '@/lib/api'

interface MatchCardProps {
  match: Match
}

const MatchCard = ({ match }: MatchCardProps) => {
  const getImage = () => {
    return match.photo || '/placeholder-image.jpg'
  }

  const getTimeAgo = (timestamp?: string) => {
    if (!timestamp) return 'Recently'
    const now = new Date()
    const matchTime = new Date(timestamp)
    const diffMs = now.getTime() - matchTime.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)
    
    if (diffDays > 0) return `${diffDays}d ago`
    if (diffHours > 0) return `${diffHours}h ago`
    return 'Just now'
  }

  const handleChat = () => {
    // For apartments, redirect to chat to contact landlord
    // For people, redirect to chat to start conversation
    if (match.type === 'person' || match.type === 'apartment') {
      // Pass the match ID as a URL parameter to auto-start conversation
      window.location.href = `/chat?start=${match.id}&type=${match.type}`
    }
    // For spots, we could add directions or other functionality
  }

  const handleViewDetails = () => {
    // Navigate based on type
    if (match.type === 'apartment') {
      window.location.href = `/apartments/${match.id}`
    } else if (match.type === 'spot') {
      window.location.href = `/spots/${match.id}`
    }
  }

  const getTypeIcon = () => {
    switch (match.type) {
      case 'person':
        return <Users className="w-4 h-4" />
      case 'apartment':
        return <Home className="w-4 h-4" />
      case 'spot':
        return <MapPin className="w-4 h-4" />
      default:
        return <Heart className="w-4 h-4" />
    }
  }

  const getTypeColor = () => {
    switch (match.type) {
      case 'person':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'apartment':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'spot':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const renderContent = () => {
    switch (match.type) {
      case 'apartment':
        return (
          <>
            <div className="relative h-48 group overflow-hidden">
              <Image
                src={getImage()}
                alt={match.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              
              <div className="absolute top-3 left-3">
                <Badge className={`border ${getTypeColor()}`}>
                  <div className="flex items-center gap-2">
                    {getTypeIcon()}
                    <span className="font-semibold">Apartment</span>
                  </div>
                </Badge>
              </div>
              
              <div className="absolute top-3 right-3">
                <div className="bg-black/70 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className="text-white text-sm font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {getTimeAgo(match.timestamp)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-5">
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                {match.name}
              </h3>
              
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={16} className="text-gray-500" />
                <span className="text-sm text-gray-600">Available to rent</span>
              </div>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                You both liked this apartment! Contact the landlord to schedule a viewing.
              </p>
              
              <div className="flex gap-2">
                <Button 
                  variant="primary" 
                  className="flex-1"
                  onClick={handleViewDetails}
                >
                  View Details
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={handleChat}
                >
                  <MessageCircle size={16} />
                  Contact
                </Button>
              </div>
            </div>
          </>
        )

      case 'person':
        return (
          <>
            <div className="relative h-48 group overflow-hidden">
              <Image
                src={getImage()}
                alt={match.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              
              <div className="absolute top-3 left-3">
                <Badge className={`border ${getTypeColor()}`}>
                  <div className="flex items-center gap-2">
                    {getTypeIcon()}
                    <span className="font-semibold">Person</span>
                  </div>
                </Badge>
              </div>
              
              <div className="absolute top-3 right-3">
                <div className="bg-black/70 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className="text-white text-sm font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {getTimeAgo(match.timestamp)}
                  </span>
                </div>
              </div>
              
              <div className="absolute bottom-3 left-3">
                <div className="bg-green-500 rounded-full px-3 py-1">
                  <span className="text-white text-sm font-semibold flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    Mutual Match
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-5">
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                {match.name}
              </h3>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                You matched with {match.name}! Start a conversation and get to know each other.
              </p>
              
              <Button 
                variant="primary" 
                className="w-full flex items-center justify-center gap-2"
                onClick={handleChat}
              >
                <MessageCircle size={16} />
                Start Chatting
              </Button>
            </div>
          </>
        )

      case 'spot':
        return (
          <>
            <div className="relative h-48 group overflow-hidden">
              <Image
                src={getImage()}
                alt={match.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              
              <div className="absolute top-3 left-3">
                <Badge className={`border ${getTypeColor()}`}>
                  <div className="flex items-center gap-2">
                    {getTypeIcon()}
                    <span className="font-semibold">Spot</span>
                  </div>
                </Badge>
              </div>
              
              <div className="absolute top-3 right-3">
                <div className="bg-black/70 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className="text-white text-sm font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {getTimeAgo(match.timestamp)}
                  </span>
                </div>
              </div>
              
              <div className="absolute bottom-3 left-3">
                <div className="bg-purple-500 rounded-full px-3 py-1">
                  <span className="text-white text-sm font-semibold flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Favorited
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-5">
              <h3 className="font-bold text-lg text-gray-900 mb-2">
                {match.name}
              </h3>
              
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={16} className="text-gray-500" />
                <span className="text-sm text-gray-600">Added to favorites</span>
              </div>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                You liked this spot! Check it out and explore what it has to offer.
              </p>
              
              <div className="flex gap-2">
                <Button 
                  variant="primary" 
                  className="flex-1"
                  onClick={handleViewDetails}
                >
                  Explore
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                >
                  <MapPin size={16} />
                  Directions
                </Button>
              </div>
            </div>
          </>
        )
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
      {renderContent()}
    </div>
  )
}

export default MatchCard