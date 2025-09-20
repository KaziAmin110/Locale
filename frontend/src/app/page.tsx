export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-sm font-bold">C</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">CityMate</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">Sign in</button>
              <button className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium">Get started</button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Find your perfect place
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover apartments, connect with roommates, and explore local spots. 
            All powered by intelligent recommendations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-lg text-lg font-medium transition-colors">
              Get Started
            </button>
            <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-4 rounded-lg text-lg font-medium transition-colors">
              Learn More
            </button>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <div className="w-6 h-6 bg-blue-600 rounded"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Matching</h3>
              <p className="text-gray-600">AI-powered recommendations for apartments, roommates, and local spots</p>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <div className="w-6 h-6 bg-green-600 rounded"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Verified Listings</h3>
              <p className="text-gray-600">All apartments and spots are verified for accuracy and quality</p>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <div className="w-6 h-6 bg-purple-600 rounded"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Driven</h3>
              <p className="text-gray-600">Connect with like-minded people in your area</p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="border-t border-gray-200 pt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How it works</h2>
            <p className="text-lg text-gray-600">Simple steps to find your perfect match</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-gray-900">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Create Profile</h3>
              <p className="text-gray-600">Tell us about your preferences, budget, and lifestyle</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-gray-900">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Matches</h3>
              <p className="text-gray-600">Our AI finds the best apartments, roommates, and spots for you</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-gray-900">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect</h3>
              <p className="text-gray-600">Message matches and arrange viewings or meetups</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>Frontend: Next.js 15.5.3 | Backend: Flask + Supabase | ML: Scikit-learn</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

