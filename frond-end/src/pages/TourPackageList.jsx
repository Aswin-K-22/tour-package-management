import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, ArrowRight, Heart } from 'lucide-react';
import { getTourPackages } from '../services/tourPackageApi';

const PackagesListPage = () => {
  const [packages, setPackages] = useState([]);
  const [favoritePackages, setFavoritePackages] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const packagesPerPage = 6;

  useEffect(() => {
    fetchPackages();
  }, [currentPage]);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const response = await getTourPackages(currentPage, packagesPerPage);
      console.log('response', response);
      const tourPackages = response.packages || [];
      const mappedPackages = tourPackages.map((pkg) => ({
        id: pkg.id,
        name: pkg.title || 'N/A',
        description: pkg.description || 'N/A',
        photo: pkg.photoUrls?.[0] || 'https://via.placeholder.com/600x400',
        amount: 'N/A', // Amount not in response
        detailsLink: `/package/${pkg.id}`,
        location: (pkg.destinationCityName && pkg.destinationCountryName) ? `${pkg.destinationCityName}, ${pkg.destinationCountryName}` : 'N/A',
        rating: generateRandomRating(), // Kept random as per original code
        originalPrice: 'N/A', // Original price not in response
      }));
      setPackages(mappedPackages);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error('Error fetching tour packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRandomRating = () => {
    return (Math.random() * (5 - 4.5) + 4.5).toFixed(1);
  };

  const toggleFavorite = (packageId) => {
    setFavoritePackages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(packageId)) {
        newSet.delete(packageId);
      } else {
        newSet.add(packageId);
      }
      return newSet;
    });
  };

  const PackageCard = ({ pkg, index }) => (
    <div
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="relative overflow-hidden h-56">
        <img
          src={pkg.photo}
          alt={pkg.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <button
          onClick={() => toggleFavorite(pkg.id)}
          className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full transition-all duration-300 hover:bg-white/30"
          aria-label="Add to favorites"
        >
          <Heart
            className={`w-5 h-5 transition-colors duration-300 ${
              favoritePackages.has(pkg.id) ? 'text-red-500 fill-red-500' : 'text-white'
            }`}
          />
        </button>
        <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {pkg.amount}
        </div>
        <div className="absolute bottom-4 left-4 flex items-center bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
          <span className="text-sm font-semibold text-gray-800">{pkg.rating}</span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{pkg.location}</span>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
          {pkg.name}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
          {pkg.description}
        </p>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-green-600">{pkg.amount}</span>
            {pkg.originalPrice && (
              <span className="text-sm text-gray-400 line-through">{pkg.originalPrice}</span>
            )}
          </div>
          <span className="text-sm text-green-600 font-medium">per person</span>
        </div>
        <Link
          to={pkg.detailsLink}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center group"
        >
          <span>View Details</span>
          <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );

  const LoadingCard = () => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
      <div className="h-56 bg-gray-300"></div>
      <div className="p-6">
        <div className="h-4 bg-gray-300 rounded mb-2"></div>
        <div className="h-6 bg-gray-300 rounded mb-3"></div>
        <div className="h-4 bg-gray-300 rounded mb-4"></div>
        <div className="h-4 bg-gray-300 rounded mb-4"></div>
        <div className="h-12 bg-gray-300 rounded"></div>
      </div>
    </div>
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white py-20 px-4">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Discover Amazing
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Tour Packages
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Embark on unforgettable journeys with our carefully curated travel experiences
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Featured Packages
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose from our selection of premium tour packages designed to create lasting memories
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => <LoadingCard key={index} />)
            : packages.map((pkg, index) => <PackageCard key={pkg.id} pkg={pkg} index={index} />)}
        </div>
        {!loading && totalPages > 1 && (
          <div className="p-6 flex justify-between items-center">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
        {!loading && (
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-2xl shadow-2xl">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Can't Find What You're Looking For?
              </h3>
              <p className="text-lg mb-6 text-blue-100">
                Let us create a custom package just for you
              </p>
              <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors duration-300 transform hover:scale-105">
                Contact Us
              </button>
            </div>
          </div>
        )}
      </div>
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default PackagesListPage;