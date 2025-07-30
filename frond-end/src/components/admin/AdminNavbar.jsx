import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Home, 
  Globe, 
  Building, 
  Package, 
  Calendar, 
  MessageSquare, 
  LogOut, 
  LogIn, 
  User 
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { logout } from '../../services/authApi';
import { toast } from 'react-toastify';

const AdminNavbar = () => {
  const { user, isLoggedIn, logout: logoutContext } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get current URL
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

 const handleLogout = async () => {
    try {
      await logout(); // Call the logout API
      logoutContext(); // Clear auth context
      toast.success('Logged out successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
      navigate('/admin/auth'); // Redirect to auth page
    } catch (error) {
      console.error("Logout error:", error);
      alert(`Logout failed: ${error.message}`);
    }
  };

  const navItems = isLoggedIn ? [
    { name: 'Dashboard', icon: Home, href: '/admin/dashboard' },
    { name: 'Countries', icon: Globe, href: '/admin/countries' },
    { name: 'Cities', icon: Building, href: '/admin/cities' },
    { name: 'Packages', icon: Package, href: '/admin/packages' },
    { name: 'Schedules', icon: Calendar, href: '/admin/schedules' },
    { name: 'Enquiries', icon: MessageSquare, href: '/admin/enquiries' },
  ] : [];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Branding */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                {isLoggedIn ? `Welcome, ${user?.name || 'Admin'}` : 'Tour Admin'}
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href; // Check if current route matches item's href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white hover:shadow-lg hover:shadow-slate-700/30'
                    }`}
                    aria-label={`Navigate to ${item.name}`}
                  >
                    <Icon className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <div className="flex items-center space-x-2 text-slate-300">
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium">{user?.name || 'Admin User'}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="group flex items-center px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-700 hover:bg-red-600 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-red-600/30"
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/admin/auth"
                className="group flex items-center px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-700 hover:bg-blue-600 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/30"
                aria-label="Login"
              >
                <LogIn className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-200"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${
        isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-slate-800 border-t border-slate-700">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href; // Check if current route matches item's href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label={`Navigate to ${item.name}`}
              >
                <Icon className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-200" />
                {item.name}
              </Link>
            );
          })}
          
          {/* Mobile User Actions */}
          <div className="border-t border-slate-700 pt-4 mt-4">
            {isLoggedIn ? (
              <>
                <div className="flex items-center px-3 py-2 text-slate-300">
                  <User className="w-5 h-5 mr-3" />
                  <span className="text-base font-medium">{user?.name || 'Admin User'}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="group w-full flex items-center px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-red-600 rounded-lg transition-all duration-200"
                  aria-label="Logout"
                >
                  <LogOut className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-200" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/admin/auth"
                className="group w-full flex items-center px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-blue-600 rounded-lg transition-all duration-200"
                aria-label="Login"
              >
                <LogIn className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-200" />
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;