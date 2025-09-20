'use client'

import { useState, useEffect } from 'react'
import { ApiService } from '@/lib/api'
import LoadingSpinner from '../components/LoadingSpinner'
import Header from '../components/Header'
import TabNavigation from './components/TabNavigation'
import EmptyState from './components/EmptyState'
import SwipeCard from './components/SwipeCard'
import SwipeControls from './components/SwipeControls'
import MatchModal from './components/MatchModal'
import type { Apartment, Person, Spot } from '@/lib/api'

type TabType = 'apartments' | 'people' | 'spots'
type ItemType = Apartment | Person | Spot

export default function SwipePage() {
  const [activeTab, setActiveTab] = useState<TabType>('apartments')
  const [items, setItems] = useState<ItemType[]>([])
  const [loading, setLoading] = useState(true)
  const [showMatchModal, setShowMatchModal] = useState(false)
  const [matchedItem, setMatchedItem] = useState<ItemType | null>(null)

  useEffect(() => {
    loadItems(activeTab)
  }, [activeTab])

  const loadItems = async (type: TabType) => {
    setLoading(true)
    try {
      let response
      switch (type) {
        case 'apartments':
          response = await ApiService.getApartmentFeed()
          setItems(response || [])
          break
        case 'people':
          response = await ApiService.getPeopleFeed()
          setItems(response || [])
          break
        case 'spots':
          response = await ApiService.getSpotsFeed()
          setItems(response || [])
          break
      }
    } catch (error) {
      console.error('Failed to load items:', error)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  const handleSwipe = async (action: 'like' | 'pass') => {
    if (items.length === 0) return

    const currentItem = items[0]
    const remainingItems = items.slice(1)
    const direction = action === 'like' ? 'right' : 'left'

    try {
      let response
      switch (activeTab) {
        case 'apartments':
          response = await ApiService.swipeApartment(currentItem.id, direction)
          break
        case 'people':
          response = await ApiService.swipePerson(currentItem.id, direction)
          break
        case 'spots':
          response = await ApiService.swipeSpot(currentItem.id, direction)
          break
      }

      if (response?.match && action === 'like') {
        setMatchedItem(currentItem)
        setShowMatchModal(true)
      }

      setItems(remainingItems)

      // Load more items if running low
      if (remainingItems.length <= 2) {
        loadItems(activeTab)
      }
    } catch (error) {
      console.error('Swipe failed:', error)
      setItems(remainingItems) // Still update UI
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 pt-6">
        <TabNavigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
        />

        <div className="flex justify-center items-center min-h-[600px] mt-6">
          {loading ? (
            <LoadingSpinner />
          ) : items.length === 0 ? (
            <EmptyState activeTab={activeTab} onRefresh={() => loadItems(activeTab)} />
          ) : (
            <div className="relative w-full max-w-sm">
              {items.slice(0, 3).map((item, index) => (
                <SwipeCard
                  key={item.id}
                  item={item}
                  type={activeTab}
                  isTopCard={index === 0}
                  onSwipe={index === 0 ? handleSwipe : () => {}}
                  style={{
                    zIndex: 3 - index,
                    transform: `scale(${1 - index * 0.05}) translateY(${index * 10}px)`,
                  }}
                />
              ))}
              
              {items.length > 0 && (
                <SwipeControls
                  onPass={() => handleSwipe('pass')}
                  onLike={() => handleSwipe('like')}
                />
              )}
                  </div>
                )}
              </div>
            </div>

      <MatchModal
        isOpen={showMatchModal}
        item={matchedItem}
        type={activeTab}
        onClose={() => setShowMatchModal(false)}
      />
    </div>
  )
}