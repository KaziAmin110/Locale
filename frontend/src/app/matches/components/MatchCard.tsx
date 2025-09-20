'use client'

import Image from 'next/image'
import { MessageCircle, MapPin, Star } from 'lucide-react'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import type { Match, Person, Apartment, Spot } from '@/lib/api'

interface MatchCardProps {
  match: Match
}

const MatchCard = ({ match }: MatchCardProps) => {
  const getImage = () => {
    return match.item.images?.[0] || '/placeholder-image.jpg'
  }

  const handleChat = () => {
    if (match.type === 'person') {
      // Navigate to chat
      window.location.href = '/chat'
    }
  }

  const renderContent = () => {
    switch (match.type) {
      case 'apartment':
        const apartment = match.item as Apartment
        return (
          <>
            <div className="relative h-48">
              <Image
                src={getImage()}
                alt={apartment.address}
                fill
                className="object-cover"
              />
              <div className="absolute top-3 right-3">
                <Badge variant="white" className="font-semibold">
                  ${apartment.price}/mo
                </Badge>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={14} className="text-gray-500" />
                <span className="text-sm text-gray-600 truncate">{apartment.address}</span>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2">
                {apartment.bedrooms}BR • {apartment.bathrooms}BA
              </h3>
              
              <div className="flex gap-2 mb-4">
                {apartment.amenities?.slice(0, 2).map((amenity, index) => (
                  <Badge key={index} variant="gray" size="sm">
                    {amenity}
                  </Badge>
                ))}
              </div>
              
              <Button variant="outline" className="w-full">
                View Details
              </Button>
            </div>
          </>
        )

      case 'person':
        const person = match.item as Person
        return (
          <>
            <div className="relative h-48">
              <Image
                src={getImage()}
                alt={person.name}
                fill
                className="object-cover"
              />
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1">
                {person.name}, {person.age}
              </h3>
              
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {person.bio}
              </p>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {person.interests?.slice(0, 3).map((interest, index) => (
                  <Badge key={index} variant="primary" size="sm">
                    {interest}
                  </Badge>
                ))}
              </div>
              
              <Button 
                variant="primary" 
                className="w-full flex items-center gap-2"
                onClick={handleChat}
              >
                <MessageCircle size={16} />
                Message
              </Button>
            </div>
          </>
        )

      case 'spot':
        const spot = match.item as Spot
        return (
          <>
            <div className="relative h-48">
              <Image
                src={getImage()}
                alt={spot.name}
                fill
                className="object-cover"
              />
              <div className="absolute top-3 right-3">
                <Badge variant="white" className="flex items-center gap-1">
                  <Star size={12} className="fill-yellow-400 text-yellow-400" />
                  {spot.rating}
                </Badge>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                {spot.name}
              </h3>
              
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={14} className="text-gray-500" />
                <span className="text-sm text-gray-600 truncate">{spot.address}</span>
              </div>
              
              <div className="flex gap-2 mb-4">
                <Badge variant="gray" size="sm" className="capitalize">
                  {spot.category.replace('_', ' ')}
                </Badge>
              </div>
              
              <Button variant="outline" className="w-full">
                Get Directions
              </Button>
            </div>
          </>
        )
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {renderContent()}
    </div>
  )
}

export default MatchCard