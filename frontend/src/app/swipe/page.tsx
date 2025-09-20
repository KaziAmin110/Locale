'use client';

import { useState, useEffect } from 'react';
import SwipeCard from './components/SwipeCard';
import MatchModal from './components/MatchModal';
import ApiService from '@/lib/services/api';
import { Apartment, Person, Spot } from '@/lib/services/api';

type TabType = 'apartments' | 'people' | 'spots';

export default function SwipePage() {
  const [activeTab, setActiveTab] = useState<TabType>('apartments');
  const [currentItems, setCurrentItems] = useState<(Apartment | Person | Spot)[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [match, setMatch] = useState<(Apartment | Person | Spot) & { is_mutual?: boolean } | null>(null);
  const [matchType, setMatchType] = useState<'apartment' | 'person' | 'spot' | null>(null);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<{name: string, city: string} | null>(null);
  const [stats, setStats] = useState({
    apartments: 0,
    people: 0,
    spots: 0
  });
  const [dataSources, setDataSources] = useState<{
    apartments: string;
    people: string;
    spots: string;
  }>({
    apartments: 'loading',
    people: 'loading',
    spots: 'loading'
  });

  // Load user data
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  // Load items when tab changes
  useEffect(() => {
    if (currentUser) {
      loadItems(activeTab);
    }
  }, [activeTab, currentUser]);

  const loadItems = async (type: TabType) => {
    setLoading(true);
    try {
      let response;
      
      switch (type) {
        case 'apartments':
          response = await ApiService.getApartmentsFeed();
          break;
        case 'people':
          response = await ApiService.getPeopleFeed();
          break;
        case 'spots':
          response = await ApiService.getSpotsFeed();
          break;
      }

      if (response.success) {
        const items = response[type] || [];
        setCurrentItems(items);
        setCurrentIndex(0);
        
        // Update data source info
        setDataSources(prev => ({
          ...prev,
          [type]: response.data_source || 'unknown'
        }));
        
        // Update stats
        setStats(prev => ({
          ...prev,
          [type]: items.length
        }));
      }
    } catch (error) {
      console.error(`Error loading ${type}:`, error);
      setCurrentItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    if (currentIndex < currentItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Load more items
      loadItems(activeTab);
    }
  };

  const handleMatch = (item: Apartment | Person | Spot, isMutual: boolean = false) => {
    setMatch({ ...item, is_mutual: isMutual });
    setMatchType(activeTab === 'apartments' ? 'apartment' : activeTab === 'people' ? 'person' : 'spot');
    setShowMatchModal(true);
  };

  const getDataSourceIcon = (source: string) => {
    switch (source) {
      case 'real':
      case 'rentspree':
      case 'zillow':
      case 'google':
      case 'yelp':
        return '🟢';
      case 'mock':
        return '🟡';
      case 'loading':
        return '⏳';
      default:
        return '🔴';
    }
  };

  if (loading && currentItems.length === 0) {
    return (
      <div className="swipe-page">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (currentItems.length === 0) {
    return (
      <div className="swipe-page">
        <div className="no-items">No more items available</div>
      </div>
    );
  }

  return (
    <div className="swipe-page">
      <div className="swipe-header">
        <div className="tabs">
          <button 
            className={activeTab === 'apartments' ? 'active' : ''}
            onClick={() => setActiveTab('apartments')}
          >
            Apartments {getDataSourceIcon(dataSources.apartments)}
          </button>
          <button 
            className={activeTab === 'people' ? 'active' : ''}
            onClick={() => setActiveTab('people')}
          >
            People {getDataSourceIcon(dataSources.people)}
          </button>
          <button 
            className={activeTab === 'spots' ? 'active' : ''}
            onClick={() => setActiveTab('spots')}
          >
            Spots {getDataSourceIcon(dataSources.spots)}
          </button>
        </div>
        
        <div className="stats">
          <div className="stat">
            <span className="number">{stats[activeTab]}</span>
            <span className="label">Available</span>
          </div>
          <div className="stat">
            <span className="number">{currentIndex + 1}</span>
            <span className="label">Current</span>
          </div>
        </div>
      </div>

      <div className="swipe-container">
        <SwipeCard
          item={currentItems[currentIndex]}
          type={activeTab === 'apartments' ? 'apartment' : activeTab === 'people' ? 'person' : 'spot'}
          onSwipeLeft={() => handleSwipe('left')}
          onSwipeRight={() => handleSwipe('right')}
          isTopCard={true}
        />
      </div>

      <MatchModal
        isOpen={showMatchModal}
        match={match}
        type={matchType}
        onClose={() => setShowMatchModal(false)}
        onStartChat={() => {
          setShowMatchModal(false);
          // Navigate to chat
        }}
        onKeepSwiping={() => {
          setShowMatchModal(false);
          handleSwipe('right');
        }}
      />
    </div>
  );
}