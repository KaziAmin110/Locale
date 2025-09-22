"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Settings, Shield, Edit3, MapPin, Briefcase, Home, ChevronRight, Plus, Check, X, Camera } from "lucide-react";
import Image from "next/image";
import { ApiService } from "../../lib/api";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  bio: string;
  photos: string[];
  interests: string[];
  budget_min: number;
  budget_max: number;
  looking_for: string[] | null;
  location: string;
  created_at: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('preview');

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const userData = await ApiService.getProfile();
      setProfile(userData);
    } catch (err: any) {
      console.error('Error loading profile:', err);
      setError('Failed to load profile. Please complete your onboarding first.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-primary mb-4">{error || 'Profile not found'}</p>
          <button
            onClick={() => window.location.href = '/onboarding'}
            className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Complete Your Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Tinder Style */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => window.history.back()}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Profile</h1>
            <button
              onClick={() => window.location.href = '/settings'}
              className="p-2 -mr-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Settings className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-lg mx-auto">
        {/* Toggle Tabs */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="flex">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex-1 py-3 text-sm font-semibold transition-colors relative ${
                activeTab === 'preview' 
                  ? 'text-primary' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Preview
              {activeTab === 'preview' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('edit')}
              className={`flex-1 py-3 text-sm font-semibold transition-colors relative ${
                activeTab === 'edit' 
                  ? 'text-primary' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Edit Profile
              {activeTab === 'edit' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
              )}
            </button>
          </div>
        </div>

        {activeTab === 'preview' ? (
          /* Preview Mode - How others see you */
          <div className="bg-white">
            {/* Main Photo Section */}
            <div className="relative aspect-[3/4]">
              <Image
                src={profile.photos[0] || '/profile.jpg'}
                alt={profile.name}
                fill
                className="object-cover"
                priority
              />
              {/* Gradient Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent h-48">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <div className="flex items-baseline gap-2 mb-1">
                    <h2 className="text-3xl font-bold">{profile.name}</h2>
                    <span className="text-2xl">{profile.age}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="p-4 space-y-4">
              {/* Bio */}
              {profile.bio && (
                <div>
                  <p className="text-gray-800 leading-relaxed">{profile.bio}</p>
                </div>
              )}

              {/* Looking For - Tinder Style */}
              {profile.looking_for && profile.looking_for.length > 0 && (
                <div className="py-3 border-t border-gray-200">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Looking for</h3>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(profile.looking_for) ? profile.looking_for : [profile.looking_for]).map((item, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-full text-sm font-medium"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Budget Range */}
              <div className="py-3 border-t border-gray-200">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Budget Range</h3>
                <div className="flex items-center gap-2">
                  <Home className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-800 font-medium">
                    ${profile.budget_min.toLocaleString()} - ${profile.budget_max.toLocaleString()}/month
                  </span>
                </div>
              </div>

              {/* Interests - Tinder Passions Style */}
              <div className="py-3 border-t border-gray-200">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary rounded-full text-sm font-medium border border-primary/20"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* More Photos */}
              {profile.photos.length > 1 && (
                <div className="py-3 border-t border-gray-200">
                  <div className="grid grid-cols-3 gap-1 rounded-lg overflow-hidden">
                    {profile.photos.slice(1, 7).map((photo, index) => (
                      <div key={index} className="relative aspect-square">
                        <Image
                          src={photo}
                          alt={`Photo ${index + 2}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Edit Mode */
          <div className="bg-gray-50">
            {/* Photo Grid */}
            <div className="bg-white p-4">
              <div className="grid grid-cols-3 gap-2">
                {[...Array(9)].map((_, index) => {
                  const photo = profile.photos[index];
                  return (
                    <div
                      key={index}
                      className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 hover:border-primary transition-colors cursor-pointer group"
                    >
                      {photo ? (
                        <>
                          <Image
                            src={photo}
                            alt={`Photo ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1.5 bg-white rounded-full shadow-lg">
                              <X className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Plus className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center">
                Add at least 2 photos to continue
              </p>
            </div>

            {/* Edit Sections */}
            <div className="mt-2 bg-white">
              {/* About Section */}
              <button
                onClick={() => window.location.href = '/onboarding'}
                className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Edit3 className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">About {profile.name}</p>
                    <p className="text-sm text-gray-500 line-clamp-1">{profile.bio || 'Add bio'}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              {/* Interests Section */}
              <button
                onClick={() => window.location.href = '/onboarding'}
                className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Interests</p>
                    <p className="text-sm text-gray-500">{profile.interests.length} selected</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              {/* Living Preferences */}
              <button
                onClick={() => window.location.href = '/onboarding'}
                className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors border-b border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Home className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Living Preferences</p>
                    <p className="text-sm text-gray-500">Budget, roommate type</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              {/* Verification */}
              <button
                className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Verify Your Profile</p>
                    <p className="text-sm text-gray-500">Build trust with verification</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Profile Completeness */}
            <div className="mt-6 mx-4 p-4 bg-white rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Profile Strength</span>
                <span className="text-sm font-bold text-primary">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-secondary to-primary h-2 rounded-full transition-all" style={{ width: '85%' }}></div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="p-4">
              <button
                onClick={() => window.location.href = '/'}
                className="w-full py-3 bg-gradient-to-r from-primary to-primary-hover text-white font-semibold rounded-full shadow-md hover:shadow-lg transition-all animate-scaleIn"
              >
                Start Matching
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}