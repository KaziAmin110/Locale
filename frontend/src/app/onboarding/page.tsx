'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface OnboardingData {
  name: string;
  age: number;
  email: string;
  budget_min: number;
  budget_max: number;
  location: string;
  interests: string[];
  bio: string;
  looking_for: string[];
  photos: string[];
}

const OnboardingPage = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    name: '',
    age: 25,
    email: '',
    budget_min: 1000,
    budget_max: 3000,
    location: '',
    interests: [],
    bio: '',
    looking_for: [],
    photos: []
  });

  const interestOptions = [
    'Technology', 'Music', 'Travel', 'Sports', 'Art', 'Cooking', 
    'Reading', 'Gaming', 'Fitness', 'Photography', 'Movies', 'Nature',
    'Dancing', 'Writing', 'Fashion', 'Food', 'Coffee', 'Hiking'
  ];

  const lookingForOptions = [
    'Apartments', 'Roommates', 'Local Spots'
  ];

  const handleInputChange = (field: keyof OnboardingData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleInterestToggle = (interest: string) => {
    setData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleLookingForToggle = (option: string) => {
    setData(prev => ({
      ...prev,
      looking_for: prev.looking_for.includes(option)
        ? prev.looking_for.filter(o => o !== option)
        : [...prev.looking_for, option]
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result as string;
            setData(prev => ({
              ...prev,
              photos: [...prev.photos, result]
            }));
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const removeImage = (index: number) => {
    setData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        if (result.token) {
          localStorage.setItem('token', result.token);
          localStorage.setItem('user', JSON.stringify(result.user || data));
        }
        router.push('/dashboard');
      } else {
        // Handle specific error cases
        if (result.error === 'User with this email already exists') {
          // User already exists (probably from Google OAuth), just redirect to dashboard
          console.log('User already exists, redirecting to dashboard');
          router.push('/dashboard');
        } else {
          console.error('Registration failed:', result.error);
          // Show error to user but still redirect for demo purposes
          alert(`Registration failed: ${result.error}`);
          router.push('/dashboard');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      // For demo purposes, still redirect to dashboard even if API fails
      router.push('/dashboard');
    }
  };

  const nextStep = () => {
    if (step < 5) setStep(step + 1);
    else handleSubmit();
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return 'Tell us about yourself';
      case 2: return 'What\'s your budget?';
      case 3: return 'What are your interests?';
      case 4: return 'Add your photos';
      case 5: return 'What are you looking for?';
      default: return 'Complete your profile';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center mr-3">
                <span className="text-white text-lg font-bold">C</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">CityMate</h1>
            </div>
            <div className="text-sm text-gray-500">
              Step {step} of 5
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-gray-100 h-1">
        <div 
          className="bg-gray-900 h-1 transition-all duration-300"
          style={{ width: `${(step / 5) * 100}%` }}
        ></div>
      </div>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {getStepTitle()}
          </h2>
          <p className="text-gray-600">
            {step === 1 && 'Let\'s start with the basics'}
            {step === 2 && 'Help us find the perfect place for your budget'}
            {step === 3 && 'Tell us what you love to do'}
            {step === 4 && 'Show people who you are'}
            {step === 5 && 'Choose what you want to discover'}
          </p>
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              <input
                type="number"
                value={data.age}
                onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                min="18"
                max="100"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={data.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                placeholder="e.g., San Francisco, CA"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                value={data.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                placeholder="Tell us a bit about yourself..."
                rows={4}
              />
            </div>
          </div>
        )}

        {/* Step 2: Budget */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Budget (per month)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={data.budget_min}
                  onChange={(e) => handleInputChange('budget_min', parseInt(e.target.value))}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                  min="0"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Budget (per month)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={data.budget_max}
                  onChange={(e) => handleInputChange('budget_max', parseInt(e.target.value))}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors"
                  min={data.budget_min}
                  required
                />
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-medium text-gray-900 mb-2">Budget Range</h3>
              <p className="text-gray-600 text-sm">
                ${data.budget_min.toLocaleString()} - ${data.budget_max.toLocaleString()} per month
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Interests */}
        {step === 3 && (
          <div className="space-y-6">
            <p className="text-gray-600 text-center">
              Select all that apply. This helps us find better matches for you.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {interestOptions.map((interest) => (
                <button
                  key={interest}
                  onClick={() => handleInterestToggle(interest)}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                    data.interests.includes(interest)
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>

            {data.interests.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-medium text-gray-900 mb-2">Selected Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {data.interests.map((interest) => (
                    <span
                      key={interest}
                      className="bg-gray-900 text-white px-3 py-1 rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Photos */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="photo-upload"
              />
              <label htmlFor="photo-upload" className="cursor-pointer">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-16 w-16" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-gray-600 text-lg font-medium">Upload your photos</p>
                <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 10MB each</p>
              </label>
            </div>

            {data.photos.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {data.photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={photo}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-32 object-cover rounded-xl"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-medium text-gray-900 mb-2">Photo Tips</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Use clear, well-lit photos</li>
                <li>• Include photos that show your personality</li>
                <li>• Avoid group photos for your main photo</li>
              </ul>
            </div>
          </div>
        )}

        {/* Step 5: Looking For */}
        {step === 5 && (
          <div className="space-y-6">
            <p className="text-gray-600 text-center">
              What would you like to discover on CityMate?
            </p>
            
            <div className="space-y-4">
              {lookingForOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleLookingForToggle(option)}
                  className={`w-full p-6 rounded-xl border-2 text-left transition-all duration-200 ${
                    data.looking_for.includes(option)
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full border-2 mr-4 ${
                      data.looking_for.includes(option)
                        ? 'bg-white border-white'
                        : 'border-gray-300'
                    }`}>
                      {data.looking_for.includes(option) && (
                        <div className="w-2 h-2 bg-gray-900 rounded-full mx-auto mt-1"></div>
                      )}
                    </div>
                    <div>
                      <span className="font-semibold text-lg">{option}</span>
                      <p className="text-sm opacity-75 mt-1">
                        {option === 'Apartments' && 'Find your perfect place to live'}
                        {option === 'Roommates' && 'Connect with potential roommates'}
                        {option === 'Local Spots' && 'Discover amazing places in your city'}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {data.looking_for.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-medium text-gray-900 mb-2">You're looking for:</h3>
                <div className="flex flex-wrap gap-2">
                  {data.looking_for.map((option) => (
                    <span
                      key={option}
                      className="bg-gray-900 text-white px-3 py-1 rounded-full text-sm"
                    >
                      {option}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-12">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          
          <button
            onClick={nextStep}
            className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            {step === 5 ? 'Complete Setup' : 'Next'}
          </button>
        </div>
      </main>
    </div>
  );
};

export default OnboardingPage;