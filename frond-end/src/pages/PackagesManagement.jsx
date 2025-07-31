import React, { useState, useEffect, useRef } from 'react';
import { Edit, Trash2, Plus, X, MapPin, Globe, Camera, AlertTriangle } from 'lucide-react';
import { addTourPackage, getTourPackages, editTourPackage, deleteTourPackage } from '../services/tourPackageApi';
import { findAllCountriesWithAlphaOrder } from '../services/countriesApi';
import { getCitiesByCountryId } from '../services/citiesApi';

const TourPackagesManagement = () => {
  const [countries, setCountries] = useState([]);
  const [sourceCities, setSourceCities] = useState([]);
  const [destinationCities, setDestinationCities] = useState([]);
  const [packages, setPackages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    sourceCountryId: '',
    sourceCityId: '',
    destinationCountryId: '',
    destinationCityId: '',
    description: '',
    termsAndConditions: [''],
  });
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState([]);
  const [deleteImageKeys, setDeleteImageKeys] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const packagesPerPage = 3;

  useEffect(() => {
    fetchInitialData();
  }, [currentPage]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [countriesData, packagesData] = await Promise.all([
        findAllCountriesWithAlphaOrder(),
        getTourPackages(currentPage, packagesPerPage),
      ]);
      setCountries(Array.isArray(countriesData) ? countriesData : []);
      setPackages(packagesData.packages || []);
      setTotalPages(packagesData.totalPages || 1);
    } catch (error) {
      console.error('Error fetching initial data:', error);
      setErrors({ fetch: 'Failed to load initial data. Please check your network or API configuration.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formData.sourceCountryId) {
      fetchCities(formData.sourceCountryId, 'source');
    } else {
      setSourceCities([]);
      setFormData((prev) => ({ ...prev, sourceCityId: '' }));
    }
  }, [formData.sourceCountryId]);

  useEffect(() => {
    if (formData.destinationCountryId) {
      fetchCities(formData.destinationCountryId, 'destination');
    } else {
      setDestinationCities([]);
      setFormData((prev) => ({ ...prev, destinationCityId: '' }));
    }
  }, [formData.destinationCountryId]);

  const fetchCities = async (countryId, type) => {
    setLoading(true);
    try {
      const cities = await getCitiesByCountryId(countryId);
      if (type === 'source') {
        setSourceCities(Array.isArray(cities) ? cities : []);
      } else {
        setDestinationCities(Array.isArray(cities) ? cities : []);
      }
    } catch (error) {
      console.error(`Error fetching ${type} cities:`, error);
      setErrors((prev) => ({ ...prev, [`${type}Cities`]: `Failed to load ${type} cities.` }));
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Package title is required';
    if (!formData.sourceCountryId) newErrors.sourceCountryId = 'Source country is required';
    if (!formData.sourceCityId) newErrors.sourceCityId = 'Source city is required';
    if (!formData.destinationCountryId) newErrors.destinationCountryId = 'Destination country is required';
    if (!formData.destinationCityId) newErrors.destinationCityId = 'Destination city is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.termsAndConditions.some((term) => term.trim())) {
      newErrors.termsAndConditions = 'At least one valid term is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: '' }));

    if (name === 'sourceCountryId') {
      setFormData((prev) => ({ ...prev, sourceCityId: '' }));
      setErrors((prev) => ({ ...prev, sourceCityId: '' }));
    }
    if (name === 'destinationCountryId') {
      setFormData((prev) => ({ ...prev, destinationCityId: '' }));
      setErrors((prev) => ({ ...prev, destinationCityId: '' }));
    }
  };

  const handleTermChange = (index, value) => {
    const newTerms = [...formData.termsAndConditions];
    newTerms[index] = value;
    setFormData((prev) => ({ ...prev, termsAndConditions: newTerms }));
    setErrors((prev) => ({ ...prev, termsAndConditions: '' }));
  };

  const addTerm = () => {
    setFormData((prev) => ({
      ...prev,
      termsAndConditions: [...prev.termsAndConditions, ''],
    }));
  };

  const removeTerm = (index) => {
    const newTerms = formData.termsAndConditions.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, termsAndConditions: newTerms }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setSelectedPhotos(files);
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setPhotoPreviewUrls((prev) => [...prev, ...previewUrls]);
  };

  const removePhoto = (index) => {
    const newPhotos = selectedPhotos.filter((_, i) => i !== index);
    const newUrls = photoPreviewUrls.filter((_, i) => i !== index);
    if (editingPackage && index < editingPackage.photos?.length) {
      setDeleteImageKeys((prev) => [...prev, editingPackage.photos[index]]);
    }
    setSelectedPhotos(newPhotos);
    setPhotoPreviewUrls(newUrls);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      sourceCountryId: '',
      sourceCityId: '',
      destinationCountryId: '',
      destinationCityId: '',
      description: '',
      termsAndConditions: [''],
    });
    setSelectedPhotos([]);
    setPhotoPreviewUrls([]);
    setDeleteImageKeys([]);
    setSourceCities([]);
    setDestinationCities([]);
    setErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const sourceCountry = countries.find((c) => c.id === formData.sourceCountryId);
      const sourceCity = sourceCities.find((c) => c.id === formData.sourceCityId);
      const destCountry = countries.find((c) => c.id === formData.destinationCountryId);
      const destCity = destinationCities.find((c) => c.id === formData.destinationCityId);

      const packageData = new FormData();
      packageData.append('title', formData.title);
      packageData.append('sourceCountryId', formData.sourceCountryId);
      packageData.append('sourceCityId', formData.sourceCityId);
      packageData.append('destinationCountryId', formData.destinationCountryId);
      packageData.append('destinationCityId', formData.destinationCityId);
      packageData.append('description', formData.description);

      formData.termsAndConditions
        .filter((term) => term.trim())
        .forEach((term) => {
          packageData.append('termsAndConditions[]', term);
        });

      selectedPhotos.forEach((photo) => {
        packageData.append('photos', photo);
      });

      if (editingPackage && deleteImageKeys.length > 0) {
        deleteImageKeys.forEach((key) => {
          packageData.append('deleteImageKeys[]', key);
        });
      }

      if (editingPackage) {
        const updatedPackage = await editTourPackage(editingPackage.id, packageData);
        setPackages((prev) =>
          prev.map((pkg) =>
            pkg.id === editingPackage.id
              ? {
                  ...pkg,
                  title: formData.title,
                  sourceCountryId: formData.sourceCountryId,
                  sourceCityId: formData.sourceCityId,
                  destinationCountryId: formData.destinationCountryId,
                  destinationCityId: formData.destinationCityId,
                  description: formData.description,
                  terms: formData.termsAndConditions.filter((term) => term.trim()),
                  photos: updatedPackage.photos || [],
                  photoUrls: updatedPackage.photoUrls || [],
                  sourceCountryName: sourceCountry?.name || '',
                  sourceCityName: sourceCity?.name || '',
                  destinationCountryName: destCountry?.name || '',
                  destinationCityName: destCity?.name || '',
                }
              : pkg
          )
        );
      } else {
        const newPackage = await addTourPackage(packageData);
        setPackages((prev) => [
          ...prev,
          {
            id: newPackage.id,
            title: formData.title,
            sourceCountryId: formData.sourceCountryId,
            sourceCityId: formData.sourceCityId,
            destinationCountryId: formData.destinationCountryId,
            destinationCityId: formData.destinationCityId,
            description: formData.description,
            terms: formData.termsAndConditions.filter((term) => term.trim()),
            photos: newPackage.photos || [],
            photoUrls: newPackage.photoUrls || [],
            sourceCountryName: sourceCountry?.name || '',
            sourceCityName: sourceCity?.name || '',
            destinationCountryName: destCountry?.name || '',
            destinationCityName: destCity?.name || '',
          },
        ]);
      }

      resetForm();
      setShowAddForm(false);
      setEditingPackage(null);
    } catch (error) {
      console.error('Error submitting package:', error);
      setErrors({ submit: 'Failed to save package. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (pkg) => {
    setLoading(true);
    try {
      const [sourceCitiesData, destCitiesData] = await Promise.all([
        getCitiesByCountryId(pkg.sourceCountryId),
        getCitiesByCountryId(pkg.destinationCountryId),
      ]);
      setSourceCities(Array.isArray(sourceCitiesData) ? sourceCitiesData : []);
      setDestinationCities(Array.isArray(destCitiesData) ? destCitiesData : []);
      setFormData({
        title: pkg.title,
        sourceCountryId: pkg.sourceCountryId,
        sourceCityId: pkg.sourceCityId,
        destinationCountryId: pkg.destinationCountryId,
        destinationCityId: pkg.destinationCityId,
        description: pkg.description,
        termsAndConditions: pkg.terms?.length > 0 ? pkg.terms : [''],
      });
      setPhotoPreviewUrls(pkg.photoUrls || []);
      setSelectedPhotos([]);
      setDeleteImageKeys([]);
      setEditingPackage(pkg);
      setShowAddForm(true);
      setErrors({});
    } catch (error) {
      console.error('Error loading cities for edit:', error);
      setErrors({ edit: 'Failed to load city data for editing.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deleteTourPackage(id);
      setPackages((prev) => prev.filter((pkg) => pkg.id !== id));
      setDeleteConfirm(null);
      if (packages.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
    } catch (error) {
      console.error('Error deleting package:', error);
      setErrors({ delete: 'Failed to delete package. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
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
              disabled={loading}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Add new package"
            >
              <Plus className="w-5 h-5" />
              Add Package
            </button>
          </div>
        </div>

        {errors.fetch && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-8 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            {errors.fetch}
          </div>
        )}

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
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter package title"
                    disabled={loading}
                  />
                  {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                </div>

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
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.sourceCountryId ? 'border-red-500' : 'border-gray-300'}`}
                      disabled={loading}
                    >
                      <option value="">Select Country</option>
                      {countries.length > 0 ? (
                        countries.map((country) => (
                          <option key={country.id} value={country.id}>
                            {country.name}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>
                          No countries available
                        </option>
                      )}
                    </select>
                    {errors.sourceCountryId && <p className="mt-1 text-sm text-red-500">{errors.sourceCountryId}</p>}
                    {!errors.sourceCountryId && countries.length === 0 && (
                      <p className="mt-1 text-sm text-yellow-500">No countries loaded. Please check API.</p>
                    )}
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
                      disabled={!formData.sourceCountryId || loading}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 ${errors.sourceCityId ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">Select City</option>
                      {sourceCities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                    {errors.sourceCityId && <p className="mt-1 text-sm text-red-500">{errors.sourceCityId}</p>}
                    {errors.sourceCities && <p className="mt-1 text-sm text-red-500">{errors.sourceCities}</p>}
                  </div>
                </div>

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
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.destinationCountryId ? 'border-red-500' : 'border-gray-300'}`}
                      disabled={loading}
                    >
                      <option value="">Select Country</option>
                      {countries.length > 0 ? (
                        countries.map((country) => (
                          <option key={country.id} value={country.id}>
                            {country.name}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>
                          No countries available
                        </option>
                      )}
                    </select>
                    {errors.destinationCountryId && <p className="mt-1 text-sm text-red-500">{errors.destinationCountryId}</p>}
                    {!errors.destinationCountryId && countries.length === 0 && (
                      <p className="mt-1 text-sm text-yellow-500">No countries loaded. Please check API.</p>
                    )}
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
                      disabled={!formData.destinationCountryId || loading}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 ${errors.destinationCityId ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">Select City</option>
                      {destinationCities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                    {errors.destinationCityId && <p className="mt-1 text-sm text-red-500">{errors.destinationCityId}</p>}
                    {errors.destinationCities && <p className="mt-1 text-sm text-red-500">{errors.destinationCities}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Describe the tour package..."
                    disabled={loading}
                  />
                  {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                </div>

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
                          className={`flex-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.termsAndConditions ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder={`Term ${index + 1}`}
                          disabled={loading}
                        />
                        {formData.termsAndConditions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTerm(index)}
                            className="px-3 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                            aria-label={`Remove term ${index + 1}`}
                            disabled={loading}
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                    {errors.termsAndConditions && <p className="mt-1 text-sm text-red-500">{errors.termsAndConditions}</p>}
                    <button
                      type="button"
                      onClick={addTerm}
                      className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                      disabled={loading}
                    >
                      + Add Another Term
                    </button>
                  </div>
                </div>

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
                    disabled={loading}
                  />
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
                            disabled={loading}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {errors.submit && (
                  <div className="text-red-500 text-sm">{errors.submit}</div>
                )}

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : editingPackage ? 'Update Package' : 'Add Package'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingPackage(null);
                      resetForm();
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Tour Packages ({packages.length})</h2>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <p className="text-gray-600">Loading packages...</p>
            </div>
          ) : packages.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <MapPin className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No packages found</h3>
              <p className="text-gray-600">Start by adding your first tour package.</p>
            </div>
          ) : (
            <>
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
                            {pkg.photoUrls?.slice(0, 3).map((photo, index) => (
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
                              disabled={loading}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(pkg)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                              aria-label={`Delete package ${pkg.title}`}
                              disabled={loading}
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
              <div className="p-6 border-t border-gray-200 flex justify-between items-center">
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
            </>
          )}
        </div>

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
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-xl hover:bg-red-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-xl hover:bg-gray-300 transition-colors duration-200 font-medium"
                  disabled={loading}
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