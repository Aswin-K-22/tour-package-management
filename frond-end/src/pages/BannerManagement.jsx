import React, { useState, useRef } from 'react';
import { Plus, Edit, Trash2, X, Upload, ExternalLink } from 'lucide-react';

const BannerManagement = () => {
  const [banners, setBanners] = useState([
    {
      id: 1,
      title: "Explore Malaysia!",
      image: "https://images.unsplash.com/photo-1514282401047-d79a71fac224?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      description: "Discover the vibrant culture and beaches of Malaysia.",
      link: "/packages/1"
    },
    {
      id: 2,
      title: "Singapore City Adventure",
      image: "https://images.unsplash.com/photo-1515036551092-39b3e1fa4627?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      description: "Experience the futuristic cityscape of Singapore.",
      link: "/packages/2"
    },
    {
      id: 3,
      title: "Bali Summer Getaway",
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      description: "Enjoy a tropical paradise with our Bali package.",
      link: "/packages/3"
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    image: null,
    description: '',
    link: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      image: null,
      description: '',
      link: ''
    });
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.image) {
      alert('Title and image are required!');
      return;
    }

    const newBanner = {
      id: editingBanner ? editingBanner.id : Date.now(),
      title: formData.title,
      image: imagePreview || formData.image,
      description: formData.description,
      link: formData.link
    };

    if (editingBanner) {
      setBanners(prev => prev.map(banner => 
        banner.id === editingBanner.id ? newBanner : banner
      ));
      console.log('Banner updated:', newBanner);
      setEditingBanner(null);
    } else {
      setBanners(prev => [...prev, newBanner]);
      console.log('Banner added:', newBanner);
      setShowAddForm(false);
    }

    resetForm();
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      image: banner.image,
      description: banner.description || '',
      link: banner.link || ''
    });
    setImagePreview(banner.image);
  };

  const handleDelete = (id) => {
    setBanners(prev => prev.filter(banner => banner.id !== id));
    console.log('Banner deleted:', id);
    setDeleteConfirm(null);
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Manage Banners
          </h1>
          <p className="text-gray-600">
            Create, edit, and manage promotional banners for your tour packages
          </p>
        </div>

        {/* Add Banner Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            aria-label="Add new banner"
          >
            <Plus size={20} />
            Add New Banner
          </button>
        </div>

        {/* Banners Grid/Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Image</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Description</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Link</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {banners.map((banner, ) => (
                  <tr key={banner.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 text-sm text-gray-600">{banner.id}</td>
                    <td className="px-6 py-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                        <img
                          src={banner.image}
                          alt={banner.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{banner.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-xs">
                        {truncateText(banner.description, 50)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {banner.link && (
                        <div className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800">
                          <ExternalLink size={14} />
                          <span className="truncate max-w-xs">{truncateText(banner.link, 30)}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(banner)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200 transform hover:scale-110"
                          aria-label={`Edit ${banner.title}`}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(banner)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200 transform hover:scale-110"
                          aria-label={`Delete ${banner.title}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile/Tablet Card View */}
          <div className="lg:hidden p-4 space-y-4">
            {banners.map((banner) => (
              <div key={banner.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden shadow-md flex-shrink-0">
                    <img
                      src={banner.image}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{banner.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">ID: {banner.id}</p>
                        {banner.description && (
                          <p className="text-sm text-gray-600 mb-2">
                            {truncateText(banner.description, 80)}
                          </p>
                        )}
                        {banner.link && (
                          <div className="flex items-center gap-1 text-sm text-blue-600">
                            <ExternalLink size={14} />
                            <span className="truncate">{truncateText(banner.link, 40)}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 ml-2">
                        <button
                          onClick={() => handleEdit(banner)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-all duration-200"
                          aria-label={`Edit ${banner.title}`}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(banner)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-all duration-200"
                          aria-label={`Delete ${banner.title}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add/Edit Banner Modal */}
      {(showAddForm || editingBanner) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-in fade-in duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingBanner ? 'Edit Banner' : 'Add New Banner'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingBanner(null);
                    resetForm();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter banner title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image *
                  </label>
                  <div className="space-y-4">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
                    >
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Click to upload image</span>
                    </label>
                    
                    {imagePreview && (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg shadow-md"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setFormData(prev => ({ ...prev, image: null }));
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors duration-200"
                          aria-label="Remove image"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Enter banner description (optional)"
                  />
                </div>

                <div>
                  <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-2">
                    Link
                  </label>
                  <input
                    type="text"
                    id="link"
                    name="link"
                    value={formData.link}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter link URL (optional)"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingBanner(null);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 font-medium transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    {editingBanner ? 'Update Banner' : 'Add Banner'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full animate-in fade-in duration-300">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Banner</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete "{deleteConfirm.title}"?
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm.id)}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 font-medium transform hover:scale-105"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerManagement;