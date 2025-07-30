import React from 'react';
import { CheckCircle, ArrowLeft, Mail, Clock } from 'lucide-react';

const ThankYouPage = () => {
  // Dummy data as specified
  const pageData = {
    title: "Thank You for Your Enquiry!",
    message: "We have successfully received your enquiry. Our team will review your request and get back to you within 24-48 hours. In the meantime, feel free to explore more of our exciting tour packages!",
    ctaText: "Back to Packages",
    ctaLink: "/packages",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  };

  const handleCTAClick = () => {
    // In a real app, this would navigate to the packages page
    console.log(`Navigating to ${pageData.ctaLink}`);
    alert('In a real app, this would navigate to the packages page');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      </div>

      <div className="relative w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm bg-opacity-95 border border-gray-100">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Content Section */}
            <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
              {/* Success Icon */}
              <div className="mb-8 flex justify-center lg:justify-start">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute inset-0 w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-ping opacity-20"></div>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6 leading-tight text-center lg:text-left">
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {pageData.title}
                </span>
              </h1>

              {/* Message */}
              <p className="text-gray-600 text-lg leading-relaxed mb-8 text-center lg:text-left">
                {pageData.message}
              </p>

              {/* Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Email Confirmation</p>
                    <p className="text-xs text-gray-600">Sent to your inbox</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-cyan-50 rounded-xl border border-cyan-100">
                  <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-cyan-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Response Time</p>
                    <p className="text-xs text-gray-600">24-48 hours</p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={handleCTAClick}
                  className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50"
                >
                  <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                  {pageData.ctaText}
                </button>
                <button className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 font-semibold rounded-2xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-300 focus:ring-opacity-50">
                  Contact Support
                </button>
              </div>
            </div>

            {/* Image Section */}
            <div className="relative lg:min-h-[600px] h-64 lg:h-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 z-10"></div>
              <img
                src={pageData.image}
                alt="Beautiful tropical beach destination representing successful tour package enquiry"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              
              {/* Floating elements */}
              <div className="absolute top-8 right-8 z-20">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-float">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-8 left-8 z-20">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                  <p className="text-sm font-semibold text-gray-800">Enquiry Submitted</p>
                  <p className="text-xs text-gray-600">Reference: #TQ2025{Math.floor(Math.random() * 1000)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional decorative elements */}
        <div className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute -bottom-6 -right-6 w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full opacity-60 animate-pulse delay-1000"></div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ThankYouPage;