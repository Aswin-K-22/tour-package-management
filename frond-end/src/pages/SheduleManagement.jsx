import React, { useState, useEffect, useRef } from 'react';
import { Calendar, IndianRupee, Edit, Trash2, Plus, X, Upload, Package } from 'lucide-react';
import { addSchedule, getSchedules, editSchedule, deleteSchedule } from '../services/sheduleApi';
import { getAllTourPackages } from '../services/tourPackageApi';
import { toast } from 'react-toastify';

const PackageSchedulesManagement = () => {
  const fileInputRef = useRef(null);
  const [schedules, setSchedules] = useState([]);
  const [packages, setPackages] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [deleteScheduleId, setDeleteScheduleId] = useState(null);
  const [previewPhotos, setPreviewPhotos] = useState([]);
  const [existingPhotoKeys, setExistingPhotoKeys] = useState([]); // Track existing photo keys
  const [deletePhotoKeys, setDeletePhotoKeys] = useState([]); // Track keys of photos to delete
  const [newPhotos, setNewPhotos] = useState([]); // Track new uploaded files
  const [formData, setFormData] = useState({
    package: '',
    title: '',
    fromDate: '',
    toDate: '',
    amount: '',
    description: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [packagesLoading, setPackagesLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch packages and schedules on mount
  useEffect(() => {
    fetchPackages();
    fetchSchedules();
  }, [page]);

  const fetchPackages = async () => {
    try {
      setPackagesLoading(true);
      const data = await getAllTourPackages();
      console.log('Fetched packages:', data);
      setPackages(Array.isArray(data.packages) ? data.packages : []);
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast.error('Failed to fetch packages');
      setPackages([]);
    } finally {
      setPackagesLoading(false);
    }
  };

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const data = await getSchedules(page, 10);
      console.log('Fetched schedules:', data);
      setSchedules(Array.isArray(data.schedules) ? data.schedules : []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      toast.error('Failed to fetch schedules');
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    if (!formData.package) errors.package = 'Package is required';
    if (!formData.title) errors.title = 'Title is required';
    if (!formData.fromDate) errors.fromDate = 'From date is required';
    if (!formData.toDate) errors.toDate = 'To date is required';
    if (!formData.amount || isNaN(formData.amount)) errors.amount = 'Valid amount is required';
    if (!formData.description) errors.description = 'Description is required';
    if (formData.fromDate && formData.toDate && new Date(formData.fromDate) > new Date(formData.toDate)) {
      errors.toDate = 'To date must be after from date';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      package: '',
      title: '',
      fromDate: '',
      toDate: '',
      amount: '',
      description: '',
    });
    setPreviewPhotos([]);
    setExistingPhotoKeys([]);
    setDeletePhotoKeys([]);
    setNewPhotos([]);
    setFormErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    console.log('Selected files:', files.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
    })));
    if (files.length + previewPhotos.length > 10) {
      toast.error('Maximum 10 photos allowed');
      return;
    }
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewPhotos((prev) => [...prev, ...previews]);
    setNewPhotos((prev) => [...prev, ...files]);
  };

  const removePhoto = (index) => {
    setPreviewPhotos((prev) => prev.filter((_, i) => i !== index));
    if (index < existingPhotoKeys.length) {
      // If removing an existing photo, add its key to deletePhotoKeys
      setDeletePhotoKeys((prev) => [...prev, existingPhotoKeys[index]]);
      setExistingPhotoKeys((prev) => prev.filter((_, i) => i !== index));
    } else {
      // If removing a new photo, update newPhotos
      const newPhotoIndex = index - existingPhotoKeys.length;
      setNewPhotos((prev) => prev.filter((_, i) => i !== newPhotoIndex));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('packageId', formData.package);
    formDataToSend.append('fromDate', formData.fromDate);
    formDataToSend.append('toDate', formData.toDate);
    formDataToSend.append('amount', formData.amount);
    formDataToSend.append('description', formData.description);

    // Append new photos
    newPhotos.forEach((file, index) => {
      formDataToSend.append('photos', file);
      console.log(`Appending photo ${index + 1}:`, {
        name: file.name,
        size: file.size,
        type: file.type,
      });
    });

    // Append deletePhotoKeys for editing
    if (editingSchedule && deletePhotoKeys.length > 0) {
      formDataToSend.append('deletePhotoKeys', JSON.stringify(deletePhotoKeys));
      console.log('deletePhotoKeys:', deletePhotoKeys);
    }

    console.log('FormData to send:');
    for (let [key, value] of formDataToSend.entries()) {
      console.log(`${key}:`, value instanceof File ? { name: value.name, size: value.size, type: value.type } : value);
    }

    try {
      if (editingSchedule) {
        await editSchedule(editingSchedule.id, formDataToSend);
        toast.success('Schedule updated successfully');
      } else {
        await addSchedule(formDataToSend);
        toast.success('Schedule created successfully');
      }
      await fetchSchedules();
      setShowForm(false);
      setEditingSchedule(null);
      resetForm();
    } catch (error) {
      console.error('Error submitting schedule:', error);
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      package: schedule.package.id,
      title: schedule.title,
      fromDate: schedule.fromDate.split('T')[0],
      toDate: schedule.toDate.split('T')[0],
      amount: schedule.amount,
      description: schedule.description,
    });
    setPreviewPhotos(schedule.photoUrls || []);
    setExistingPhotoKeys(schedule.photos || []); // Set existing photo keys
    setDeletePhotoKeys([]); // Reset deletePhotoKeys
    setNewPhotos([]); // Reset new photos
    setShowForm(true);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteSchedule(deleteScheduleId);
      toast.success('Schedule deleted successfully');
      await fetchSchedules();
      setDeleteScheduleId(null);
    } catch (error) {
      console.error('Error deleting schedule:', error);
      toast.error('Failed to delete schedule');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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
              disabled={packagesLoading}
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
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Package Selection */}
                    <div>
                      <label htmlFor="package" className="block text-sm font-medium text-gray-700 mb-2">
                        Tour Package *
                      </label>
                      {packagesLoading ? (
                        <div className="text-gray-500">Loading packages...</div>
                      ) : (
                        <select
                          id="package"
                          name="package"
                          value={formData.package}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                            formErrors.package ? 'border-red-500' : 'border-gray-300'
                          }`}
                          disabled={packagesLoading}
                        >
                          <option value="">Select a package</option>
                          {Array.isArray(packages) &&
                            packages.map((pkg) => (
                              <option key={pkg.id} value={pkg.id}>
                                {pkg.title}
                              </option>
                            ))}
                        </select>
                      )}
                      {formErrors.package && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.package}</p>
                      )}
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
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          formErrors.title ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter schedule title"
                      />
                      {formErrors.title && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>
                      )}
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
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          formErrors.fromDate ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.fromDate && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.fromDate}</p>
                      )}
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
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          formErrors.toDate ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.toDate && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.toDate}</p>
                      )}
                    </div>

                    {/* Amount */}
                    <div>
                      <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                        Amount (₹) *
                      </label>
                      <input
                        type="number"
                        id="amount"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          formErrors.amount ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter amount in INR"
                      />
                      {formErrors.amount && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.amount}</p>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mt-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        formErrors.description ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter schedule description"
                    />
                    {formErrors.description && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>
                    )}
                  </div>

                  {/* Photo Upload */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Photos (Max 10)</label>
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
                      disabled={loading || packagesLoading}
                      className={`flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                        loading || packagesLoading ? 'opacity-50 cursor-not-allowed' : 'hover:from-blue-700 hover:to-purple-700 hover:scale-105'
                      }`}
                    >
                      {loading ? 'Processing...' : editingSchedule ? 'Update Schedule' : 'Add Schedule'}
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
                </form>
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
                    onClick={handleDelete}
                    disabled={loading}
                    className={`flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-semibold ${
                      loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'
                    }`}
                  >
                    {loading ? 'Deleting...' : 'Delete'}
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

          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading schedules...</p>
            </div>
          ) : schedules.length === 0 ? (
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
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{schedule.id.slice(0, 8)}</td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{schedule.title}</div>
                          <div className="text-sm text-gray-500">{schedule.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{schedule.package?.title || 'N/A'}</td>
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
                          <IndianRupee className="w-4 h-4 mr-1" />
                          {schedule.amount.toLocaleString('en-IN')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex -space-x-2">
                          {Array.isArray(schedule.photoUrls) && schedule.photoUrls.length > 0 ? (
                            schedule.photoUrls.slice(0, 3).map((photo, index) => {
                              console.log(`Rendering photo ${index}:`, photo); // Debug
                              return (
                                <img
                                  key={index}
                                  src={photo}
                                  alt="Schedule"
                                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                                />
                              );
                            })
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text- font-medium text-gray-600">
                              No Photos
                            </div>
                          )}
                          {Array.isArray(schedule.photoUrls) && schedule.photoUrls?.length > 3 && (
                            <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                              +{schedule.photoUrls.length - 3}
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center space-x-2">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackageSchedulesManagement;