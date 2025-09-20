'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ApiService, { User, Apartment, Person, Spot } from '@/lib/services/api';
import SwipeCard from './components/SwipeCard';
import TabNavigation from './components/TabNavigation';
import SwipeControls from './components/SwipeControls';
import MatchModal from './components/MatchModal';
import './styles/swipe.css';

type TabType = 'apartments' | 'people' | 'spots';
type ItemType = Apartment | Person | Spot;

export default function SwipePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('apartments');
  const [currentItems, setCurrentItems] = useState<ItemType[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [matchModal, setMatchModal] = useState<{
    isOpen: boolean;
    match: (ItemType & { is_mutual?: boolean }) | null;
    type: 'apartment' | 'person' | 'spot' | null;
  }>({
    isOpen: false,
    match: null,
    type: null
  });
  const [stats, setStats] = useState({
    apartments: 0,
    people: 0,
    spots: 0
  });

  // Check authentication and get user
  useEffect(() => {
    const initializeUser = async () => {
      try {
        // Check if user is authenticated
        const token = localStorage.getItem('auth_token');
        if (!token) {
          router.push('/login');
          return;
        }

        // Validate token and get user
        const tokenValid = await ApiService.validateToken();
        if (!tokenValid.valid) {
          localStorage.removeItem('auth_token');
          router.push('/login');
          return;
        }

        const userResponse = await ApiService.getCurrentUser();
        if (!userResponse.success) {
          router.push('/login');
          return;
        }

        const user = userResponse.user;
        setCurrentUser(user);
        
        // Check if user needs onboarding
        if (!user.city || !user.interests || user.interests.length === 0) {
          router.push('/onboarding'); // Redirect to your onboarding page
          return;
        }
        
      } catch (error) {
        console.error('Failed to initialize user:', error);
        localStorage.removeItem('auth_token');
        router.push('/login');
      }
    };

    initializeUser();
  }, [router]);

  // Load items when tab changes or user loads
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
        
        // Update stats
        setStats(prev => ({
          ...prev,
          [type]: items.length
        }));
      } else {
        console.error(`Failed to load ${type}:`, response);
        setCurrentItems([]);
      }
    } catch (error) {
      console.error(`Error loading ${type}:`, error);
      setCurrentItems([]);
      
      // If auth error, redirect to login
      if (error instanceof Error && error.message.includes('auth')) {
        localStorage.removeItem('auth_token');
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (direction: 'left' | 'right', item?: ItemType) => {
    if (currentItems.length === 0) return;
    
    const currentItem = item || currentItems[0];
    const newItems = currentItems.slice(1);
    
    try {
      let response;
      
      switch (activeTab) {
        case 'apartments':
          response = await ApiService.swipeApartment(currentItem.id, direction);
          break;
        case 'people':
          response = await ApiService.swipePerson(currentItem.id, direction);
          break;
        case 'spots':
          response = await ApiService.swipeSpot(currentItem.id, direction);
          break;
      }

      if (response.success && direction === 'right' && response.is_match) {
        // Show match modal
        setMatchModal({
          isOpen: true,
          match: {
            ...currentItem,
            is_mutual: response.is_mutual || false
          },
          type: activeTab.slice(0, -1) as 'apartment' | 'person' | 'spot'
        });
      }

      // Update items list
      setCurrentItems(newItems);
      
      // Load more items if running low
      if (newItems.length <= 2) {
        loadItems(activeTab);
      }

    } catch (error) {
      console.error('Swipe error:', error);
      // Still update UI even if API call fails
      setCurrentItems(newItems);
    }
  };

  const handleSwipeLeft = useCallback(() => {
    handleSwipe('left');
  }, [currentItems, activeTab]);

  const handleSwipeRight = useCallback(() => {
    handleSwipe('right');
  }, [currentItems, activeTab]);

  const handleTabChange = (newTab: TabType) => {
    setActiveTab(newTab);
    setCurrentItems([]); // Clear current items
  };

  const closeMatchModal = () => {
    setMatchModal({ isOpen: false, match: null, type: null });
  };

  const handleStartChat = () => {
    closeMatchModal();
    // Navigate to chat page - adjust route as needed
    router.push('/chat');
  };

  const handleKeepSwiping = () => {
    closeMatchModal();
  };

  const renderEmptyState = () => {
    const emptyMessages = {
      apartments: {
        icon: '🏠',
        title: 'No more apartments',
        subtitle: 'Check back later for new listings!'
      },
      people: {
        icon: '👥', 
        title: 'No more people nearby',
        subtitle: 'Try expanding your search area'
      },
      spots: {
        icon: '📍',
        title: 'No more places',
        subtitle: 'You\'ve seen all the spots in your area!'
      }
    };

    const message = emptyMessages[activeTab];

    return (
      <div className="empty-state">
        <div className="empty-icon">{message.icon}</div>
        <div className="empty-title">{message.title}</div>
        <div className="empty-subtitle">{message.subtitle}</div>
        <button 
          className="refresh-button"
          onClick={() => loadItems(activeTab)}
        >
          Refresh
        </button>
      </div>
    );
  };

  const renderLoadingState = () => (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <div>Loading {activeTab}...</div>
    </div>
  );

  // Show loading while checking auth
  if (!currentUser) {
    return (
      <div className="swipe-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <div>Loading your profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="swipe-page">
      {/* Header with tabs and stats */}
      <div className="swipe-header">
        <TabNavigation 
          activeTab={activeTab}
          onTabChange={handleTabChange}
          stats={stats}
        />
        
        <div className="swipe-stats">
          <div className="stat-item">
            <span className="stat-number">{stats[activeTab]}</span>
            <span>Available</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{currentUser.name}</span>
            <span>Welcome back!</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{currentUser.city}</span>
            <span>Your city</span>
          </div>
        </div>
      </div>

      {/* Main swipe container */}
      <div className="swipe-container">
        {loading ? (
          renderLoadingState()
        ) : currentItems.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="swipe-stack">
            {currentItems.slice(0, 3).map((item, index) => (
              <SwipeCard
                key={`${item.id}-${index}`}
                item={item}
                type={activeTab.slice(0, -1) as 'apartment' | 'person' | 'spot'}
                onSwipeLeft={index === 0 ? handleSwipeLeft : () => {}}
                onSwipeRight={index === 0 ? handleSwipeRight : () => {}}
                isTopCard={index === 0}
              />
            ))}
          </div>
        )}
      </div>

      {/* Control buttons */}
      {currentItems.length > 0 && (
        <SwipeControls
          onPass={handleSwipeLeft}
          onLike={handleSwipeRight}
          onSuperLike={handleSwipeRight} // Same as like for now
          disabled={loading}
        />
      )}

      {/* Match modal */}
      <MatchModal
        isOpen={matchModal.isOpen}
        match={matchModal.match}
        type={matchModal.type}
        onClose={closeMatchModal}
        onStartChat={handleStartChat}
        onKeepSwiping={handleKeepSwiping}
      />
    </div>
  );
}