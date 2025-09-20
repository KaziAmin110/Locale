'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, 
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

// Interfaces for our navigation items
interface NavItem {
  href: string;
  icon: React.ReactNode;
  title: string;
  description?: string;
}

interface MegaMenuColumn {
    title: string;
    items: NavItem[];
}

interface LandingNavbarProps {
  user?: any;
  onLogout?: () => void;
}

// Data for the navigation links
const buyMegaMenuItems: MegaMenuColumn[] = [
    {
        title: "Property Types",
        items: [
            { href: "/buy/homes", icon: <Home className="h-5 w-5 text-indigo-500"/>, title: "Homes for Sale", description: "Single-family, multi-family" },
            { href: "/buy/new-construction", icon: <Building2 className="h-5 w-5 text-purple-500"/>, title: "New Construction", description: "Be the first to live in" },
            { href: "/buy/foreclosures", icon: <FileText className="h-5 w-5 text-red-500"/>, title: "Foreclosures", description: "Great investment opportunities" }
        ]
    },
    {
        title: "Buyer's Tools",
        items: [
            { href: "/tools/mortgage-calculator", icon: <Calculator className="h-5 w-5 text-green-500"/>, title: "Mortgage Calculator", description: "Estimate your monthly payments" },
            { href: "/guides/home-buying", icon: <BookOpen className="h-5 w-5 text-blue-500"/>, title: "Home Buying Guide", description: "Tips for first-time buyers" },
            { href: "/agents", icon: <Users className="h-5 w-5 text-orange-500"/>, title: "Find an Agent", description: "Connect with a professional" }
        ]
    }
];

const rentMegaMenuItems: MegaMenuColumn[] = [
    {
        title: "Find a Rental",
        items: [
            { href: "/rent/apartments", icon: <Building2 className="h-5 w-5 text-indigo-500"/>, title: "Apartments for Rent", description: "Urban and suburban living" },
            { href: "/rent/houses", icon: <Home className="h-5 w-5 text-purple-500"/>, title: "Houses for Rent", description: "Single-family rentals" },
            { href: "/rent/rooms", icon: <Users className="h-5 w-5 text-red-500"/>, title: "Rooms for Rent", description: "Shared living spaces" }
        ]
    },
    {
        title: "Renter's Tools",
        items: [
            { href: "/tools/affordability-calculator", icon: <Calculator className="h-5 w-5 text-green-500"/>, title: "Affordability Calculator", description: "See what you can afford" },
            { href: "/guides/renting", icon: <BookOpen className="h-5 w-5 text-blue-500"/>, title: "Renting Guide", description: "Tips for new renters" },
            { href: "/rent/application", icon: <FileText className="h-5 w-5 text-orange-500"/>, title: "Rental Application", description: "Apply to your new home" }
        ]
    }
];

const resourcesMegaMenuItems: MegaMenuColumn[] = [
    {
        title: "Learn",
        items: [
            { href: "/blog", icon: <BookOpen className="h-5 w-5 text-indigo-500"/>, title: "Blog", description: "Real estate news and insights" },
            { href: "/market-trends", icon: <Sparkles className="h-5 w-5 text-purple-500"/>, title: "Market Trends", description: "Stay ahead of the curve" },
            { href: "/guides", icon: <FileText className="h-5 w-5 text-red-500"/>, title: "How-To Guides", description: "DIY, moving, and more" }
        ]
    },
    {
        title: "Explore",
        items: [
            { href: "/agents", icon: <Users className="h-5 w-5 text-green-500"/>, title: "Agent Directory", description: "Find top-rated agents" },
            { href: "/neighborhoods", icon: <Home className="h-5 w-5 text-blue-500"/>, title: "Neighborhood Guides", description: "Discover your perfect area" },
            { href: "/schools", icon: <Building2 className="h-5 w-5 text-orange-500"/>, title: "School Ratings", description: "Research local schools" }
        ]
    }
];

// Featured content for each mega menu
const BuyFeatured = (
    <div className="col-span-1 bg-indigo-50 rounded-lg p-6 flex flex-col justify-center items-center text-center">
        <h4 className="font-bold text-indigo-800 text-lg">Featured Listings</h4>
        <p className="text-sm text-indigo-600 mt-2 mb-4">Discover exclusive properties in top neighborhoods.</p>
        <a href="#" className="bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">View Homes</a>
    </div>
);

const RentFeatured = (
    <div className="col-span-1 bg-green-50 rounded-lg p-6 flex flex-col justify-center items-center text-center">
        <h4 className="font-bold text-green-800 text-lg">Featured Rentals</h4>
        <p className="text-sm text-green-600 mt-2 mb-4">Find your perfect rental property today.</p>
        <a href="#" className="bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">Browse Rentals</a>
    </div>
);

const ResourcesFeatured = (
    <div className="col-span-1 bg-purple-50 rounded-lg p-6 flex flex-col justify-center items-center text-center">
        <h4 className="font-bold text-purple-800 text-lg">Expert Insights</h4>
        <p className="text-sm text-purple-600 mt-2 mb-4">Get the latest news and advice from our experts.</p>
        <a href="#" className="bg-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">Read Blog</a>
    </div>
);


const ExtravagantNavbar = ({ user, onLogout }: LandingNavbarProps) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (menu: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
  };

  const MegaMenu = ({ items, menuKey, featuredContent }: { items: MegaMenuColumn[], menuKey: string, featuredContent: React.ReactNode }) => (
    <div 
      className={`absolute top-full w-screen max-w-4xl mt-4 transform transition-all duration-300 ease-out left-0 ${
        activeDropdown === menuKey
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
      }`}
      onMouseEnter={() => handleMouseEnter(menuKey)}
      onMouseLeave={handleMouseLeave}
    >
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {items.map(column => (
            <div key={column.title} className="col-span-1">
                 <h3 className="text-lg font-bold text-gray-800 mb-4">{column.title}</h3>
                 <ul className="space-y-3">
                     {column.items.map(item => (
                         <li key={item.title}>
                             <a href={item.href} className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-50/80 transition-colors group">
                                {item.icon}
                                <div>
                                    <p className="font-semibold text-gray-700 group-hover:text-indigo-600">{item.title}</p>
                                    <p className="text-sm text-gray-500">{item.description}</p>
                                </div>
                             </a>
                         </li>
                     ))}
                 </ul>
            </div>
        ))}
        {featuredContent}
      </div>
    </div>
  );
  
  const NavItem = ({ children, menuKey }: { children: React.ReactNode; menuKey: string; }) => (
    <div className="relative h-20 flex items-center" onMouseEnter={() => handleMouseEnter(menuKey)} onMouseLeave={handleMouseLeave}>
      {children}
    </div>
  );

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 p-4">
        <nav className="relative max-w-7xl mx-auto bg-white/50 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg transition-all duration-300 h-20 flex items-center justify-between px-6">
          
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="w-12 h-12 bg-white/90 rounded-lg flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-7 h-7 text-indigo-600" />
              </div>
              <span className="text-2xl font-bold text-slate-800 tracking-wide">Locale</span>
            </a>
            <div className="hidden lg:flex items-center gap-8">
              <NavItem menuKey="buy">
                <button className="flex items-center gap-2 text-slate-700 font-semibold hover:text-indigo-600 transition-colors group">
                  <span>Buy</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${activeDropdown === 'buy' ? 'rotate-180' : ''}`} />
                </button>
                <MegaMenu items={buyMegaMenuItems} menuKey="buy" featuredContent={BuyFeatured} />
              </NavItem>
              <NavItem menuKey="rent">
                 <button className="flex items-center gap-2 text-slate-700 font-semibold hover:text-indigo-600 transition-colors group">
                  <span>Rent</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${activeDropdown === 'rent' ? 'rotate-180' : ''}`} />
                </button>
                <MegaMenu items={rentMegaMenuItems} menuKey="rent" featuredContent={RentFeatured} />
              </NavItem>
               <NavItem menuKey="resources">
                  <button className="flex items-center gap-2 text-slate-700 font-semibold hover:text-indigo-600 transition-colors group">
                      <span>Resources</span>
                      <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${activeDropdown === 'resources' ? 'rotate-180' : ''}`} />
                  </button>
                  <MegaMenu items={resourcesMegaMenuItems} menuKey="resources" featuredContent={ResourcesFeatured} />
               </NavItem>
            </div>
          </div>
          
          <div className="hidden lg:flex items-center gap-6">
             {user ? (
                 <>
                    <span className="text-slate-700 font-medium text-sm">Welcome, {user.name || 'User'}</span>
                    <button onClick={onLogout} className="text-slate-700 font-semibold hover:text-indigo-600 transition-colors">Logout</button>
                 </>
             ) : (
                <>
                    <button onClick={() => window.location.href = '/login'} className="text-slate-700 font-semibold hover:text-indigo-600 transition-colors">Sign In</button>
                    <button onClick={() => window.location.href = '/onboarding'} className="relative inline-block px-6 py-3 font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg overflow-hidden group">
                        <span className="relative z-10">Get Started</span>
                        <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    </button>
                </>
             )}
          </div>

          <div className="lg:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-800">
                  {isMobileMenuOpen ? <X className="h-7 w-7"/> : <Menu className="h-7 w-7"/>}
              </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <div className={`fixed top-0 left-0 w-full h-full bg-black/50 z-40 transition-opacity duration-300 lg:hidden ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMobileMenuOpen(false)}>
        <div 
          className={`absolute top-0 left-0 h-full w-4/5 max-w-sm bg-white p-6 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
           <h2 className="text-2xl font-bold mb-8">Menu</h2>
           <div className="space-y-4">
            <a href="/buy" className="block text-lg font-medium text-gray-700 hover:text-indigo-600">Buy</a>
            <a href="/rent" className="block text-lg font-medium text-gray-700 hover:text-indigo-600">Rent</a>
            <a href="/resources" className="block text-lg font-medium text-gray-700 hover:text-indigo-600">Resources</a>
           </div>
            <div className="border-t border-gray-200 mt-8 pt-6 space-y-4">
            {user ? (
                 <>
                    <button onClick={onLogout} className="w-full text-left text-lg font-medium text-gray-700 hover:text-indigo-600">Logout</button>
                 </>
             ) : (
                <>
                    <button onClick={() => window.location.href = '/login'} className="w-full text-left text-lg font-medium text-gray-700 hover:text-indigo-600">Sign In</button>
                    <button onClick={() => window.location.href = '/onboarding'} className="w-full mt-4 px-6 py-3 font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg">Get Started</button>
                </>
             )}
            </div>
        </div>
      </div>

      <div className="h-28"></div>
    </>
  );
};

export default ExtravagantNavbar;

