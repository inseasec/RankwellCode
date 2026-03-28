import React, { useEffect, useState } from 'react';
import { Save, X, Building2, Mail, Phone, MapPin, Globe, Calendar, Upload, Image as ImageIcon } from 'lucide-react';

const OrganizationForm = ({ onSubmit, onCancel, initialData }) => {
    const getDefaultFormData = () => ({
        name: '',
        tagline: '',
        description: '',
        values: '',
        email: '',
        phone: '',
        address: '',
        website: '',
        establishedYear: '',
        logo: null,
        logoPreview: null,
    });
    const [formData, setFormData] = useState(getDefaultFormData());
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!initialData) {
            return;
        }

        setFormData({
            ...getDefaultFormData(),
            ...initialData,
            logo: null,
            logoPreview: initialData.logo || null
        });
    }, [initialData]);

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({
                    ...formData,
                    logo: file,
                    logoPreview: reader.result
                });
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please upload a valid image file (JPEG, PNG, or JPG)');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const orgDataToSave = {
            ...formData,
            logoFile: formData.logo
        };

        delete orgDataToSave.logoPreview;
        delete orgDataToSave.logo;

        try {
            setSaving(true);
            await onSubmit(orgDataToSave);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center">
                        <Building2 className="w-6 h-6 text-orange-600 mr-2" />
                        <h2 className="text-xl font-semibold text-gray-800">Add/Edit Organization</h2>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">Add organization details first time, then edit the same details later</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {/* Logo Upload */}
                    <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">Organization Logo</h3>
                        <div className="flex items-center space-x-6">
                            <div className="flex-shrink-0">
                                {formData.logoPreview ? (
                                    <div className="relative">
                                        <img
                                            src={formData.logoPreview}
                                            alt="Organization logo preview"
                                            className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, logo: null, logoPreview: null })}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="w-32 h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                                        <ImageIcon className="w-12 h-12 text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Upload Logo
                                </label>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/jpg"
                                        onChange={handleLogoUpload}
                                        className="hidden"
                                        id="logo-upload"
                                    />
                                    <label
                                        htmlFor="logo-upload"
                                        className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors"
                                    >
                                        <Upload className="w-4 h-4 mr-2" />
                                        Choose Image
                                    </label>
                                    <span className="text-xs text-gray-500">
                                        JPEG, PNG, JPG (Max 2MB)
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Basic Information */}
                    <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Organization Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="Enter organization name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tagline
                                </label>
                                <input
                                    type="text"
                                    name="tagline"
                                    value={formData.tagline}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="Enter tagline"
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Enter organization description"
                            />
                        </div>
                    </div>

                    {/* Values */}
                    <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">Values</h3>
                        <textarea
                            name="values"
                            value={formData.values}
                            onChange={handleChange}
                            rows="2"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Enter organization values"
                        />
                    </div>

                    {/* Contact Information */}
                    <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">Contact Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <Mail className="w-4 h-4 inline mr-1" />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="contact@organization.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <Phone className="w-4 h-4 inline mr-1" />
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="+1 234 567 8900"
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <MapPin className="w-4 h-4 inline mr-1" />
                                Address
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Organization address"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <Globe className="w-4 h-4 inline mr-1" />
                                    Website
                                </label>
                                <input
                                    type="url"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="https://organization.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <Calendar className="w-4 h-4 inline mr-1" />
                                    Established Year
                                </label>
                                <input
                                    type="text"
                                    name="establishedYear"
                                    value={formData.establishedYear}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="2020"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                        {onCancel && (
                            <button
                                type="button"
                                onClick={onCancel}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {saving ? 'Saving...' : 'Save Organization'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OrganizationForm;