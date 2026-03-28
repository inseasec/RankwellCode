import React from 'react';
import {
    Building2,
    Users,
    BookOpen,
    Calendar,
    Eye
} from 'lucide-react';

const OrganizationGrid = ({organizations, onOrgClick}) => {
    if (organizations.length === 0) {
        return (
            <div className="text-center py-12">
                <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4"/>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Organizations Yet</h3>
                <p className="text-gray-500">Click on "Add Organization" to create your first organization</p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Organizations</h2>
                <p className="text-gray-600">Total {
                    organizations.length
                }
                    organization(s)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {
                organizations.map((org) => (
                    <div key={
                            org.id
                        }
                        onClick={
                            () => onOrgClick(org)
                        }
                        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
                        {/* Logo Section */}
                        <div className="h-32 bg-gray-200 flex items-center justify-center p-4">
                            {
                            org.logo ? (
                                <img src={
                                        org.logo
                                    }
                                    alt={
                                        org.name
                                    }
                                    className="h-12 w-12 object-contain rounded-full border-4 border-white shadow-lg "/>
                            ) : (
                                <div className="h-24 w-24 bg-white/20 rounded-full flex items-center justify-center">
                                    <Building2 className="w-12 h-12 text-orange-600"/>
                                </div>
                            )
                        } </div>

                        {/* Content Section */}
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
                                {
                                org.name
                            } </h3>
                            {
                            org.tagline && (
                                <p className="text-sm text-orange-600 mb-2 line-clamp-1">
                                    {
                                    org.tagline
                                } </p>
                            )
                        }
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                {
                                org.description || 'No description available'
                            } </p>

                            {/* Stats */}
                            <div className="flex items-center justify-between text-sm border-t pt-3">
                                <div className="flex items-center text-gray-500">
                                    <Users className="w-4 h-4 mr-1"/>
                                    <span>{
                                        org.stats ?. students || 0
                                    }</span>
                                </div>
                                <div className="flex items-center text-gray-500">
                                    <BookOpen className="w-4 h-4 mr-1"/>
                                    <span>{
                                        org.stats ?. courses || 0
                                    }</span>
                                </div>
                                <div className="flex items-center text-gray-500">
                                    <Calendar className="w-4 h-4 mr-1"/>
                                    <span>{
                                        org.establishedYear || 'N/A'
                                    }</span>
                                </div>
                            </div>

                            {/* View Button */}
                            <button className="mt-3 w-full flex items-center justify-center px-3 py-2 bg-gray-50 text-orange-600 rounded-lg hover:bg-gray-100 transition-colors text-sm">
                                <Eye className="w-4 h-4 mr-1"/>
                                View Details
                            </button>
                        </div>
                    </div>
                ))
            } </div>
        </div>
    );
};

export default OrganizationGrid;
