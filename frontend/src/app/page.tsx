'use client'

import React, { useState, useRef } from 'react';
import { 
  ArrowRight, 
  Search, 
  UserCheck, 
  BarChart, 
  ShieldCheck, 
  Award, 
  Star,
  Home as HomeIcon, 
  Building2, 
  BookOpen, 
  FileText, 
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Calculator,
  Users
} from 'lucide-react';
import ExtravagantNavbar from './components/LandingNavbar';


// --- Home Page Component ---

export default function Home() {
  const [user, setUser] = useState<any>(null);

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="relative w-full h-screen overflow-hidden">
        <div className="absolute inset-0 z-0">
           <img 
              src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=2874&auto=format&fit=crop" 
              alt="Luxurious modern home"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        </div>
        
        <ExtravagantNavbar user={user} onLogout={handleLogout} />
        
        <main className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
            <h1 className="!text-white text-5xl md:text-7xl font-extrabold leading-tight mb-4 animate-fade-in-down" style={{textShadow: '0 4px 15px rgba(0,0,0,0.5)'}}>
              Find Your Dream Home
            </h1>
            <p className="text-lg md:text-xl max-w-3xl mb-8 text-slate-200 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
              Discover exclusive properties, connect with top agents, and find the perfect place to call home with our intelligent, personalized platform.
            </p>
            
            <div className="bg-white/20 backdrop-blur-md p-4 rounded-xl shadow-lg w-full max-w-2xl animate-fade-in-up" style={{animationDelay: '0.6s'}}>
              <div className="flex items-center">
                  <Search className="h-6 w-6 text-white mr-3"/>
                  <input 
                    type="text"
                    placeholder="Enter an address, city, or ZIP code"
                    className="w-full bg-transparent text-white placeholder-slate-300 focus:outline-none"
                  />
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg ml-3 transition-colors flex items-center gap-2">
                    Search <ArrowRight className="h-5 w-5"/>
                  </button>
              </div>
            </div>
        </main>
      </div>

      <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-4xl font-bold text-indigo-600">12k+</p>
                <p className="text-slate-500 mt-1">Exclusive Listings</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-indigo-600">4.9/5</p>
                <p className="text-slate-500 mt-1">Client Rating</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-indigo-600">200+</p>
                <p className="text-slate-500 mt-1">Top Agents</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-indigo-600">$5B+</p>
                <p className="text-slate-500 mt-1">In Transactions</p>
              </div>
            </div>
          </div>
       </section>
      
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Why Choose Locale?</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">We combine cutting-edge technology with unparalleled service to make your real estate journey seamless.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white/60 backdrop-blur-md border border-slate-200 rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                        <UserCheck className="w-8 h-8 text-white"/>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Personalized Matching</h3>
                    <p className="text-slate-600">Our AI understands your unique needs to find properties and agents perfectly suited for you.</p>
                </div>
                <div className="bg-white/60 backdrop-blur-md border border-slate-200 rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6">
                        <BarChart className="w-8 h-8 text-white"/>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Market Insights</h3>
                    <p className="text-slate-600">Access real-time data and trend analysis to make informed decisions with confidence.</p>
                </div>
                <div className="bg-white/60 backdrop-blur-md border border-slate-200 rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                    <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6">
                        <ShieldCheck className="w-8 h-8 text-white"/>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Verified Listings</h3>
                    <p className="text-slate-600">Every property is verified for accuracy, ensuring a trustworthy and transparent search.</p>
                </div>
            </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Loved by Homebuyers</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Don't just take our word for it. Here's what our clients have to say.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 rounded-xl border border-slate-100">
              <div className="flex items-center mb-4">
                <img src="https://i.pravatar.cc/48?u=1" alt="User 1" className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <p className="font-semibold text-slate-800">Saicharan Ramineni</p>
                  <div className="flex text-yellow-400">
                    <Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/>
                  </div>
                </div>
              </div>
              <p className="text-slate-600 italic">"Locale's platform made finding our dream home incredibly easy. The personalized matches were spot on!"</p>
            </div>
             <div className="bg-slate-50 p-8 rounded-xl border border-slate-100">
              <div className="flex items-center mb-4">
                <img src="https://i.pravatar.cc/48?u=2" alt="User 2" className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <p className="font-semibold text-slate-800">Kazi Amin</p>
                   <div className="flex text-yellow-400">
                    <Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/>
                  </div>
                </div>
              </div>
              <p className="text-slate-600 italic">"The market insights were invaluable. We felt so confident in our purchase. Highly recommend to anyone."</p>
            </div>
             <div className="bg-slate-50 p-8 rounded-xl border border-slate-100">
              <div className="flex items-center mb-4">
                <img src="https://i.pravatar.cc/48?u=3" alt="User 3" className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <p className="font-semibold text-slate-800">Kauan Lima</p>
                   <div className="flex text-yellow-400">
                    <Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/>
                  </div>
                </div>
              </div>
              <p className="text-slate-600 italic">"Our agent, found through Locale, was exceptional. The entire process was smooth and stress-free."</p>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Explore Places</h3>
            <p className="text-gray-600">
              Discover the best restaurants, cafes, and activities in your area
            </p>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            <div className="col-span-2 lg:col-span-1 mb-8 lg:mb-0">
              <a href="#" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white/90 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-indigo-600" />
                </div>
                <span className="text-xl font-bold text-white tracking-wide">Locale</span>
              </a>
              <p className="mt-4 text-sm text-slate-400">The future of real estate.</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Buy</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Homes for Sale</a></li>
                <li><a href="#" className="hover:text-white">New Construction</a></li>
                <li><a href="#" className="hover:text-white">Mortgage Calculator</a></li>
              </ul>
            </div>
             <div>
              <h3 className="font-semibold text-white mb-4">Rent</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Apartments for Rent</a></li>
                <li><a href="#" className="hover:text-white">Houses for Rent</a></li>
                <li><a href="#" className="hover:text-white">Renting Guide</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Market Trends</a></li>
                <li><a href="#" className="hover:text-white">Agent Directory</a></li>
              </ul>
            </div>
             <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-16 border-t border-slate-700 pt-8 text-center text-sm text-slate-400">
            <p>&copy; {new Date().getFullYear()} Locale. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
       <style>{`
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
