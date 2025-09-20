export default function Welcome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome to CityMate!
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Your journey to finding the perfect place starts here.
        </p>
        
        <div className="space-y-4">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            ✓ Account created successfully
          </div>
          
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
            ✓ Ready to explore apartments
          </div>
          
          <div className="bg-purple-100 border border-purple-400 text-purple-700 px-4 py-3 rounded">
            ✓ ML recommendations active
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <a 
            href="/dashboard" 
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition duration-200"
          >
            Start Exploring
          </a>
        </div>
      </div>
    </div>
  );
}

