import React, { useState, useRef } from 'react';
import { Calendar, DollarSign, Edit, Trash2, Plus, X, Eye, Upload, Package } from 'lucide-react';

const PackageSchedulesManagement = () => {
  const fileInputRef = useRef(null);

  // Initial dummy data
  const packages = [
    { id: 1, title: "Kerala to Malaysia 4 Days 3 Nights" },
    { id: 2, title: "Mumbai to Singapore City Tour" },
    { id: 3, title: "Goa to Bali Adventure 5 Days" }
  ];

  const [schedules, setSchedules] = useState([
    {
      id: 1,
      title: "Malaysia Trip in Dec",
      packageId: 1,
      packageTitle: "Kerala to Malaysia 4 Days 3 Nights",
      fromDate: "2025-12-01",
      toDate: "2025-12-04",
      amount: "$799",
      description: "Winter getaway to Malaysia with guided city tours and beach visits.",
      photos: ["https://images.unsplash.com/photo-1514282401047-d79a71fac224?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"]
    },
    {
      id: 2,
      title: "Singapore Tour in Feb",
      packageId: 2,
      packageTitle: "Mumbai to Singapore City Tour",
      fromDate: "2026-02-15",
      toDate: "2026-02-18",
      amount: "$850",
      description: "Explore Singapore's futuristic cityscape and attractions.",
      photos: ["https://images.unsplash.com/photo-1515036551092-39b3e1fa4627?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"]
    },
    {
      id: 3,
      title: "Bali Trip in Jan",
      packageId: 3,
      packageTitle: "Goa to Bali Adventure 5 Days",
      fromDate: "2026-01-10",
      toDate: "2026-01-15",
      amount: "$999",
      description: "Adventure-filled trip to Bali with beach and cultural tours.",
      photos: ["https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"]
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [deleteScheduleId, setDeleteScheduleId] = useState(null);
  const [previewPhotos, setPreviewPhotos] = useState([]);
  const [formData, setFormData] = useState({
    packageId: '',
    title: '',
    fromDate: '',
    toDate: '',
    amount: '',
    description: '',
    photos: []
  });

  const resetForm = () => {
    setFormData({
      packageId: '',
      title: '',
      fromDate: '',
      toDate: '',
      amount: '',
      description: '',
      photos: []
    });
    setPreviewPhotos([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = [];
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        previews.push(e.target.result);
        if (previews.length === files.length) {
          setPreviewPhotos(previews);
        }
      };
      reader.readAsDataURL(file);
    });
    
    setFormData(prev => ({ ...prev, photos: files }));
  };

  const removePhoto = (index) => {
    const newPreviews = previewPhotos.filter((_, i) => i !== index);
    const newFiles = Array.from(formData.photos).filter((_, i) => i !== index);
    setPreviewPhotos(newPreviews);
    setFormData(prev => ({ ...prev, photos: newFiles }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedPackage = packages.find(p => p.id === parseInt(formData.packageId));
    
    if (editingSchedule) {
      setSchedules(prev => prev.map(schedule => 
        schedule.id === editingSchedule.id 
          ? {
              ...schedule,
              ...formData,
              packageId: parseInt(formData.packageId),
              packageTitle: selectedPackage?.title || '',
              photos: previewPhotos.length > 0 ? previewPhotos : schedule.photos
            }
          : schedule
      ));
      console.log('Updated schedule:', { ...editingSchedule, ...formData });
      setEditingSchedule(null);
    } else {
      const newSchedule = {
        id: Math.max(...schedules.map(s => s.id)) + 1,
        ...formData,
        packageId: parseInt(formData.packageId),
        packageTitle: selectedPackage?.title || '',
        photos: previewPhotos
      };
      setSchedules(prev => [...prev, newSchedule]);
      console.log('Added new schedule:', newSchedule);
    }
    
    resetForm();
    setShowForm(false);
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      packageId: schedule.packageId.toString(),
      title: schedule.title,
      fromDate: schedule.fromDate,
      toDate: schedule.toDate,
      amount: schedule.amount,
      description: schedule.description,
      photos: []
    });
    setPreviewPhotos(schedule.photos || []);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setSchedules(prev => prev.filter(schedule => schedule.id !== id));
    console.log('Deleted schedule with ID:', id);
    setDeleteScheduleId(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Package Schedules</h1>
              <p className="text-gray-600">Create and manage tour package schedules</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Schedule
            </button>
          </div>
        </div>

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingSchedule ? 'Edit Schedule' : 'Add New Schedule'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingSchedule(null);
                      resetForm();
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Package Selection */}
                  <div>
                    <label htmlFor="packageId" className="block text-sm font-medium text-gray-700 mb-2">
                      Tour Package *
                    </label>
                    <select
                      id="packageId"
                      name="packageId"
                      value={formData.packageId}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select a package</option>
                      {packages.map(pkg => (
                        <option key={pkg.id} value={pkg.id}>{pkg.title}</option>
                      ))}
                    </select>
                  </div>

                  {/* Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Schedule Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter schedule title"
                    />
                  </div>

                  {/* From Date */}
                  <div>
                    <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700 mb-2">
                      From Date *
                    </label>
                    <input
                      type="date"
                      id="fromDate"
                      name="fromDate"
                      value={formData.fromDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  {/* To Date */}
                  <div>
                    <label htmlFor="toDate" className="block text-sm font-medium text-gray-700 mb-2">
                      To Date *
                    </label>
                    <input
                      type="date"
                      id="toDate"
                      name="toDate"
                      value={formData.toDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  {/* Amount */}
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                      Amount *
                    </label>
                    <input
                      type="text"
                      id="amount"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., $799"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter schedule description"
                  />
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photos
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      multiple
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="text-center">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Photos
                      </button>
                      <p className="text-sm text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>

                  {/* Photo Previews */}
                  {previewPhotos.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {previewPhotos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={photo}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
                  >
                    {editingSchedule ? 'Update Schedule' : 'Add Schedule'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingSchedule(null);
                      resetForm();
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteScheduleId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Schedule</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Are you sure you want to delete this schedule? This action cannot be undone.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleDelete(deleteScheduleId)}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setDeleteScheduleId(null)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Schedules Table/Grid */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Existing Schedules</h2>
            <p className="text-gray-600 mt-1">Manage your tour package schedules</p>
          </div>

          {schedules.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No schedules found</h3>
              <p className="text-gray-500">Get started by adding your first schedule</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photos</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {schedules.map((schedule) => (
                    <tr key={schedule.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{schedule.id}</td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{schedule.title}</div>
                          <div className="text-sm text-gray-500">{schedule.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{schedule.packageTitle}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center mb-1">
                            <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                            {formatDate(schedule.fromDate)}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                            {formatDate(schedule.toDate)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm font-medium text-green-600">
                          <DollarSign className="w-4 h-4 mr-1" />
                          {schedule.amount}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex -space-x-2">
                          {schedule.photos?.slice(0, 3).map((photo, index) => (
                            <img
                              key={index}
                              src={photo}
                              alt="Schedule"
                              className="w-8 h-8 rounded-full border-2 border-white object-cover"
                            />
                          ))}
                          {schedule.photos?.length > 3 && (
                            <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                              +{schedule.photos.length - 3}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(schedule)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            aria-label="Edit schedule"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteScheduleId(schedule.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            aria-label="Delete schedule"
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
          )}
        </div>
      </div>
    </div>
  );
};

export default PackageSchedulesManagement;