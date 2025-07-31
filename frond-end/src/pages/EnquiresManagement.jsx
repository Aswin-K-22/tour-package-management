import React, { useState, useEffect } from 'react';
import { Eye, Trash2, Mail, Phone, Package, Calendar, X, AlertTriangle } from 'lucide-react';
import { getEnquiries } from '../services/enquiryApi';

const EnquiriesManagement = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [enquiryToDelete, setEnquiryToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const limit = 10; // Number of enquiries per page

  // Function to fetch enquiries from API
  const fetchEnquiries = async (page) => {
    setIsLoading(true);
    try {
      const response = await getEnquiries(page, limit);
      console.log('API response:', response);

      // Transform API response to match the component's expected format
      const transformedEnquiries = (response.data || []).map(enquiry => ({
        id: enquiry.id || 'N/A',
        name: enquiry.name || 'Unknown',
        email: enquiry.email || 'N/A',
        phone: enquiry.phone || 'N/A',
        message: enquiry.message || 'No message provided',
        createdAt: enquiry.createdAt || new Date().toISOString(),
        updatedAt: enquiry.updatedAt || new Date().toISOString(),
        packageTitle: enquiry.package?.title || 'N/A',
        scheduleTitle: enquiry.schedule?.title || null
      }));

      setEnquiries(transformedEnquiries);
      setTotalPages(response.meta?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
      setEnquiries([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch enquiries on component mount and page change
  useEffect(() => {
    fetchEnquiries(currentPage);
  }, [currentPage]);

  const truncateMessage = (message, maxLength = 80) => {
    return typeof message === 'string' && message.length > maxLength 
      ? message.substring(0, maxLength) + '...' 
      : message || 'N/A';
  };

  const handleViewDetails = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setShowDetailsModal(true);
  };

  const handleDeleteClick = (enquiry) => {
    setEnquiryToDelete(enquiry);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (enquiryToDelete) {
      try {
        await fetch(`/api/enquiries/${enquiryToDelete.id}`, { method: 'DELETE' });
        setEnquiries(prev => prev.filter(enquiry => enquiry.id !== enquiryToDelete.id));
        console.log(`Enquiry deleted: ID ${enquiryToDelete.id} - ${enquiryToDelete.name}`);
      } catch (error) {
        console.error('Error deleting enquiry:', error);
      }
      setShowDeleteModal(false);
      setEnquiryToDelete(null);
    }
  };

  const closeModals = () => {
    setShowDetailsModal(false);
    setShowDeleteModal(false);
    setSelectedEnquiry(null);
    setEnquiryToDelete(null);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const formatDate = (date) => {
    return date 
      ? new Date(date).toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }) 
      : 'N/A';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Manage Enquiries</h1>
              <p className="text-slate-600">Monitor and manage customer enquiries for tour packages</p>
            </div>
            <div className="hidden sm:flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                Total: {enquiries.length} Enquiries
              </div>
            </div>
          </div>
        </div>

        {/* Enquiries Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {isLoading ? (
            <div className="p-6 text-center text-slate-600">Loading...</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-slate-800 to-slate-700 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider hidden md:table-cell">Contact</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Message</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider hidden lg:table-cell">Package/Schedule</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {enquiries.map((enquiry, index) => (
                      <tr
                        key={enquiry.id}
                        className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {enquiry.id.slice(-4)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-slate-900">{enquiry.name}</div>
                            <div className="text-sm text-slate-500 md:hidden">{enquiry.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <div className="space-y-1">
                            <div className="flex items-center text-sm text-slate-600">
                              <Mail className="w-4 h-4 mr-2 text-blue-500" />
                              {enquiry.email}
                            </div>
                            <div className="flex items-center text-sm text-slate-600">
                              <Phone className="w-4 h-4 mr-2 text-green-500" />
                              {enquiry.phone}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-700 leading-relaxed max-w-xs">
                            {truncateMessage(enquiry.message)}
                          </p>
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell">
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <Package className="w-4 h-4 mr-2 text-orange-500" />
                              <span className="text-sm text-slate-700 font-medium">{enquiry.packageTitle}</span>
                            </div>
                            {enquiry.scheduleTitle && (
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                                <span className="text-sm text-slate-600">{enquiry.scheduleTitle}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => handleViewDetails(enquiry)}
                              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-2 rounded-lg transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
                              aria-label={`View details for ${enquiry.name}`}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(enquiry)}
                              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-2 rounded-lg transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
                              aria-label={`Delete enquiry from ${enquiry.name}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination Controls */}
              <div className="p-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-slate-200 text-slate-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-slate-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-slate-200 text-slate-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>

        {/* View Details Modal */}
        {showDetailsModal && selectedEnquiry && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-800">Enquiry Details</h2>
                  <button
                    onClick={closeModals}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Enquiry ID</label>
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg inline-block text-sm font-bold">
                      #{selectedEnquiry.id}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Customer Name</label>
                    <p className="text-lg font-semibold text-slate-800">{selectedEnquiry.name}</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Email</label>
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 mr-3 text-blue-500" />
                      <p className="text-slate-800">{selectedEnquiry.email}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Phone</label>
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 mr-3 text-green-500" />
                      <p className="text-slate-800">{selectedEnquiry.phone}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Package</label>
                  <div className="flex items-center bg-orange-50 p-4 rounded-lg">
                    <Package className="w-5 h-5 mr-3 text-orange-500" />
                    <p className="text-slate-800 font-medium">{selectedEnquiry.packageTitle}</p>
                  </div>
                </div>
                {selectedEnquiry.scheduleTitle && (
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Schedule</label>
                    <div className="flex items-center bg-purple-50 p-4 rounded-lg">
                      <Calendar className="w-5 h-5 mr-3 text-purple-500" />
                      <p className="text-slate-800 font-medium">{selectedEnquiry.scheduleTitle}</p>
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Message</label>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <p className="text-slate-800 leading-relaxed">{selectedEnquiry.message}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Created At</label>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <p className="text-slate-800">{formatDate(selectedEnquiry.createdAt)}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Updated At</label>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <p className="text-slate-800">{formatDate(selectedEnquiry.updatedAt)}</p>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-slate-200">
                <button
                  onClick={closeModals}
                  className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white px-6 py-2 rounded-lg transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && enquiryToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-red-100 p-3 rounded-full mr-4">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">Confirm Deletion</h2>
                </div>
                <p className="text-slate-600 mb-6">
                  Are you sure you want to delete the enquiry from <strong>{enquiryToDelete.name}</strong>? 
                  This action cannot be undone.
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={closeModals}
                    className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnquiriesManagement;