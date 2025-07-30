import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Check, 
  AlertTriangle,
  Globe,
  Search
} from 'lucide-react';
import { addCountry, getCountries, editCountry, deleteCountry } from "../services/countriesApi"; 

const CountriesManagementPage = () => {
  const [countries, setCountries] = useState([]);
  const [newCountryName, setNewCountryName] = useState('');
  const [editingCountry, setEditingCountry] = useState(null);
  const [editName, setEditName] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [successConfirm, setSuccessConfirm] = useState(null); // For success dialogs (Edit/Delete only)
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 5;

  // Filter countries based on search term
  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fetch countries with pagination
  const fetchCountries = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await getCountries(page, itemsPerPage);
      setCountries(response.countries);
      setTotalPages(response.totalPages);
      setCurrentPage(page);
      setError('');
    } catch (err) {
      setError('Failed to fetch countries. Please try again.');
      console.error('Error fetching countries:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchCountries(1);
  }, []);

  // Add new country
  const handleAddCountry = async (e) => {
    e.preventDefault();
    const trimmedName = newCountryName.trim();
    
    if (!trimmedName) {
      setError('Country name cannot be empty or contain only spaces');
      return;
    }

    setIsLoading(true);
    try {
      const newCountry = await addCountry(trimmedName);
      setCountries(prev => [...prev, newCountry]); // Append new country to state
      setNewCountryName('');
      setError('');
      // Update total pages based on new count
      const newTotalItems = countries.length + 1;
      const newTotalPages = Math.ceil(newTotalItems / itemsPerPage);
      setTotalPages(newTotalPages);
      // Adjust current page if necessary
      const currentItemsOnPage = filteredCountries.length % itemsPerPage;
      if (currentItemsOnPage === 0 && currentPage < newTotalPages) {
        setCurrentPage(newTotalPages);
      }
      toast.success(`Country "${newCountry.name}" added successfully!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      setError('Failed to add country. Please try again.');
      console.error('Error adding country:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Start editing
  const handleEditStart = (country) => {
    setEditingCountry(country.id);
    setEditName(country.name);
    setError('');
  };

  // Save edit
  const handleEditSave = async () => {
    const trimmedEditName = editName.trim();
    
    if (!trimmedEditName) {
      setError('Country name cannot be empty or contain only spaces');
      return;
    }

    setIsLoading(true);
    try {
      await editCountry(editingCountry, trimmedEditName);
      await fetchCountries(currentPage); // Refresh current page
      setEditingCountry(null);
      setEditName('');
      setError('');
      setSuccessConfirm(`Successfully updated country to "${trimmedEditName}"`);
    } catch (err) {
      setError('Failed to update country. Please try again.');
      console.error('Error updating country:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel edit
  const handleEditCancel = () => {
    setEditingCountry(null);
    setEditName('');
    setError('');
  };

  // Delete country
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const countryToDelete = countries.find(c => c.id === deleteConfirm);
      await deleteCountry(deleteConfirm);
      await fetchCountries(currentPage > 1 && countries.length === 1 ? currentPage - 1 : currentPage);
      setDeleteConfirm(null);
      setError('');
      setSuccessConfirm(`Successfully deleted country "${countryToDelete.name}"`);
    } catch (err) {
      setError('Failed to delete country. Please try again.');
      console.error('Error deleting country:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchCountries(newPage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Globe className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Manage Countries</h1>
          </div>
          <p className="text-gray-600">Add, edit, and manage countries for your tour packages</p>
        </div>

        {/* Add Country Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8 hover:shadow-2xl transition-all duration-300">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Plus className="w-5 h-5 mr-2 text-green-600" />
            Add New Country
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="countryName" className="block text-sm font-medium text-gray-700 mb-2">
                Country Name
              </label>
              <input
                id="countryName"
                type="text"
                value={newCountryName}
                onChange={(e) => {
                  setNewCountryName(e.target.value);
                  setError('');
                }}
                placeholder="Enter country name..."
                className={`w-full px-4 py-3 border ${error ? 'border-red-300' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400`}
                aria-label="Country name input"
                onKeyPress={(e) => e.key === 'Enter' && handleAddCountry(e)}
                disabled={isLoading}
              />
              {error && (
                <p className="mt-2 text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}
            </div>
            <div className="flex items-end">
              <button
                onClick={handleAddCountry}
                className="group px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/30 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Add country"
                disabled={isLoading}
              >
                <Plus className="w-5 h-5 inline mr-2 group-hover:rotate-90 transition-transform duration-200" />
                Add Country
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              aria-label="Search countries"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Countries Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800">
              Countries List ({filteredCountries.length})
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Country Name
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan="2" className="px-6 py-12 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : filteredCountries.length === 0 ? (
                  <tr>
                    <td colSpan="2" className="px-6 py-12 text-center text-gray-500">
                      <Globe className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      {searchTerm ? 'No countries found matching your search.' : 'No countries added yet.'}
                    </td>
                  </tr>
                ) : (
                  filteredCountries.map((country) => (
                    <tr
                      key={country.id}
                      className="hover:bg-blue-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingCountry === country.id ? (
                          <div>
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => {
                                setEditName(e.target.value);
                                setError('');
                              }}
                              className={`w-full px-3 py-2 border ${error ? 'border-red-300' : 'border-blue-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                              aria-label="Edit country name"
                              autoFocus
                              disabled={isLoading}
                            />
                            {error && (
                              <p className="mt-2 text-sm text-red-600" role="alert">
                                {error}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm font-medium text-gray-900">
                            {country.name}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex justify-center space-x-2">
                          {editingCountry === country.id ? (
                            <>
                              <button
                                onClick={handleEditSave}
                                className="group p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Save changes"
                                disabled={isLoading}
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={handleEditCancel}
                                className="group p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-600 hover:text-white transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Cancel editing"
                                disabled={isLoading}
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEditStart(country)}
                                className="group p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200 hover:scale-110 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label={`Edit ${country.name}`}
                                disabled={isLoading}
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(country.id)}
                                className="group p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-200 hover:scale-110 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label={`Delete ${country.name}`}
                                disabled={isLoading}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {/* Pagination Controls */}
            {!isLoading && totalPages > 1 && (
              <div className="px-6 py-4 flex justify-between items-center bg-gray-50 border-t border-gray-200">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-all duration-200"
                  aria-label="Previous page"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-all duration-200"
                  aria-label="Next page"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Confirm Deletion
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{countries.find(c => c.id === deleteConfirm)?.name}"? 
                This action cannot be undone.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Cancel deletion"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Confirm deletion"
                  disabled={isLoading}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Confirmation Modal (for Edit/Delete only) */}
      {successConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Success
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                {successConfirm}
              </p>
              <div className="flex justify-end">
                <button
                  onClick={() => setSuccessConfirm(null)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 hover:shadow-lg"
                  aria-label="Close success dialog"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CountriesManagementPage;