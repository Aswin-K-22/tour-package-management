import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, DollarSign, MapPin, Users, Phone, Mail, MessageSquare, Send, Star, Clock, Camera } from 'lucide-react';

const TourPackageDetails = () => {
  // Package data
  const packageData = {
    "id": 1,
    "title": "Kerala to Malaysia 4 Days 3 Nights",
    "description": "Embark on an unforgettable journey from Kerala to Malaysia! Explore vibrant cities, pristine beaches, and rich cultural heritage. This package includes guided tours, comfortable accommodations, and curated experiences to make your trip memorable.",
    "photos": [
      "https://images.unsplash.com/photo-1514282401047-d79a71fac224?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518242045170-8d7b3b1e1b0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    "termsAndConditions": [
      "Valid passport required for travel.",
      "50% payment required at booking.",
      "Cancellations within 7 days are non-refunded.",
      "Travel insurance is recommended."
    ],
    "schedules": [
      {
        "id": 1,
        "title": "Malaysia Trip in Dec",
        "fromDate": "2025-12-01",
        "toDate": "2025-12-04",
        "amount": "$799",
        "description": "Winter getaway to Malaysia with guided city tours and beach visits.",
        "photo": "https://images.unsplash.com/photo-1514282401047-d79a71fac224?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
      },
      {
        "id": 2,
        "title": "Malaysia Trip in Jan",
        "fromDate": "2026-01-10",
        "toDate": "2026-01-13",
        "amount": "$850",
        "description": "Explore Malaysia's cultural landmarks and vibrant markets in January.",
        "photo": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
      },
      {
        "id": 3,
        "title": "Malaysia Trip in Feb",
        "fromDate": "2026-02-15",
        "toDate": "2026-02-18",
        "amount": "$820",
        "description": "Enjoy a relaxing trip with scenic tours and luxury stays in Malaysia.",
        "photo": "https://images.unsplash.com/photo-1518242045170-8d7b3b1e1b0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
      }
    ]
  };

  // State management
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    selectedSchedule: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Image carousel handlers
  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === packageData.photos.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? packageData.photos.length - 1 : prev - 1
    );
  };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Form submitted:', formData);
      setShowSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        selectedSchedule: ''
      });
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Section with Image Carousel */}
        <div className="relative mb-12 rounded-3xl overflow-hidden shadow-2xl bg-white">
          <div className="relative h-96 md:h-[500px] overflow-hidden">
            <img
              src={packageData.photos[currentImageIndex]}
              alt={`${packageData.title} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              loading="lazy"
            />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            
            {/* Navigation buttons */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 rounded-full p-3 group"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300 rounded-full p-3 group"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
            </button>
            
            {/* Image indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {packageData.photos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
            
            {/* Title overlay */}
            <div className="absolute bottom-8 left-8 right-8">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                {packageData.title}
              </h1>
              <div className="flex items-center space-x-4 text-white/90">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="ml-2">4.9 (128 reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column - Package Details */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Description Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <MapPin className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-800">About This Package</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                {packageData.description}
              </p>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl">
                  <Clock className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-800">Duration</p>
                    <p className="text-sm text-gray-600">4 Days 3 Nights</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl">
                  <Users className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="font-semibold text-gray-800">Group Size</p>
                    <p className="text-sm text-gray-600">2-15 People</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-xl">
                  <Camera className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="font-semibold text-gray-800">Activities</p>
                    <p className="text-sm text-gray-600">Sightseeing & More</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Schedules Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <Calendar className="h-6 w-6 text-green-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-800">Available Schedules</h2>
              </div>
              
              <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
                {packageData.schedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/3">
                        <img
                          src={schedule.photo}
                          alt={schedule.title}
                          className="w-full h-48 md:h-32 object-cover rounded-lg"
                          loading="lazy"
                        />
                      </div>
                      
                      <div className="md:w-2/3 space-y-3">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-bold text-gray-800">{schedule.title}</h3>
                          <span className="text-2xl font-bold text-green-600">{schedule.amount}</span>
                        </div>
                        
                        <p className="text-gray-600">{schedule.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>From: {formatDate(schedule.fromDate)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>To: {formatDate(schedule.toDate)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Terms & Conditions</h2>
              <div className="space-y-3">
                {packageData.termsAndConditions.map((term, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-600">{term}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Enquiry Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-6">
                  <MessageSquare className="h-6 w-6 text-purple-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-800">Send Enquiry</h2>
                </div>

                {showSuccess && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 font-medium">
                      ✓ Your enquiry has been sent successfully! We'll get back to you soon.
                    </p>
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="selectedSchedule" className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Schedule
                    </label>
                    <select
                      id="selectedSchedule"
                      name="selectedSchedule"
                      value={formData.selectedSchedule}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="">Select a schedule</option>
                      {packageData.schedules.map((schedule) => (
                        <option key={schedule.id} value={schedule.id}>
                          {schedule.title} - {schedule.amount}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                      placeholder="Tell us about your requirements..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        <span>Send Enquiry</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500 text-center">
                    Our team will respond within 24 hours
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourPackageDetails;