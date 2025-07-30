import React, { useState, useRef } from 'react';
import { Edit, Trash2, Eye, Plus, X, MapPin, Globe, Camera, AlertTriangle } from 'lucide-react';

const TourPackagesManagement = () => {
  // Dummy data
  const [countries] = useState([
    { id: 1, name: "India" },
    { id: 2, name: "Malaysia" },
    { id: 3, name: "Singapore" }
  ]);

  const [cities] = useState([
    { id: 1, name: "Kerala", countryId: 1 },
    { id: 2, name: "Mumbai", countryId: 1 },
    { id: 3, name: "Kuala Lumpur", countryId: 2 },
    { id: 4, name: "Singapore City", countryId: 3 }
  ]);

  const [packages, setPackages] = useState([
    {
      id: 1,
      title: "Kerala to Malaysia 4 Days 3 Nights",
      sourceCountryId: 1,
      sourceCountryName: "India",
      sourceCityId: 1,
      sourceCityName: "Kerala",
      destinationCountryId: 2,
      destinationCountryName: "Malaysia",
      destinationCityId: 3,
      destinationCityName: "Kuala Lumpur",
      description: "Explore vibrant Malaysia with guided tours and beach visits.",
      termsAndConditions: [
        "Valid passport required.",
        "50% payment at booking."
      ],
      photos: [
        "https://images.unsplash.com/photo-1514282401047-d79a71fac224?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
      ]
    },
    {
      id: 2,
      title: "Mumbai to Singapore City Tour",
      sourceCountryId: 1,
      sourceCountryName: "India",
      sourceCityId: 2,
      sourceCityName: "Mumbai",
      destinationCountryId: 3,
      destinationCountryName: "Singapore",
      destinationCityId: 4,
      destinationCityName: "Singapore City",
      description: "Discover the futuristic cityscape of Singapore.",
      termsAndConditions: [
        "Travel insurance recommended.",
        "Cancellations within 7 days non-refunded."
      ],
      photos: [
        "https://images.unsplash.com/photo-1515036551092-39b3e1fa4627?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
      ]
    }
  ]);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    sourceCountryId: '',
    sourceCityId: '',
    destinationCountryId: '',
    destinationCityId: '',
    description: '',
    termsAndConditions: ['']
  });

  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const fileInputRef = useRef(null);

  // Filter cities based on selected country
  const getFilteredCities = (countryId) => {
    return cities.filter(city => city.countryId === parseInt(countryId));
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Reset city when country changes
    if (name === 'sourceCountryId') {
      setFormData(prev => ({ ...prev, sourceCityId: '' }));
    }
    if (name === 'destinationCountryId') {
      setFormData(prev => ({ ...prev, destinationCityId: '' }));
    }
  };

  // Handle terms and conditions
  const handleTermChange = (index, value) => {
    const newTerms = [...formData.termsAndConditions];
    newTerms[index] = value;
    setFormData(prev => ({ ...prev, termsAndConditions: newTerms }));
  };

  const addTerm = () => {
    setFormData(prev => ({
      ...prev,
      termsAndConditions: [...prev.termsAndConditions, '']
    }));
  };

  const removeTerm = (index) => {
    const newTerms = formData.termsAndConditions.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, termsAndConditions: newTerms }));
  };

  // Handle photo uploads
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setSelectedPhotos(files);

    // Create preview URLs
    const previewUrls = files.map(file => URL.createObjectURL(file));
    setPhotoPreviewUrls(previewUrls);
  };

  const removePhoto = (index) => {
    const newPhotos = selectedPhotos.filter((_, i) => i !== index);
    const newUrls = photoPreviewUrls.filter((_, i) => i !== index);
    setSelectedPhotos(newPhotos);
    setPhotoPreviewUrls(newUrls);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      sourceCountryId: '',
      sourceCityId: '',
      destinationCountryId: '',
      destinationCityId: '',
      description: '',
      termsAndConditions: ['']
    });
    setSelectedPhotos([]);
    setPhotoPreviewUrls([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const sourceCountry = countries.find(c => c.id === parseInt(formData.sourceCountryId));
    const sourceCity = cities.find(c => c.id === parseInt(formData.sourceCityId));
    const destCountry = countries.find(c => c.id === parseInt(formData.destinationCountryId));
    const destCity = cities.find(c => c.id === parseInt(formData.destinationCityId));

    const packageData = {
      id: editingPackage ? editingPackage.id : packages.length + 1,
      title: formData.title,
      sourceCountryId: parseInt(formData.sourceCountryId),
      sourceCountryName: sourceCountry?.name,
      sourceCityId: parseInt(formData.sourceCityId),
      sourceCityName: sourceCity?.name,
      destinationCountryId: parseInt(formData.destinationCountryId),
      destinationCountryName: destCountry?.name,
      destinationCityId: parseInt(formData.destinationCityId),
      destinationCityName: destCity?.name,
      description: formData.description,
      termsAndConditions: formData.termsAndConditions.filter(term => term.trim()),
      photos: photoPreviewUrls.length > 0 ? photoPreviewUrls : editingPackage?.photos || []
    };

    if (editingPackage) {
      setPackages(prev => prev.map(pkg => pkg.id === editingPackage.id ? packageData : pkg));
      console.log('Package updated:', packageData);
    } else {
      setPackages(prev => [...prev, packageData]);
      console.log('Package added:', packageData);
    }

    resetForm();
    setShowAddForm(false);
    setEditingPackage(null);
  };

  // Handle edit
  const handleEdit = (pkg) => {
    setFormData({
      title: pkg.title,
      sourceCountryId: pkg.sourceCountryId.toString(),
      sourceCityId: pkg.sourceCityId.toString(),
      destinationCountryId: pkg.destinationCountryId.toString(),
      destinationCityId: pkg.destinationCityId.toString(),
      description: pkg.description,
      termsAndConditions: pkg.termsAndConditions.length > 0 ? pkg.termsAndConditions : ['']
    });
    setPhotoPreviewUrls(pkg.photos || []);
    setEditingPackage(pkg);
    setShowAddForm(true);
  };

  // Handle delete
  const handleDelete = (id) => {
    setPackages(prev => prev.filter(pkg => pkg.id !== id));
    setDeleteConfirm(null);
    console.log('Package deleted:', id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Manage Tour Packages
              </h1>
              <p className="text-gray-600 mt-2">Create, edit, and manage your tour packages with ease</p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setEditingPackage(null);
                setShowAddForm(!showAddForm);
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              aria-label="Add new package"
            >
              <Plus className="w-5 h-5" />
              Add Package
            </button>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-8 transform transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingPackage ? 'Edit Package' : 'Add New Package'}
              </h2>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingPackage(null);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Close form"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                    Package Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter package title"
                  />
                </div>

                {/* Source Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="sourceCountryId" className="block text-sm font-semibold text-gray-700 mb-2">
                      <Globe className="inline w-4 h-4 mr-1" />
                      Source Country *
                    </label>
                    <select
                      id="sourceCountryId"
                      name="sourceCountryId"
                      value={formData.sourceCountryId}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select Country</option>
                      {countries.map(country => (
                        <option key={country.id} value={country.id}>{country.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="sourceCityId" className="block text-sm font-semibold text-gray-700 mb-2">
                      <MapPin className="inline w-4 h-4 mr-1" />
                      Source City *
                    </label>
                    <select
                      id="sourceCityId"
                      name="sourceCityId"
                      value={formData.sourceCityId}
                      onChange={handleInputChange}
                      required
                      disabled={!formData.sourceCountryId}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
                    >
                      <option value="">Select City</option>
                      {getFilteredCities(formData.sourceCountryId).map(city => (
                        <option key={city.id} value={city.id}>{city.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Destination Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="destinationCountryId" className="block text-sm font-semibold text-gray-700 mb-2">
                      <Globe className="inline w-4 h-4 mr-1" />
                      Destination Country *
                    </label>
                    <select
                      id="destinationCountryId"
                      name="destinationCountryId"
                      value={formData.destinationCountryId}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select Country</option>
                      {countries.map(country => (
                        <option key={country.id} value={country.id}>{country.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="destinationCityId" className="block text-sm font-semibold text-gray-700 mb-2">
                      <MapPin className="inline w-4 h-4 mr-1" />
                      Destination City *
                    </label>
                    <select
                      id="destinationCityId"
                      name="destinationCityId"
                      value={formData.destinationCityId}
                      onChange={handleInputChange}
                      required
                      disabled={!formData.destinationCountryId}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
                    >
                      <option value="">Select City</option>
                      {getFilteredCities(formData.destinationCountryId).map(city => (
                        <option key={city.id} value={city.id}>{city.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Describe the tour package..."
                  />
                </div>

                {/* Terms and Conditions */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Terms and Conditions *
                  </label>
                  <div className="space-y-3">
                    {formData.termsAndConditions.map((term, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={term}
                          onChange={(e) => handleTermChange(index, e.target.value)}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder={`Term ${index + 1}`}
                        />
                        {formData.termsAndConditions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTerm(index)}
                            className="px-3 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                            aria-label={`Remove term ${index + 1}`}
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addTerm}
                      className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      + Add Another Term
                    </button>
                  </div>
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Camera className="inline w-4 h-4 mr-1" />
                    Photos
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  
                  {/* Photo Preview */}
                  {photoPreviewUrls.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {photoPreviewUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg shadow-md"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label={`Remove photo ${index + 1}`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
                  >
                    {editingPackage ? 'Update Package' : 'Add Package'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingPackage(null);
                      resetForm();
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Packages Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Tour Packages ({packages.length})</h2>
          </div>

          {packages.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <MapPin className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No packages found</h3>
              <p className="text-gray-600">Start by adding your first tour package.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Source</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Destination</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Photos</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {packages.map((pkg) => (
                    <tr key={pkg.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">#{pkg.id}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{pkg.title}</div>
                        <div className="text-sm text-gray-600 max-w-xs truncate">{pkg.description}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                          {pkg.sourceCityName}, {pkg.sourceCountryName}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                          {pkg.destinationCityName}, {pkg.destinationCountryName}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex -space-x-2">
                          {pkg.photos?.slice(0, 3).map((photo, index) => (
                            <img
                              key={index}
                              src={photo}
                              alt={`Package ${pkg.id} photo ${index + 1}`}
                              className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                            />
                          ))}
                          {pkg.photos?.length > 3 && (
                            <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-600">
                              +{pkg.photos.length - 3}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(pkg)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            aria-label={`Edit package ${pkg.title}`}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(pkg)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            aria-label={`Delete package ${pkg.title}`}
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

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md transform transition-all duration-300 scale-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Package</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone.</p>
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete "<span className="font-medium">{deleteConfirm.title}</span>"?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleDelete(deleteConfirm.id)}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-xl hover:bg-red-700 transition-colors duration-200 font-medium"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-xl hover:bg-gray-300 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TourPackagesManagement;