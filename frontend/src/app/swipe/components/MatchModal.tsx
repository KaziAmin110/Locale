'use client';

import Image from 'next/image';
import { Apartment, Person, Spot } from '@/lib/services/api';

interface MatchModalProps {
  isOpen: boolean;
  match: (Apartment | Person | Spot) & { is_mutual?: boolean } | null;
  type: 'apartment' | 'person' | 'spot' | null;
  onClose: () => void;
  onStartChat: () => void;
  onKeepSwiping: () => void;
}

const MatchModal: React.FC<MatchModalProps> = ({ 
  isOpen, 
  match, 
  type, 
  onClose, 
  onStartChat, 
  onKeepSwiping 
}) => {
  if (!isOpen || !match) return null;

  const getMatchMessage = () => {
    switch (type) {
      case 'apartment':
        return `You liked this apartment! Time to reach out.`;
      case 'person':
        const person = match as Person & { is_mutual?: boolean };
        return person.is_mutual 
          ? `It's a mutual match! You both liked each other.`
          : `You liked ${(match as Person).name}! Waiting for them to see you.`;
      case 'spot':
        return `Added to your favorites! Perfect spot to explore.`;
      default:
        return 'Great choice!';
    }
  };

  const getActionButtons = () => {
    if (type === 'person' && (match as Person & { is_mutual?: boolean }).is_mutual) {
      return (
        <>
          <button className="match-button primary" onClick={onStartChat}>
            Start Chatting
          </button>
          <button className="match-button secondary" onClick={onKeepSwiping}>
            Keep Swiping
          </button>
        </>
      );
    }
    
    return (
      <button className="match-button primary" onClick={onKeepSwiping}>
        Keep Exploring
      </button>
    );
  };

  const getTitle = () => {
    if (type === 'person' && (match as Person & { is_mutual?: boolean }).is_mutual) {
      return "🎉 It's a Match!";
    }
    return "✨ Great Choice!";
  };

  const getName = () => {
    switch (type) {
      case 'apartment':
        return (match as Apartment).address;
      case 'person':
        return (match as Person).name;
      case 'spot':
        return (match as Spot).name;
      default:
        return '';
    }
  };

  return (
    <div className="match-modal" onClick={onClose}>
      <div className="match-content" onClick={e => e.stopPropagation()}>
        <div className="match-title">
          {getTitle()}
        </div>
        
        <div className="match-subtitle">
          {getMatchMessage()}
        </div>
        
        {match.images && match.images[0] && (
          <div style={{ position: 'relative', width: '100px', height: '100px', margin: '16px auto' }}>
            <Image
              src={match.images[0]} 
              alt={getName()}
              fill
              style={{ 
                borderRadius: '50%',
                objectFit: 'cover'
              }}
              className="match-image"
            />
          </div>
        )}
        
        <div className="match-buttons">
          {getActionButtons()}
        </div>
      </div>
    </div>
  );
};

export default MatchModal;