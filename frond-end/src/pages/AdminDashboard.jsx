import React from 'react';
import { Package, Calendar, MessageCircle, Users, Eye, Settings, Plus, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
const AdminDashboard = () => {
  // Dummy data
  const data = {
    stats: {
      totalPackages: 25,
      totalSchedules: 60,
      totalEnquiries: 150
    },
    recentPackages: [
      {
        id: 1,
        title: "Kerala to Malaysia 4 Days 3 Nights",
        description: "Explore vibrant Malaysia with guided tours.",
        photo: "https://images.unsplash.com/photo-1514282401047-d79a71fac224?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        amount: "$799"
      },
      {
        id: 2,
        title: "Goa to Bali Adventure 5 Days",
        description: "Dive into the tropical paradise of Bali.",
        photo: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        amount: "$999"
      },
      {
        id: 3,
        title: "Mumbai to Singapore City Tour",
        description: "Discover the futuristic cityscape of Singapore.",
        photo: "https://images.unsplash.com/photo-1515036551092-39b3e1fa4627?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        amount: "$850"
      }
    ],
    recentSchedules: [
      {
        id: 1,
        title: "Malaysia Trip in Dec",
        packageTitle: "Kerala to Malaysia",
        fromDate: "2025-12-01",
        toDate: "2025-12-04",
        amount: "$799"
      },
      {
        id: 2,
        title: "Bali Trip in Jan",
        packageTitle: "Goa to Bali",
        fromDate: "2026-01-10",
        toDate: "2026-01-15",
        amount: "$999"
      },
      {
        id: 3,
        title: "Singapore Tour in Feb",
        packageTitle: "Mumbai to Singapore",
        fromDate: "2026-02-15",
        toDate: "2026-02-18",
        amount: "$850"
      }
    ]
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const StatCard = ({ icon: Icon, title, value, color, bgColor }) => (
    <div className={`${bgColor} p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-white/20`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
        </div>
        <div className={`${color} p-3 rounded-full bg-white/20`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="mt-4 flex items-center text-white/80">
        <TrendingUp className="w-4 h-4 mr-1" />
        <span className="text-sm">+12% from last month</span>
      </div>
    </div>
  );

  const QuickLinkCard = ({ icon: Icon, title, description, color, bgGradient }) => (
    <div className={`${bgGradient} p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer group border border-white/20`}>
      <div className={`${color} p-3 rounded-full bg-white/20 mb-4 group-hover:bg-white/30 transition-colors duration-300`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-white/80 text-sm">{description}</p>
    </div>
  );

  const PackageCard = ({ pkg }) => (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={pkg.photo} 
          alt={pkg.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        <div className="absolute top-4 right-4">
          <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {pkg.amount}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{pkg.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{pkg.description}</p>
        <div className="flex items-center justify-between">
          <button className="flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
            <Eye className="w-4 h-4 mr-1" />
            View Details
          </button>
          <button className="text-gray-500 hover:text-gray-700 transition-colors duration-200">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const ScheduleCard = ({ schedule }) => (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 p-6 border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{schedule.title}</h3>
          <p className="text-gray-600 text-sm mb-2">{schedule.packageTitle}</p>
        </div>
        <span className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {schedule.amount}
        </span>
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-1" />
          <span>{formatDate(schedule.fromDate)}</span>
        </div>
        <span className="text-gray-400">to</span>
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-1" />
          <span>{formatDate(schedule.toDate)}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <button className="flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
          <Eye className="w-4 h-4 mr-1" />
          View Schedule
        </button>
        <button className="text-gray-500 hover:text-gray-700 transition-colors duration-200">
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your tours.</p>
            </div>
            <Link
  to="/admin/banners"
  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
>
  <Plus className="w-4 h-4 mr-2" />
  Add Banner
</Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={Package}
            title="Total Packages"
            value={data.stats.totalPackages}
            color="text-blue-600"
            bgColor="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <StatCard
            icon={Calendar}
            title="Total Schedules"
            value={data.stats.totalSchedules}
            color="text-green-600"
            bgColor="bg-gradient-to-br from-green-500 to-teal-600"
          />
          <StatCard
            icon={MessageCircle}
            title="Total Enquiries"
            value={data.stats.totalEnquiries}
            color="text-purple-600"
            bgColor="bg-gradient-to-br from-purple-500 to-pink-600"
          />
        </div>

        {/* Quick Links */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <QuickLinkCard
              icon={Package}
              title="Manage Packages"
              description="Create, edit, and organize tour packages"
              color="text-blue-600"
              bgGradient="bg-gradient-to-br from-blue-500 to-blue-600"
            />
            <QuickLinkCard
              icon={Calendar}
              title="Manage Schedules"
              description="Plan and schedule upcoming tours"
              color="text-green-600"
              bgGradient="bg-gradient-to-br from-green-500 to-teal-600"
            />
            <QuickLinkCard
              icon={MessageCircle}
              title="View Enquiries"
              description="Review and respond to customer inquiries"
              color="text-purple-600"
              bgGradient="bg-gradient-to-br from-purple-500 to-pink-600"
            />
            <QuickLinkCard
              icon={Users}
              title="Customer Management"
              description="Manage customer accounts and bookings"
              color="text-orange-600"
              bgGradient="bg-gradient-to-br from-orange-500 to-red-500"
            />
          </div>
        </div>

        {/* Recent Packages */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Recent Packages</h2>
            <button className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
              View All →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.recentPackages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </div>

        {/* Recent Schedules */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Recent Schedules</h2>
            <button className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
              View All →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.recentSchedules.map((schedule) => (
              <ScheduleCard key={schedule.id} schedule={schedule} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;