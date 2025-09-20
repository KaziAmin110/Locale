export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
           CityMate
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Find your perfect apartment, roommates, and local spots!
        </p>
        
        <div className="space-y-4">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
             Frontend is working!
          </div>
          
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
            Ready for ML recommendations
          </div>
          
          <div className="bg-purple-100 border border-purple-400 text-purple-700 px-4 py-3 rounded">
             Backend API ready
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <a 
            href="/login" 
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-200"
          >
            Get Started
          </a>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Frontend: Next.js 15.5.3</p>
          <p>Backend: Flask + Supabase</p>
          <p>ML: Scikit-learn</p>
        </div>
      </div>
    </div>
  );
}
