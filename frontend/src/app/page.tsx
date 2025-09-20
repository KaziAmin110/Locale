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
  Users,
  MapPin,
  Heart
} from 'lucide-react';
import ExtravagantNavbar from './components/LandingNavbar';


// --- Home Page Component ---

export default function Home() {
  const [user, setUser] = useState<any>(null);

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-white text-slate-800">
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

      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Discover a better way</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to find the perfect home
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our platform is designed to be your co-pilot in the real estate market, providing you with the tools and insights to make confident decisions.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <UserCheck className="h-6 w-6 text-white" />
                  </div>
                  Personalized Matching
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">Our AI-powered engine connects you with homes and agents that match your unique lifestyle and preferences.</dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <BarChart className="h-6 w-6 text-white" />
                  </div>
                  In-Depth Market Insights
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">Access real-time market data, trend analysis, and neighborhood scores to stay ahead of the curve.</dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <ShieldCheck className="h-6 w-6 text-white" />
                  </div>
                  Verified & Exclusive Listings
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">Every listing is meticulously verified, and you get access to off-market properties you won't find anywhere else.</dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  Top-Tier Agent Network
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">We've partnered with the top 1% of agents in every major city to provide you with unparalleled service and expertise.</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
      
       <section className="bg-slate-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Featured Properties</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">Explore a curated selection of our finest properties, from modern city lofts to serene suburban estates.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2940&auto=format&fit=crop" className="w-full h-64 object-cover" />
                    <div className="p-6 bg-white">
                        <p className="text-2xl font-bold text-slate-900">$2,500,000</p>
                        <p className="text-slate-600">4 beds | 5 baths | 4,200 sqft</p>
                        <p className="text-slate-500 mt-2">123 Maple Street, Beverly Hills, CA</p>
                    </div>
                </div>
                <div className="group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    <img src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2940&auto=format&fit=crop" className="w-full h-64 object-cover" />
                    <div className="p-6 bg-white">
                        <p className="text-2xl font-bold text-slate-900">$1,200,000</p>
                        <p className="text-slate-600">3 beds | 3 baths | 2,800 sqft</p>
                        <p className="text-slate-500 mt-2">456 Ocean Drive, Miami, FL</p>
                    </div>
                </div>
                 <div className="group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2940&auto=format&fit=crop" className="w-full h-64 object-cover" />
                    <div className="p-6 bg-white">
                        <p className="text-2xl font-bold text-slate-900">$850,000</p>
                        <p className="text-slate-600">2 beds | 2 baths | 1,500 sqft</p>
                        <p className="text-slate-500 mt-2">789 Pine Avenue, Aspen, CO</p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
             <h2 className="text-base font-semibold leading-7 text-indigo-600">A Seamless Experience</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              How It Works
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our streamlined process makes finding your next home simpler and more enjoyable than ever before.
            </p>
          </div>
          <div className="mt-16 flow-root">
             <div className="[-webkit-mask-image:linear-gradient(to_bottom,white_20%,transparent_100%)]">
              <div className="mx-auto max-w-5xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:max-w-none">
                  <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-3">
                    <div className="flex flex-col items-center text-center">
                       <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-lg">1</div>
                       <h3 className="mt-6 text-xl font-semibold leading-7 text-gray-900">Discover</h3>
                       <p className="mt-2 text-base leading-7 text-gray-600">Browse thousands of verified listings with our powerful and intuitive search tools.</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                       <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-lg">2</div>
                       <h3 className="mt-6 text-xl font-semibold leading-7 text-gray-900">Connect</h3>
                       <p className="mt-2 text-base leading-7 text-gray-600">Connect with a top-rated local agent who understands your needs and the market.</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                       <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-lg">3</div>
                       <h3 className="mt-6 text-xl font-semibold leading-7 text-gray-900">Close</h3>
                       <p className="mt-2 text-base leading-7 text-gray-600">Sail through the closing process with our expert guidance and digital tools.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Loved by Homebuyers</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Don't just take our word for it. Here's what our clients have to say.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
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
             <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
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
             <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
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
          </div>
        </div>
      </section>
      <section className="relative overflow-hidden bg-slate-900 py-32">
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
              Begin Your Journey Today
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-300 max-w-2xl mx-auto">
              The keys to your future home are just a few clicks away. Let's unlock it together.
            </p>
            <div className="mt-10">
              <a href="#" className="shimmer-button">
                Get Started Now
              </a>
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
