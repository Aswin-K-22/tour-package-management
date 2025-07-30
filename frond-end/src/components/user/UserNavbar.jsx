import React, { useState, useEffect } from 'react';
import { Menu, X, Plane, Phone, Mail, User } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Packages', href: '/packages' },
    { name: 'Destinations', href: '/destinations' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ];

  return (
  <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg backdrop-blur-md bg-opacity-95' : 'bg-gray-900 bg-opacity-80 backdrop-blur-md'}`}>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0">
    <div className="flex justify-between items-center h-16">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <div
          className={`p-2 rounded-xl transition-all duration-300 ${isScrolled ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-white bg-opacity-20 backdrop-blur-sm'}`}
        >
          <Plane
            className={`w-6 h-6 ${isScrolled ? 'text-white' : 'text-blue-300'}`} // Ensure icon color contrasts
          />
        </div>
        <div className="hidden sm:block">
          <h1
            className={`text-xl font-bold transition-colors duration-300 ${isScrolled ? 'text-gray-800' : 'text-white'}`}
          >
            TourMaster
          </h1>
          <p
            className={`text-xs transition-colors duration-300 ${isScrolled ? 'text-gray-500' : 'text-gray-200'}`}
          >
            Travel & Tours
          </p>
        </div>
      </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-all duration-300 hover:scale-105 ${
                  isScrolled
                    ? 'text-gray-700 hover:text-blue-600'
                    : 'text-white hover:text-blue-300'
                } relative group`}
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>

          {/* Contact Info & CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center space-x-2 text-sm ${
                  isScrolled ? 'text-gray-600' : 'text-white'
                }`}
              >
                <Phone className="w-4 h-4" />
                <span className="hidden xl:inline">+91 9876543210</span>
              </div>
              <div
                className={`flex items-center space-x-2 text-sm ${
                  isScrolled ? 'text-gray-600' : 'text-white'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span className="hidden xl:inline">info@tourmaster.com</span>
              </div>
            </div>
            <button
              className={`px-6 py-2 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105 ${
                isScrolled
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-blue-500/25'
                  : 'bg-white text-blue-600 hover:bg-gray-100'
              }`}
            >
              Book Now
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isScrolled
                  ? 'text-gray-700 hover:bg-gray-100'
                  : 'text-white hover:bg-white hover:bg-opacity-20'
              }`}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? 'max-h-96 opacity-100'
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div
            className={`py-4 space-y-4 ${
              isScrolled
                ? 'bg-white border-t border-gray-100'
                : 'bg-black bg-opacity-50 backdrop-blur-md'
            } rounded-b-2xl`}
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`block px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  isScrolled
                    ? 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    : 'text-white hover:text-blue-300 hover:bg-white hover:bg-opacity-10'
                } rounded-lg`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            
            {/* Mobile Contact Info */}
            <div className="px-4 pt-4 border-t border-gray-200 border-opacity-30">
              <div
                className={`flex items-center space-x-2 mb-2 text-sm ${
                  isScrolled ? 'text-gray-600' : 'text-gray-300'
                }`}
              >
                <Phone className="w-4 h-4" />
                <span>+91 9876543210</span>
              </div>
              <div
                className={`flex items-center space-x-2 mb-4 text-sm ${
                  isScrolled ? 'text-gray-600' : 'text-gray-300'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>info@tourmaster.com</span>
              </div>
              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold text-sm hover:shadow-lg transition-all duration-300">
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;