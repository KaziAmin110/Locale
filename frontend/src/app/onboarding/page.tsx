<<<<<<< HEAD
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FormData {
  name: string;
  age: string;
  location: string;
  budgetMin: string;
  budgetMax: string;
  bedrooms: string;
  interests: string[];
  lookingFor: string;
}

const INTERESTS = [
  'Food & Dining', 'Fitness & Sports', 'Art & Culture', 'Music & Nightlife',
  'Travel & Adventure', 'Technology', 'Photography', 'Reading',
  'Gaming', 'Outdoor Activities', 'Movies & TV', 'Cooking',
  'Coffee & Tea', 'Wine & Cocktails', 'Fashion', 'Pets'
];

const LOOKING_FOR_OPTIONS = [
  'Apartment hunting', 'Finding roommates', 'Exploring local spots', 'All of the above'
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    age: '',
    location: '',
    budgetMin: '',
    budgetMax: '',
    bedrooms: '',
    interests: [],
    lookingFor: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5002/api/onboarding', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/dashboard');
      } else {
        console.error('Onboarding failed');
        router.push('/dashboard'); // Continue anyway for demo
      }
    } catch (error) {
      console.error('Error during onboarding:', error);
      router.push('/dashboard'); // Continue anyway for demo
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name.trim() && formData.age.trim();
      case 2:
        return formData.location.trim();
      case 3:
        return formData.interests.length >= 3;
      case 4:
        return formData.budgetMin.trim() && formData.budgetMax.trim() && formData.bedrooms.trim() && formData.lookingFor.trim();
      default:
        return false;
    }
  };

  
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white mb-4">Tell us about yourself</h2>
              <p className="text-white/70 text-xl">Let's start with the basics</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-white/90 text-lg font-semibold mb-3">
                  What's your name?
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-6 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-lg"
                />
              </div>

              <div>
                <label className="block text-white/90 text-lg font-semibold mb-3">
                  How old are you?
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => updateFormData('age', e.target.value)}
                  placeholder="Enter your age"
                  min="18"
                  max="100"
                  className="w-full px-6 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-lg"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white mb-4">Where are you looking?</h2>
              <p className="text-white/70 text-xl">Help us find the perfect location for you</p>
            </div>

            <div>
              <label className="block text-white/90 text-lg font-semibold mb-3">
                What city or area interests you?
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => updateFormData('location', e.target.value)}
                placeholder="e.g., San Francisco, CA or Downtown Seattle"
                className="w-full px-6 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">🏙️</span>
                  </div>
                  <h3 className="text-white font-semibold mb-2">Urban Living</h3>
                  <p className="text-white/70 text-sm">City center, walkable, vibrant</p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">🌳</span>
                  </div>
                  <h3 className="text-white font-semibold mb-2">Suburban</h3>
                  <p className="text-white/70 text-sm">Quiet, spacious, family-friendly</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white mb-4">What are your interests?</h2>
              <p className="text-white/70 text-xl">Select at least 3 interests that describe you</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {INTERESTS.map((interest) => (
                <button
                  key={interest}
                  onClick={() => handleInterestToggle(interest)}
                  className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                    formData.interests.includes(interest)
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-transparent text-white'
                      : 'bg-white/10 backdrop-blur-sm border-white/20 text-white/70 hover:bg-white/20'
                  }`}
                >
                  <span className="text-sm font-medium">{interest}</span>
                </button>
              ))}
            </div>

            <div className="text-center">
              <p className="text-white/60 text-sm">
                Selected: {formData.interests.length} interests
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white mb-4">Budget & Preferences</h2>
              <p className="text-white/70 text-xl">Help us find the perfect match for your needs</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-white/90 text-lg font-semibold mb-3">
                  Monthly Budget Range
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="number"
                      value={formData.budgetMin}
                      onChange={(e) => updateFormData('budgetMin', e.target.value)}
                      placeholder="Min ($)"
                      className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      value={formData.budgetMax}
                      onChange={(e) => updateFormData('budgetMax', e.target.value)}
                      placeholder="Max ($)"
                      className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-white/90 text-lg font-semibold mb-3">
                  Preferred Bedrooms
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {['Studio', '1 Bedroom', '2+ Bedrooms'].map((option) => (
                    <button
                      key={option}
                      onClick={() => updateFormData('bedrooms', option)}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        formData.bedrooms === option
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-transparent text-white'
                          : 'bg-white/10 backdrop-blur-sm border-white/20 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      <span className="font-medium">{option}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white/90 text-lg font-semibold mb-3">
                  What are you looking for?
                </label>
                <div className="space-y-3">
                  {LOOKING_FOR_OPTIONS.map((option) => (
                    <button
                      key={option}
                      onClick={() => updateFormData('lookingFor', option)}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                        formData.lookingFor === option
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-transparent text-white'
                          : 'bg-white/10 backdrop-blur-sm border-white/20 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      <span className="font-medium">{option}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white/70 text-sm">Step {currentStep} of 4</span>
            <span className="text-white/70 text-sm">{Math.round((currentStep / 4) * 100)}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 mb-8">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="px-8 py-4 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-2xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/30"
          >
            Back
          </button>

          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!isStepValid() || isSubmitting}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105"
            >
              {isSubmitting ? 'Creating Profile...' : 'Complete Setup'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
