import React from 'react';
import { 
  Plane, 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Heart,
  ArrowUp
} from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white w-full box-border">
      {/* Main Footer Content */}
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Company Info */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                    <Plane className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">TourMaster</h3>
                    <p className="text-sm text-gray-300">Travel & Tours</p>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  Your trusted partner for unforgettable travel experiences. We create 
                  memories that last a lifetime with our carefully curated tour packages 
                  and exceptional service.
                </p>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="p-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full transition-all duration-300 hover:scale-110"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="p-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full transition-all duration-300 hover:scale-110"
                    aria-label="Twitter"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="p-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full transition-all duration-300 hover:scale-110"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="p-2 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full transition-all duration-300 hover:scale-110"
                    aria-label="YouTube"
                  >
                    <Youtube className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div className="space-y-6">
                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                <div className="space-y-3">
                  {[
                    { name: 'Home', href: '/' },
                    { name: 'Tour Packages', href: '/packages' },
                    { name: 'Destinations', href: '/destinations' },
                    { name: 'About Us', href: '/about' },
                    { name: 'Contact', href: '/contact' },
                    { name: 'Blog', href: '/blog' }
                  ].map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      className="block text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-2 transform"
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
              </div>

              {/* Popular Destinations */}
              <div className="space-y-6">
                <h4 className="text-lg font-semibold mb-4">Popular Destinations</h4>
                <div className="space-y-3">
                  {[
                    { name: 'Malaysia', href: '/destinations/malaysia' },
                    { name: 'Bali, Indonesia', href: '/destinations/bali' },
                    { name: 'Singapore', href: '/destinations/singapore' },
                    { name: 'Thailand', href: '/destinations/thailand' },
                    { name: 'Dubai, UAE', href: '/destinations/dubai' },
                    { name: 'Maldives', href: '/destinations/maldives' }
                  ].map((destination) => (
                    <a
                      key={destination.name}
                      href={destination.href}
                      className="block text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-2 transform"
                    >
                      {destination.name}
                    </a>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-6">
                <h4 className="text-lg font-semibold mb-4">Get In Touch</h4>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-300">
                        123 Travel Street, Tourism District<br />
                        Kochi, Kerala 682001, India
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <div>
                      <p className="text-gray-300">+91 9876543210</p>
                      <p className="text-gray-300">+91 8765432109</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    <div>
                      <p className="text-gray-300">info@tourmaster.com</p>
                      <p className="text-gray-300">support@tourmaster.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-700 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
                  <p className="text-gray-300 text-sm">
                    © 2025 TourMaster. All rights reserved.
                  </p>
                  <div className="flex items-center text-gray-300 text-sm">
                    <span>Made with</span>
                    <Heart className="w-4 h-4 text-red-400 mx-1" />
                    <span>in Kerala, India</span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
                  <div className="flex space-x-6 text-sm">
                    <a href="/privacy" className="text-gray-300 hover:text-white transition-colors duration-300">
                      Privacy Policy
                    </a>
                    <a href="/terms" className="text-gray-300 hover:text-white transition-colors duration-300">
                      Terms of Service
                    </a>
                    <a href="/sitemap" className="text-gray-300 hover:text-white transition-colors duration-300">
                      Sitemap
                    </a>
                  </div>
                  
                  {/* Back to Top Button */}
                  <button
                    onClick={scrollToTop}
                    className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-full transition-all duration-300 hover:scale-110 group"
                    aria-label="Back to top"
                  >
                    <ArrowUp className="w-4 h-4 group-hover:animate-bounce" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Awards & Certifications */}
          <div className="border-t border-gray-700 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-wrap justify-center items-center space-x-8 text-gray-400 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">★</span>
                  </div>
                  <span>IATA Certified</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">✓</span>
                  </div>
                  <span>ISO 9001:2015</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">🛡</span>
                  </div>
                  <span>Secure Payments</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">24</span>
                  </div>
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;