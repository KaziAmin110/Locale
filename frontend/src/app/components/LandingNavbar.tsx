"use client";

import React, { useState, useRef, useEffect } from "react";
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
  Users,
  Heart,
} from "lucide-react";

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

// Data for the navigation links (icons updated to use consistent color)
const iconClass = "w-5 h-5 text-red-400";

const buyMegaMenuItems: MegaMenuColumn[] = [
  {
    title: "Property Types",
    items: [
      {
        href: "/buy/homes",
        icon: <Home className={iconClass} />,
        title: "Homes for Sale",
        description: "Single-family, multi-family",
      },
      {
        href: "/buy/new-construction",
        icon: <Building2 className={iconClass} />,
        title: "New Construction",
        description: "Be the first to live in",
      },
      {
        href: "/buy/foreclosures",
        icon: <FileText className={iconClass} />,
        title: "Foreclosures",
        description: "Great investment opportunities",
      },
    ],
  },
  {
    title: "Buyer's Tools",
    items: [
      {
        href: "/tools/mortgage-calculator",
        icon: <Calculator className={iconClass} />,
        title: "Mortgage Calculator",
        description: "Estimate your monthly payments",
      },
      {
        href: "/guides/home-buying",
        icon: <BookOpen className={iconClass} />,
        title: "Home Buying Guide",
        description: "Tips for first-time buyers",
      },
      {
        href: "/agents",
        icon: <Users className={iconClass} />,
        title: "Find an Agent",
        description: "Connect with a professional",
      },
    ],
  },
];

const rentMegaMenuItems: MegaMenuColumn[] = [
  {
    title: "Find a Rental",
    items: [
      {
        href: "/rent/apartments",
        icon: <Building2 className={iconClass} />,
        title: "Apartments for Rent",
        description: "Urban and suburban living",
      },
      {
        href: "/rent/houses",
        icon: <Home className={iconClass} />,
        title: "Houses for Rent",
        description: "Single-family rentals",
      },
      {
        href: "/rent/rooms",
        icon: <Users className={iconClass} />,
        title: "Rooms for Rent",
        description: "Shared living spaces",
      },
    ],
  },
  {
    title: "Renter's Tools",
    items: [
      {
        href: "/tools/affordability-calculator",
        icon: <Calculator className={iconClass} />,
        title: "Affordability Calculator",
        description: "See what you can afford",
      },
      {
        href: "/guides/renting",
        icon: <BookOpen className={iconClass} />,
        title: "Renting Guide",
        description: "Tips for new renters",
      },
      {
        href: "/rent/application",
        icon: <FileText className={iconClass} />,
        title: "Rental Application",
        description: "Apply to your new home",
      },
    ],
  },
];

const resourcesMegaMenuItems: MegaMenuColumn[] = [
  {
    title: "Learn",
    items: [
      {
        href: "/blog",
        icon: <BookOpen className={iconClass} />,
        title: "Blog",
        description: "Real estate news and insights",
      },
      {
        href: "/market-trends",
        icon: <Sparkles className={iconClass} />,
        title: "Market Trends",
        description: "Stay ahead of the curve",
      },
      {
        href: "/guides",
        icon: <FileText className={iconClass} />,
        title: "How-To Guides",
        description: "DIY, moving, and more",
      },
    ],
  },
  {
    title: "Explore",
    items: [
      {
        href: "/agents",
        icon: <Users className={iconClass} />,
        title: "Agent Directory",
        description: "Find top-rated agents",
      },
      {
        href: "/neighborhoods",
        icon: <Home className={iconClass} />,
        title: "Neighborhood Guides",
        description: "Discover your perfect area",
      },
      {
        href: "/schools",
        icon: <Building2 className={iconClass} />,
        title: "School Ratings",
        description: "Research local schools",
      },
    ],
  },
];

// Featured content for each mega menu (Restyled for dark theme)
const BuyFeatured = (
  <div className="flex flex-col items-center justify-center col-span-1 p-6 text-center border rounded-lg bg-red-500/10 border-red-500/20">
    <h4 className="text-lg font-bold text-white">Featured Listings</h4>
    <p className="mt-2 mb-4 text-sm text-red-300">
      Discover exclusive properties in top neighborhoods.
    </p>
    <a
      href="#"
      className="px-4 py-2 text-sm font-semibold text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
    >
      View Homes
    </a>
  </div>
);

const RentFeatured = (
  <div className="flex flex-col items-center justify-center col-span-1 p-6 text-center border rounded-lg bg-rose-500/10 border-rose-500/20">
    <h4 className="text-lg font-bold text-white">Featured Rentals</h4>
    <p className="mt-2 mb-4 text-sm text-rose-300">
      Find your perfect rental property today.
    </p>
    <a
      href="#"
      className="px-4 py-2 text-sm font-semibold text-white transition-colors rounded-lg bg-rose-600 hover:bg-rose-700"
    >
      Browse Rentals
    </a>
  </div>
);

const ResourcesFeatured = (
  <div className="flex flex-col items-center justify-center col-span-1 p-6 text-center border rounded-lg bg-pink-500/10 border-pink-500/20">
    <h4 className="text-lg font-bold text-white">Expert Insights</h4>
    <p className="mt-2 mb-4 text-sm text-pink-300">
      Get the latest news and advice from our experts.
    </p>
    <a
      href="#"
      className="px-4 py-2 text-sm font-semibold text-white transition-colors bg-pink-600 rounded-lg hover:bg-pink-700"
    >
      Read Blog
    </a>
  </div>
);

const ExtravagantNavbar = ({ user, onLogout }: LandingNavbarProps) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Effect for handling navbar background change on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const MegaMenu = ({
    items,
    menuKey,
    featuredContent,
  }: {
    items: MegaMenuColumn[];
    menuKey: string;
    featuredContent: React.ReactNode;
  }) => (
    <div
      className={`absolute top-full w-screen max-w-4xl mt-4 transform transition-all duration-300 ease-out left-0 ${
        activeDropdown === menuKey
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-2 pointer-events-none"
      }`}
      onMouseEnter={() => handleMouseEnter(menuKey)}
      onMouseLeave={handleMouseLeave}
    >
      <div className="grid grid-cols-1 gap-8 p-8 border shadow-2xl bg-slate-900/80 backdrop-blur-xl rounded-2xl border-slate-700 md:grid-cols-3">
        {items.map((column) => (
          <div key={column.title} className="col-span-1">
            <h3 className="mb-4 text-lg font-bold text-white">
              {column.title}
            </h3>
            <ul className="space-y-3">
              {column.items.map((item) => (
                <li key={item.title}>
                  <a
                    href={item.href}
                    className="flex items-center gap-4 p-2 transition-colors rounded-lg hover:bg-slate-800/80 group"
                  >
                    {item.icon}
                    <div>
                      <p className="font-semibold text-slate-200 group-hover:text-red-400">
                        {item.title}
                      </p>
                      <p className="text-sm text-slate-400">
                        {item.description}
                      </p>
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

  const NavItem = ({
    children,
    menuKey,
  }: {
    children: React.ReactNode;
    menuKey: string;
  }) => (
    <div
      className="relative flex items-center h-full"
      onMouseEnter={() => handleMouseEnter(menuKey)}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );

  return (
    <>
      <header className="fixed top-0 left-0 z-50 w-full p-4">
        <nav
          className={`relative flex items-center justify-between h-20 px-6 mx-auto transition-all duration-300 border shadow-lg max-w-7xl rounded-2xl ${
            scrolled
              ? "bg-slate-900/80 backdrop-blur-lg border-slate-700"
              : "bg-transparent border-transparent"
          }`}
        >
          <div className="flex items-center h-full gap-8">
            <a href="/" className="flex items-center flex-shrink-0 gap-3 group">
              <div className="flex items-center justify-center w-12 h-12 transition-transform duration-300 shadow-inner rounded-xl bg-gradient-to-br from-red-500 to-pink-500 group-hover:scale-110">
                <Heart className="text-white w-7 h-7" />
              </div>
              <span className="text-2xl font-bold tracking-wide text-white">
                CityMate
              </span>
            </a>
            <div className="items-center hidden h-full gap-8 lg:flex">
              <NavItem menuKey="buy">
                <button className="flex items-center h-full gap-2 font-semibold transition-colors text-slate-200 hover:text-red-400 group">
                  <span>Buy</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-300 ${
                      activeDropdown === "buy" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <MegaMenu
                  items={buyMegaMenuItems}
                  menuKey="buy"
                  featuredContent={BuyFeatured}
                />
              </NavItem>
              <NavItem menuKey="rent">
                <button className="flex items-center h-full gap-2 font-semibold transition-colors text-slate-200 hover:text-red-400 group">
                  <span>Rent</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-300 ${
                      activeDropdown === "rent" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <MegaMenu
                  items={rentMegaMenuItems}
                  menuKey="rent"
                  featuredContent={RentFeatured}
                />
              </NavItem>
              <NavItem menuKey="resources">
                <button className="flex items-center h-full gap-2 font-semibold transition-colors text-slate-200 hover:text-red-400 group">
                  <span>Resources</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-300 ${
                      activeDropdown === "resources" ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <MegaMenu
                  items={resourcesMegaMenuItems}
                  menuKey="resources"
                  featuredContent={ResourcesFeatured}
                />
              </NavItem>
            </div>
          </div>

          <div className="items-center hidden gap-6 lg:flex">
            {user ? (
              <>
                <span className="text-sm font-medium text-slate-200">
                  Welcome, {user.name || "User"}
                </span>
                <button
                  onClick={onLogout}
                  className="font-semibold transition-colors text-slate-200 hover:text-red-400"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => (window.location.href = "/login")}
                  className="font-semibold transition-colors text-slate-200 hover:text-red-400"
                >
                  Sign In
                </button>
                <button
                  onClick={() => (window.location.href = "/register")}
                  className="px-6 py-3 font-semibold text-white rounded-lg shadow-lg bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white"
            >
              {isMobileMenuOpen ? (
                <X className="h-7 w-7" />
              ) : (
                <Menu className="h-7 w-7" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu (Restyled for dark theme) */}
      <div
        className={`fixed top-0 left-0 w-full h-full bg-black/50 z-40 transition-opacity duration-300 lg:hidden ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div
          className={`absolute top-0 left-0 h-full w-4/5 max-w-sm bg-slate-900 p-6 transform transition-transform duration-300 ease-in-out border-r border-slate-800 ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-full pt-12 mt-8 space-y-4">
            <a
              href="/buy"
              className="block text-lg font-medium text-slate-200 hover:text-red-400"
            >
              Buy
            </a>
            <a
              href="/rent"
              className="block text-lg font-medium text-slate-200 hover:text-red-400"
            >
              Rent
            </a>
            <a
              href="/resources"
              className="block text-lg font-medium text-slate-200 hover:text-red-400"
            >
              Resources
            </a>
          </div>
          <div className="pt-6 mt-8 space-y-4 border-t border-slate-700">
            {user ? (
              <>
                <button
                  onClick={onLogout}
                  className="w-full text-lg font-medium text-left text-slate-200 hover:text-red-400"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => (window.location.href = "/login")}
                  className="w-full text-lg font-medium text-left text-slate-200 hover:text-red-400"
                >
                  Sign In
                </button>
                <button
                  onClick={() => (window.location.href = "/register")}
                  className="w-full px-6 py-3 mt-4 font-semibold text-white rounded-lg shadow-lg bg-gradient-to-r from-rose-600 to-red-600"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* This empty div is a spacer to prevent content from hiding behind the fixed navbar */}
      <div className="h-28"></div>
    </>
  );
};

export default ExtravagantNavbar;
