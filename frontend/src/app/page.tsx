'use client'

import { useEffect } from 'react'
import { Heart, ArrowRight, MapPin, Users, Home } from 'lucide-react'
import Link from 'next/link'
import Button from './components/Button'

export default function HomePage() {
  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('token')
    if (token) {
      // Redirect to appropriate page based on onboarding status
      window.location.href = '/swipe'
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
      {/* Navigation */}
      <nav className="p-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Heart size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">CityMate</span>
          </div>
          
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button variant="primary">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Find Your New
          <span className="text-red-500"> City Life</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Moving to a new city? Discover apartments, meet people, and explore places 
          all in one place. Your perfect city life is just a swipe away.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <Button size="xl" className="flex items-center gap-2">
              Start Exploring
              <ArrowRight size={20} />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="xl">
              I Already Have an Account
            </Button>
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Home size={32} className="text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Find Your Home</h3>
            <p className="text-gray-600">
              Swipe through apartments and homes that match your budget and preferences
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users size={32} className="text-pink-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Meet People</h3>
            <p className="text-gray-600">
              Connect with like-minded people in your new city and build lasting friendships
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MapPin size={32} className="text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Explore Places</h3>
            <p className="text-gray-600">
              Discover the best restaurants, cafes, and activities in your area
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}