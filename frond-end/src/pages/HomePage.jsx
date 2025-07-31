import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Calendar, Users, Star } from 'lucide-react';
import { getSchedules } from '../services/sheduleApi'; // Import the API function

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [tourPackages, setTourPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch schedules for banner
  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true);
      try {
        // Fetch only the first page with a limit (e.g., 3 schedules for the banner)
        const response = await getSchedules(1, 3);
        const schedules = response.schedules || [];

        // Map API data to match the banner structure
        const mappedPackages = schedules.map((schedule) => ({
          id: schedule.id,
          title: schedule.title,
          description: schedule.description,
          image: schedule.photoUrls?.[0] || 'https://via.placeholder.com/1350x900', // Fallback image
          amount: `₹${schedule.amount}`, // Format amount as string with $
          buttonText: 'View Package',
          buttonLink: `/schedules/${schedule.id}`, // Adjust link to use schedule ID
          duration: formatDuration(schedule.fromDate, schedule.toDate), // Calculate duration
          location: `${schedule.package.destinationCityName}, ${schedule.package.destinationCountryName}`,
          rating: generateRandomRating(), // API doesn't provide rating, so generate one
        }));

        setTourPackages(mappedPackages);
      } catch (error) {
        console.error('Error fetching schedules for banner:', error);
        // Optionally set an error state to display to the user
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  // Helper to calculate duration between fromDate and toDate
  const formatDuration = (fromDate, toDate) => {
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const nights = days - 1;
    return `${days} Days ${nights} Nights`;
  };

  // Generate random rating (since API doesn't provide it)
  const generateRandomRating = () => {
    return (Math.random() * (5 - 4.5) + 4.5).toFixed(1); // Random rating between 4.5 and 5.0
  };

  // Auto-slide functionality
  useEffect(() => {
    if (tourPackages.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % tourPackages.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [tourPackages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % tourPackages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + tourPackages.length) % tourPackages.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Carousel Section */}
      <section className="relative h-screen overflow-hidden">
        <div className="relative w-full h-full">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
              <div className="text-white text-2xl">Loading...</div>
            </div>
          ) : tourPackages.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
              <div className="text-white text-2xl">No packages available</div>
            </div>
          ) : (
            tourPackages.map((pkg, index) => (
              <div
                key={pkg.id}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                  index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                }`}
              >
                {/* Background Image with Adjusted Overlay */}
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${pkg.image})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex items-center justify-center h-full px-4 sm:px-6 lg:px-8">
                  <div className="max-w-4xl mx-auto text-center text-white">
                    <div className="mb-6">
                      <div className="inline-flex items-center px-4 py-2 mb-4 bg-white/10 backdrop-blur-sm rounded-full">
                        <Star className="w-4 h-4 text-yellow-400 mr-2" />
                        <span className="text-sm font-medium">{pkg.rating} Rating</span>
                      </div>
                      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                        {pkg.title}
                      </h1>
                      <p className="text-lg sm:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
                        {pkg.description}
                      </p>
                    </div>

                    {/* Package Details */}
                    <div className="flex flex-wrap justify-center items-center gap-6 mb-8">
                      <div className="flex items-center">
                        <MapPin className="w-5 h-5 mr-2 text-blue-300" />
                        <span className="text-sm sm:text-base">{pkg.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-green-300" />
                        <span className="text-sm sm:text-base">{pkg.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-5 h-5 mr-2 text-purple-300" />
                        <span className="text-sm sm:text-base">All Ages</span>
                      </div>
                    </div>

                    {/* Price and CTA */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                      <div className="text-center">
                        <span className="text-2xl sm:text-3xl font-bold text-yellow-400">
                          {pkg.amount}
                        </span>
                        <span className="text-sm ml-2">per person</span>
                      </div>
                      <button
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-2xl transform hover:scale-105 transition-all duration-300 hover:shadow-blue-500/25"
                        onClick={() => window.open(pkg.buttonLink, '_self')}
                      >
                        {pkg.buttonText}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Navigation Arrows */}
          {!loading && tourPackages.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Dot Indicators */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
                {tourPackages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? 'bg-white scale-125 shadow-lg'
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              Why Choose Our Tour Packages?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience unforgettable journeys with our carefully curated tour packages
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🌟",
                title: "Premium Experience",
                description: "Luxury accommodations and exclusive experiences",
              },
              {
                icon: "🗺️",
                title: "Expert Guides",
                description: "Local expertise and insider knowledge",
              },
              {
                icon: "💎",
                title: "Best Value",
                description: "Competitive pricing with maximum value",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;