'use client';

import { useEffect, useRef } from 'react';
import { SwipeGestureHandler } from '@/lib/utils/swipeHelpers';
import { Apartment, Person, Spot } from '@/lib/services/api';
import Image from 'next/image';

interface SwipeCardProps {
  item: Apartment | Person | Spot;
  type: 'apartment' | 'person' | 'spot';
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  isTopCard: boolean;
}

const SwipeCard: React.FC<SwipeCardProps> = ({ 
  item, 
  type, 
  onSwipeLeft, 
  onSwipeRight, 
  isTopCard 
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const gestureHandlerRef = useRef<SwipeGestureHandler | null>(null);

  useEffect(() => {
    if (isTopCard && cardRef.current) {
      gestureHandlerRef.current = new SwipeGestureHandler(
        cardRef.current,
        {
          onSwipeLeft,
          onSwipeRight
        }
      );
    }

    return () => {
      if (gestureHandlerRef.current) {
        gestureHandlerRef.current.destroy();
      }
    };
  }, [isTopCard, onSwipeLeft, onSwipeRight]);

  const renderCardContent = () => {
    switch (type) {
      case 'apartment':
        const apartment = item as Apartment;
        return (
          <>
            <div className="card-image">
              <Image
                src={apartment.photos?.[0] || '/api/placeholder/400/300'}
                alt={apartment.title}
                fill
                style={{ objectFit: 'cover' }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/api/placeholder/400/300';
                }}
              />
            </div>
            <div className="card-content">
              <div>
                <h3 className="card-title">{apartment.title}</h3>
                <p className="card-subtitle">
                  ${apartment.price}/month • {apartment.bedrooms}BR/{apartment.bathrooms}BA
                </p>
                <div className="card-details">
                  <span className="detail-tag">📍 {apartment.address}</span>
                </div>
                <div className="card-interests">
                  {apartment.amenities?.slice(0, 4).map((amenity, index) => (
                    <span key={index} className="interest-tag">{amenity}</span>
                  ))}
                </div>
              </div>
            </div>
          </>
        );

      case 'person':
        const person = item as Person;
        return (
          <>
            <div className="card-image">
              <Image
                src={person.photos?.[0] || '/api/placeholder/400/400'}
                alt={person.name}
                fill
                style={{ objectFit: 'cover' }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/api/placeholder/400/400';
                }}
              />
            </div>
            <div className="card-content">
              <div>
                <h3 className="card-title">{person.name}, {person.age}</h3>
                <p className="card-subtitle">{person.bio}</p>
                <div className="card-interests">
                  {person.interests?.slice(0, 5).map((interest, index) => (
                    <span key={index} className="interest-tag">{interest}</span>
                  ))}
                </div>
              </div>
            </div>
          </>
        );

      case 'spot':
        const spot = item as Spot;
        return (
          <>
            <div className="card-image">
              <Image
                src={spot.photos?.[0] || '/api/placeholder/600/400'}
                alt={spot.name}
                fill
                style={{ objectFit: 'cover' }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/api/placeholder/600/400';
                }}
              />
            </div>
            <div className="card-content">
              <div>
                <h3 className="card-title">{spot.name}</h3>
                <p className="card-subtitle">
                  {spot.category?.replace('_', ' ')} • ⭐ {spot.rating}
                </p>
                <div className="card-details">
                  <span className="detail-tag">💰 {'$'.repeat(spot.price_level || 1)}</span>
                  <span className="detail-tag">📍 {spot.address}</span>
                </div>
                <p style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                  {spot.description}
                </p>
              </div>
            </div>
          </>
        );

      default:
        return <div>Unknown card type</div>;
    }
  };

  return (
    <div 
      ref={cardRef}
      className="swipe-card"
      style={{
        zIndex: isTopCard ? 10 : 1,
        opacity: isTopCard ? 1 : 0.8,
        transform: isTopCard ? 'scale(1)' : 'scale(0.95)',
      }}
    >
      {renderCardContent()}
    </div>
  );
};

export default SwipeCard;