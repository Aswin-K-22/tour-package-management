import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, X, Check, AlertTriangle, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { addCity, getCities, editCity, deleteCity } from '../services/citiesApi';
import { findAllCountriesWithAlphaOrder } from '../services/countriesApi';
import { toast } from 'react-toastify';

const CitiesManagement = () => {
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [formData, setFormData] = useState({ name: '', countryId: '' });
  const [editingCity, setEditingCity] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [cityToDelete, setCityToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCountry, setFilterCountry] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  // Fetch countries and cities
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch countries
        const countriesData = await findAllCountriesWithAlphaOrder();
        setCountries(countriesData);

        // Fetch cities
        const citiesData = await getCities(currentPage, pageSize);
        setCities(citiesData.cities);
        setTotalPages(citiesData.totalPages);
        setTotalCount(citiesData.totalCount);
      } catch (err) {
        toast.error('Failed to fetch data. Please try again.', {
          position: 'top-right',
          autoClose: 3000,
        });
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentPage]);

  // Filter cities based on search and country filter
  const filteredCities = cities.filter((city) => {
    const matchesSearch =
      city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.countryName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = !filterCountry || city.countryId.toString() === filterCountry;
    return matchesSearch && matchesCountry;
  });

  // Validate form
  const validateForm = (data) => {
    const newErrors = {};
    if (!data.name.trim()) newErrors.name = 'City name cannot be empty or contain only spaces';
    if (!data.countryId) newErrors.countryId = 'Country is required';
    return newErrors;
  };

  // Add new city with API
  const handleAddCity = async () => {
    const newErrors = validateForm(formData);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const country = countries.find(c => c.id.toString() === formData.countryId);
      const newCity = await addCity(formData.name.trim(), formData.countryId);
      setCities((prev) => [{
        ...newCity,
        countryName: country.name,
        countryId: formData.countryId
      }, ...prev]);
      setFormData({ name: '', countryId: '' });
      setErrors({});
      toast.success(`City "${newCity.name}" added successfully!`, {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to add city. Please try again.';
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
      });
      console.error('Error adding city:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Start editing city
  const handleEditCity = (city) => {
    setEditingCity({
      ...city,
      name: city.name,
      countryId: city.countryId.toString(),
    });
  };

  // Save edited city
  const handleSaveEdit = async () => {
    const newErrors = validateForm(editingCity);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const country = countries.find((c) => c.id.toString() === editingCity.countryId);
      const updatedCity = await editCity(
        editingCity.id,
        editingCity.name.trim(),
        editingCity.countryId
      );
      
      setCities((prev) =>
        prev.map((city) =>
          city.id === editingCity.id
            ? {
                ...updatedCity,
                countryName: country.name,
                countryId: editingCity.countryId,
              }
            : city
        )
      );

      setEditingCity(null);
      setErrors({});
      toast.success(`City "${updatedCity.name}" updated successfully!`, {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update city. Please try again.';
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
      });
      console.error('Error updating city:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingCity(null);
    setErrors({});
  };

  // Delete city
  const handleDeleteCity = (city) => {
    setCityToDelete(city);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      await deleteCity(cityToDelete.id);
      setCities((prev) => prev.filter((city) => city.id !== cityToDelete.id));
      setShowDeleteModal(false);
      setCityToDelete(null);
      toast.success(`City "${cityToDelete.name}" deleted successfully!`, {
        position: 'top-right',
        autoClose: 3000,
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete city. Please try again.';
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
      });
      console.error('Error deleting city:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e, isEditing = false) => {
    const { name, value } = e.target;
    if (isEditing) {
      setEditingCity((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Manage Cities
          </h1>
          <p className="text-gray-600 text-lg">
            Add, edit, and manage cities across different countries
          </p>
        </div>

        {/* Add City Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 mb-8 hover:shadow-2xl transition-all duration-300">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <Plus className="w-6 h-6 text-blue-600" />
            Add New City
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label htmlFor="countryId" className="block text-sm font-medium text-gray-700">
                Country *
              </label>
              <select
                id="countryId"
                name="countryId"
                value={formData.countryId}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 ${
                  errors.countryId ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                aria-label="Select country"
                disabled={isLoading}
              >
                <option value="">Select a country</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </select>
              {errors.countryId && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  {errors.countryId}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="cityName" className="block text-sm font-medium text-gray-700">
                City Name *
              </label>
              <input
                type="text"
                id="cityName"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter city name"
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 ${
                  errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                aria-label="City name"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  {errors.name}
                </p>
              )}
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleAddCity}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 hover:scale-105 hover:shadow-lg focus:ring-4 focus:ring-blue-200 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Add city"
                disabled={isLoading}
              >
                <Plus className="w-5 h-5" />
                Add City
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search cities or countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                aria-label="Search cities"
                disabled={isLoading}
              />
            </div>

            <select
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
              aria-label="Filter by country"
              disabled={isLoading}
            >
              <option value="">All Countries</option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Cities Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-800">
              Cities ({filteredCities.length} of {totalCount})
            </h2>
          </div>

          {isLoading ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-lg">Loading...</p>
            </div>
          ) : filteredCities.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">No cities found</p>
              <p className="text-gray-400 text-sm mt-1">
                {searchTerm || filterCountry ? 'Try adjusting your filters' : 'Add your first city above'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        City Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Country
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredCities.map((city) => (
                      <tr
                        key={city.id}
                        className="hover:bg-blue-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{city.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingCity && editingCity.id === city.id ? (
                            <input
                              type="text"
                              name="name"
                              value={editingCity.name}
                              onChange={(e) => handleInputChange(e, true)}
                              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 ${
                                errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'
                              }`}
                              aria-label="Edit city name"
                              disabled={isLoading}
                            />
                          ) : (
                            <div className="text-sm font-medium text-gray-900">
                              {city.name}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingCity && editingCity.id === city.id ? (
                            <select
                              name="countryId"
                              value={editingCity.countryId}
                              onChange={(e) => handleInputChange(e, true)}
                              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 ${
                                errors.countryId ? 'border-red-300 bg-red-50' : 'border-gray-200'
                              }`}
                              aria-label="Edit country"
                              disabled={isLoading}
                            >
                              {countries.map((country) => (
                                <option key={country.id} value={country.id}>
                                  {country.name}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                              {city.countryName}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {editingCity && editingCity.id === city.id ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={handleSaveEdit}
                                className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 hover:scale-110 focus:ring-4 focus:ring-green-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Save changes"
                                disabled={isLoading}
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="bg-gray-600 text-white p-2 rounded-lg hover:bg-gray-700 hover:scale-110 focus:ring-4 focus:ring-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Cancel edit"
                                disabled={isLoading}
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEditCity(city)}
                                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 hover:scale-110 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Edit city"
                                disabled={isLoading}
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteCity(city)}
                                className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 hover:scale-110 focus:ring-4 focus:ring-red-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Delete city"
                                disabled={isLoading}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-6 border-t border-gray-100 flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Showing {(currentPage - 1) * pageSize + 1} to{' '}
                    {Math.min(currentPage * pageSize, totalCount)} of {totalCount} cities
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1 || isLoading}
                      className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .slice(
                          Math.max(0, currentPage - 3),
                          Math.min(totalPages, currentPage + 2)
                        )
                        .map((page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-1 rounded-lg ${
                              currentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                            aria-label={`Page ${page}`}
                            disabled={isLoading}
                          >
                            {page}
                          </button>
                        ))}
                    </div>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages || isLoading}
                      className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Next page"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete City</h3>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-gray-700 mb-6">
              Are you sure you want to delete <strong>{cityToDelete?.name}</strong> from{' '}
              <strong>{cityToDelete?.countryName}</strong>?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 focus:ring-4 focus:ring-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Cancel delete"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 hover:scale-105 focus:ring-4 focus:ring-red-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Confirm delete"
                disabled={isLoading}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CitiesManagement;