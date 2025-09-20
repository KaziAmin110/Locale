'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Home, 
  Building2, 
  BookOpen, 
  FileText, 
  ChevronDown,
  Menu,
  X,
  User,
  Settings,
  LogOut,
  Heart,
  MapPin,
  Sparkles
} from 'lucide-react';

interface DropdownItem {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const ModernNavbar = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const buyItems: DropdownItem[] = [
    {
      href: "/buy/houses",
      icon: <Home className="h-5 w-5" />,
      title: "Houses",
      description: "Find single-family homes",
      color: "text-blue-500 group-hover:text-blue-600"
    },
    {
      href: "/buy/apartments",
      icon: <Building2 className="h-5 w-5" />,
      title: "Apartments",
      description: "Discover condos & lofts",
      color: "text-purple-500 group-hover:text-purple-600"
    }
  ];

  const rentItems: DropdownItem[] = [
    {
      href: "/rent/apartments",
      icon: <Building2 className="h-5 w-5" />,
      title: "Apartments",
      description: "Urban rentals and studios",
      color: "text-green-500 group-hover:text-green-600"
    },
    {
      href: "/rent/houses",
      icon: <Home className="h-5 w-5" />,
      title: "Houses",
      description: "Suburban & shared housing",
      color: "text-orange-500 group-hover:text-orange-600"
    }
  ];

  const resourceItems: DropdownItem[] = [
    {
      href: "/guides",
      icon: <BookOpen className="h-5 w-5" />,
      title: "Buying Guides",
      description: "Tips for first-time buyers",
      color: "text-indigo-500 group-hover:text-indigo-600"
    },
    {
      href: "/mortgage",
      icon: <FileText className="h-5 w-5" />,
      title: "Mortgage Info",
      description: "Learn about financing",
      color: "text-teal-500 group-hover:text-teal-600"
    }
  ];

  const DropdownMenu = ({ items, isOpen }: { items: DropdownItem[], isOpen: boolean }) => (
    <div 
      className={`absolute top-full left-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 transform transition-all duration-300 ease-out ${
        isOpen 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
      }`}
    >
      <div className="space-y-4">
        {items.map((item, index) => (
          <Link 
            key={item.href}
            href={item.href}
            className={`flex items-start space-x-4 p-3 rounded-xl hover:bg-gray-50/80 transition-all duration-200 group ${
              isOpen ? 'animate-fade-in-up' : ''
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => setActiveDropdown(null)}
          >
            <div className={`flex-shrink-0 ${item.color} transition-colors duration-200`}>
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors duration-200">
                {item.title}
              </p>
              <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-200">
                {item.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );

  const NavItem = ({ 
    children, 
    dropdown, 
    dropdownItems 
  }: { 
    children: React.ReactNode; 
    dropdown?: string;
    dropdownItems?: DropdownItem[];
  }) => (
    <div 
      className="relative"
      ref={dropdownRef}
      onMouseEnter={() => dropdown && setActiveDropdown(dropdown)}
      onMouseLeave={() => dropdown && setActiveDropdown(null)}
    >
      {children}
      {dropdownItems && (
        <DropdownMenu items={dropdownItems} isOpen={activeDropdown === dropdown} />
      )}
    </div>
  );

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-xl shadow-lg border-b border-gray-200/50' 
          : 'bg-white/80 backdrop-blur-md'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <NavItem dropdown="buy" dropdownItems={buyItems}>
                <button className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200 group">
                  <span>Buy</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
                    activeDropdown === 'buy' ? 'rotate-180' : ''
                  }`} />
                </button>
              </NavItem>

              <NavItem dropdown="rent" dropdownItems={rentItems}>
                <button className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200 group">
                  <span>Rent</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
                    activeDropdown === 'rent' ? 'rotate-180' : ''
                  }`} />
                </button>
              </NavItem>
            </div>

            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative bg-white p-2 rounded-lg shadow-lg">
                    <Sparkles className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Locale
                </span>
              </Link>
            </div>

            {/* Right Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              <NavItem dropdown="resources" dropdownItems={resourceItems}>
                <button className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200 group">
                  <span>Resources</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
                    activeDropdown === 'resources' ? 'rotate-180' : ''
                  }`} />
                </button>
              </NavItem>

              <Link 
                href="/signin" 
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200"
              >
                Sign In
              </Link>

              <Link 
                href="/signup" 
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Sign Up
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? 'max-h-96 opacity-100' 
            : 'max-h-0 opacity-0 pointer-events-none'
        }`}>
          <div className="bg-white/95 backdrop-blur-xl border-t border-gray-200/50 px-4 py-6 space-y-4">
            <div className="space-y-2">
              <Link href="/buy" className="block px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                Buy Properties
              </Link>
              <Link href="/rent" className="block px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                Rent Properties
              </Link>
              <Link href="/guides" className="block px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                Resources
              </Link>
            </div>
            
            <div className="border-t border-gray-200 pt-4 space-y-2">
              <Link href="/signin" className="block px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                Sign In
              </Link>
              <Link href="/signup" className="block px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg text-center transition-all duration-300">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-16"></div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default ModernNavbar;
