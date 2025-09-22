'use client'

import React, { useState } from 'react';import { 
  ArrowRight, 
  Search, 
  UserCheck, 
  BarChart, 
  ShieldCheck, 
  Award, 
  Star,
  Home as HomeIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import ExtravagantNavbar from './components/LandingNavbar';

// --- Home Page Component ---

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [searchTab, setSearchTab] = useState('Buy');

  const handleLogout = () => {
    setUser(null);
  };

  const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-300 overflow-x-hidden">
      {/* --- Hero Section --- */}
      <div className="relative w-full h-screen">
        <div className="absolute inset-0 z-0">
           <img 
              src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=2874&auto=format&fit=crop" 
              alt="Luxurious modern home"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent"></div>
        </div>
        
        <ExtravagantNavbar user={user} onLogout={handleLogout} />
        
        <main className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="!text-white text-5xl md:text-7xl font-extrabold leading-tight mb-4" 
              style={{textShadow: '0 5px 20px rgba(0,0,0,0.5)'}}
            >
              Find Your Dream Home
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="text-lg md:text-xl max-w-3xl mb-8 text-slate-200"
            >
              Discover exclusive properties, connect with top agents, and find the perfect place to call home with our intelligent, personalized platform.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
              className="w-full max-w-3xl"
            >
              <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-2xl p-4 shadow-2xl">
                <div className="flex items-center space-x-2 mb-4 border-b border-slate-700">
                  {['Buy', 'Rent', 'Sell'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setSearchTab(tab)}
                      className={`px-4 py-2 text-sm font-medium transition-colors ${
                        searchTab === tab
                          ? 'text-white border-b-2 border-red-500'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="flex items-center">
                    <Search className="h-5 w-5 text-slate-400 mr-3"/>
                    <input 
                      type="text"
                      placeholder="Enter an address, city, or ZIP code"
                      className="w-full bg-transparent text-white placeholder-slate-400 focus:outline-none"
                    />
                    <button className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg ml-3 transition-colors flex items-center gap-2 whitespace-nowrap">
                      Search <ArrowRight className="h-5 w-5"/>
                    </button>
                </div>
              </div>
            </motion.div>
        </main>
      </div>

      {/* --- Features Section --- */}
      <section className="bg-slate-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ staggerChildren: 0.2 }}
            className="mx-auto max-w-2xl lg:text-center"
          >
            <motion.h2 variants={featureVariants} className="text-base font-semibold leading-7 text-red-400">Discover a better way</motion.h2>
            <motion.p variants={featureVariants} className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Everything you need to find the perfect home
            </motion.p>
            <motion.p variants={featureVariants} className="mt-6 text-lg leading-8 text-slate-400">
              Our platform is designed to be your co-pilot in the real estate market, providing you with the tools and insights to make confident decisions.
            </motion.p>
          </motion.div>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ staggerChildren: 0.2 }}
            className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none"
          >
            <dl className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: UserCheck, title: 'Personalized Matching', text: "Our AI engine connects you with homes and agents that match your unique lifestyle." },
                { icon: BarChart, title: 'In-Depth Market Insights', text: "Access real-time market data, trend analysis, and neighborhood scores to stay ahead." },
                { icon: ShieldCheck, title: 'Verified & Exclusive Listings', text: "Explore verified listings and access off-market properties you won't find anywhere else." },
                { icon: Award, title: 'Top-Tier Agent Network', text: "Partner with the top 1% of agents in your city for unparalleled service and expertise." }
              ].map((feature, index) => (
                <motion.div variants={featureVariants} key={index} className="flex flex-col items-center text-center p-6 bg-slate-800/50 rounded-2xl border border-slate-700">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/20 text-red-400">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <dt className="text-lg font-semibold leading-7 text-white">{feature.title}</dt>
                  <dd className="mt-2 text-base leading-7 text-slate-400">{feature.text}</dd>
                </motion.div>
              ))}
            </dl>
          </motion.div>
        </div>
      </section>
      
      {/* --- Featured Properties Section --- */}
       <section className="bg-slate-900 py-24 sm:py-32 relative">
          <div className="absolute inset-0 bg-grid-slate-800/40 [mask-image:linear-gradient(to_bottom,white,transparent,white)]"></div>
          <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold text-white mb-4">Featured Properties</h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">Explore a curated selection of our finest properties, from modern city lofts to serene suburban estates.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2940&auto=format&fit=crop", price: "$2,500,000", details: "4 beds | 5 baths | 4,200 sqft", address: "123 Maple Street, Beverly Hills, CA" },
                { img: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2940&auto=format&fit=crop", price: "$1,200,000", details: "3 beds | 3 baths | 2,800 sqft", address: "456 Ocean Drive, Miami, FL" },
                { img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2940&auto=format&fit=crop", price: "$850,000", details: "2 beds | 2 baths | 1,500 sqft", address: "789 Pine Avenue, Aspen, CO" }
              ].map((prop, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group rounded-2xl overflow-hidden bg-slate-800/50 border border-slate-700 hover:border-red-500 transition-all duration-300 transform hover:-translate-y-2 shadow-lg hover:shadow-red-500/10"
                >
                    <div className="overflow-hidden h-64">
                      <img src={prop.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="p-6">
                        <p className="text-2xl font-bold text-white">{prop.price}</p>
                        <p className="text-slate-400">{prop.details}</p>
                        <p className="text-slate-500 mt-2">{prop.address}</p>
                    </div>
                </motion.div>
              ))}
            </div>
        </div>
      </section>

      {/* --- How It Works Section --- */}
      <section className="bg-slate-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center mb-16">
             <h2 className="text-base font-semibold leading-7 text-red-400">A Seamless Experience</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              How It Works
            </p>
          </div>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ staggerChildren: 0.3 }}
            className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-3"
          >
            {[
              { title: "Discover", text: "Browse thousands of verified listings with our powerful and intuitive search tools." },
              { title: "Connect", text: "Connect with a top-rated local agent who understands your needs and the market." },
              { title: "Close", text: "Sail through the closing process with our expert guidance and digital tools." }
            ].map((step, index) => (
              <motion.div variants={featureVariants} key={index} className="flex flex-col items-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 border-2 border-red-500 text-white font-bold text-lg">{index + 1}</div>
                  <h3 className="mt-6 text-xl font-semibold leading-7 text-white">{step.title}</h3>
                  <p className="mt-2 text-base leading-7 text-slate-400">{step.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- Testimonials Section --- */}
      <section className="py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-white mb-4">Loved by Homebuyers</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">Don't just take our word for it. Here's what our clients have to say.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             {[
               { name: "Saicharan Ramineni", avatar: "https://i.pravatar.cc/48?u=1", quote: `"CityMate's platform made finding our dream home incredibly easy. The personalized matches were spot on!"` },
               { name: "Kazi Amin", avatar: "https://i.pravatar.cc/48?u=2", quote: `"The market insights were invaluable. We felt so confident in our purchase. Highly recommend to anyone."` },
               { name: "Kauan Lima", avatar: "https://i.pravatar.cc/48?u=3", quote: `"Our agent, found through CityMate, was exceptional. The entire process was smooth and stress-free."` }
             ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700"
              >
                <div className="flex items-center mb-4">
                  <img src={testimonial.avatar} alt={`User ${index+1}`} className="w-12 h-12 rounded-full mr-4" />
                  <div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current"/>)}
                    </div>
                  </div>
                </div>
                <p className="text-slate-400 italic">{testimonial.quote}</p>
              </motion.div>
             ))}
          </div>
        </div>
      </section>
      
      {/* --- Final CTA Section --- */}
      <section className="relative overflow-hidden bg-slate-900 py-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] sm:w-[100%] sm:h-[100%] rounded-full bg-gradient-to-br from-rose-900/50 via-slate-900 to-slate-900"></div>
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
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

      {/* --- Footer --- */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            <div className="col-span-2 lg:col-span-1 mb-8 lg:mb-0">
              <a href="#" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                  <HomeIcon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white tracking-wide">CityMate</span>
              </a>
              <p className="mt-4 text-sm text-slate-500">The future of real estate.</p>
            </div>
             {/* Footer links can be mapped for cleaner code */}
            <div>
              <h3 className="font-semibold text-white mb-4">Buy</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Homes for Sale</a></li>
                <li><a href="#" className="hover:text-white transition-colors">New Construction</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mortgage Calculator</a></li>
              </ul>
            </div>
             <div>
              <h3 className="font-semibold text-white mb-4">Rent</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Apartments for Rent</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Houses for Rent</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Renting Guide</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Market Trends</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Agent Directory</a></li>
              </ul>
            </div>
             <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-16 border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} CityMate. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
       <style>{`
        .shimmer-button {
          display: inline-block;
          padding: 1rem 2.5rem;
          font-size: 1.125rem;
          font-weight: 600;
          color: white;
          background: linear-gradient(110deg, #F43F5E 0%, #EF4444 50%, #F43F5E 100%);
          background-size: 200% 100%;
          border: none;
          border-radius: 0.75rem;
          cursor: pointer;
          transition: all 0.3s ease;
          animation: shimmer 5s infinite linear;
          box-shadow: 0 10px 20px rgba(239, 68, 68, 0.25);
        }

        .shimmer-button:hover {
          transform: scale(1.05);
          box-shadow: 0 15px 30px rgba(239, 68, 68, 0.35);
        }

        @keyframes shimmer {
          to {
            background-position: -200% 0;
          }
        }
        
        .bg-grid-slate-800\\/40 {
          background-image: linear-gradient(white 1px, transparent 1px), linear-gradient(to right, white 1px, transparent 1px);
          background-size: 3rem 3rem;
          opacity: 0.1;
        }
      `}</style>
    </div>
  )
}
