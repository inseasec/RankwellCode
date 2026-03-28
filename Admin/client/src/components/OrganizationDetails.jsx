import React from 'react';
import {
    ArrowLeft,
    Building2,
    Mail,
    Phone,
    MapPin,
    Globe,
    Calendar,
    Users,
    BookOpen,
    Briefcase,
    Target,
    Eye,
    Award,
    User
} from 'lucide-react';

const OrganizationDetails = ({organization, onBack}) => {
    return (
        <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <button onClick={onBack}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
                <ArrowLeft className="w-5 h-5 mr-2"/>
                Back to Organizations
            </button>

            {/* Header with Logo */}
            <div className="bg-white rounded-lg shadow mb-6">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-start space-x-6">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            {
                            organization.logo ? (
                                <img src={
                                        organization.logo
                                    }
                                    alt={
                                        organization.name
                                    }
                                    className="w-16 h-16 object-contain rounded-lg border-2 border-gray-200"/>
                            ) : (
                                <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                                    <Building2 className="w-12 h-12 text-white"/>
                                </div>
                            )
                        } </div>

                        {/* Title and Basic Info */}
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">
                                {
                                organization.name
                            } </h1>
                            {
                            organization.tagline && (
                                <p className="text-indigo-600 mb-3">
                                    {
                                    organization.tagline
                                }</p>
                            )
                        }
                            <p className="text-gray-600">
                                {
                                organization.description
                            }</p>
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                {
                (organization.email || organization.phone || organization.address || organization.website) && (
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {
                            organization.email && (
                                <div className="flex items-center text-gray-600">
                                    <Mail className="w-5 h-5 mr-2 text-indigo-600"/>
                                    <span>{
                                        organization.email
                                    }</span>
                                </div>
                            )
                        }
                            {
                            organization.phone && (
                                <div className="flex items-center text-gray-600">
                                    <Phone className="w-5 h-5 mr-2 text-indigo-600"/>
                                    <span>{
                                        organization.phone
                                    }</span>
                                </div>
                            )
                        }
                            {
                            organization.address && (
                                <div className="flex items-center text-gray-600">
                                    <MapPin className="w-5 h-5 mr-2 text-indigo-600"/>
                                    <span>{
                                        organization.address
                                    }</span>
                                </div>
                            )
                        }
                            {
                            organization.website && (
                                <div className="flex items-center text-gray-600">
                                    <Globe className="w-5 h-5 mr-2 text-indigo-600"/>
                                    <a href={
                                            organization.website
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-indigo-600 hover:underline">
                                        {
                                        organization.website
                                    } </a>
                                </div>
                            )
                        }
                            {
                            organization.establishedYear && (
                                <div className="flex items-center text-gray-600">
                                    <Calendar className="w-5 h-5 mr-2 text-indigo-600"/>
                                    <span>Established: {
                                        organization.establishedYear
                                    }</span>
                                </div>
                            )
                        } </div>
                    </div>
                )
            }

                {/* Vision & Mission */}
                {
                (organization.vision || organization.mission) && (
                    <div className="grid md:grid-cols-2 gap-6 p-6 border-b border-gray-200">
                        {
                        organization.vision && (
                            <div>
                                <div className="flex items-center mb-3">
                                    <Eye className="w-5 h-5 text-indigo-600 mr-2"/>
                                    <h2 className="text-lg font-semibold text-gray-800">Vision</h2>
                                </div>
                                <p className="text-gray-600">
                                    {
                                    organization.vision
                                }</p>
                            </div>
                        )
                    }
                        {
                        organization.mission && (
                            <div>
                                <div className="flex items-center mb-3">
                                    <Target className="w-5 h-5 text-indigo-600 mr-2"/>
                                    <h2 className="text-lg font-semibold text-gray-800">Mission</h2>
                                </div>
                                <p className="text-gray-600">
                                    {
                                    organization.mission
                                }</p>
                            </div>
                        )
                    } </div>
                )
            }

                {/* Values */}
                {
                organization.values && (
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center mb-3">
                            <Award className="w-5 h-5 text-indigo-600 mr-2"/>
                            <h2 className="text-lg font-semibold text-gray-800">Values</h2>
                        </div>
                        <p className="text-gray-600">
                            {
                            organization.values
                        }</p>
                    </div>
                )
            }

                {/* Director Information */}
                {
                (organization.directorName || organization.directorTitle || organization.directorBio) && (
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center mb-3">
                            <User className="w-5 h-5 text-indigo-600 mr-2"/>
                            <h2 className="text-lg font-semibold text-gray-800">Leadership</h2>
                        </div>
                        <div className="border-l-4 border-indigo-500 pl-4">
                            {
                            organization.directorName && (
                                <h3 className="text-xl font-semibold text-gray-800">
                                    {
                                    organization.directorName
                                }</h3>
                            )
                        }
                            {
                            organization.directorTitle && (
                                <p className="text-indigo-600 mb-3">
                                    {
                                    organization.directorTitle
                                }</p>
                            )
                        }
                            {
                            organization.directorBio && (
                                <p className="text-gray-600">
                                    {
                                    organization.directorBio
                                }</p>
                            )
                        } </div>
                    </div>
                )
            }

                {/* Offerings */}
                {
                organization.offerings && organization.offerings.length > 0 && (
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">What We Offer</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {
                            organization.offerings.map((offering, index) => (
                                <div key={index}
                                    className="flex items-center text-gray-600">
                                    <span className="text-indigo-500 mr-2">✓</span>
                                    {offering} </div>
                            ))
                        } </div>
                    </div>
                )
            }

                {/* Statistics */}
                {
                organization.stats && (
                    <div className="p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Statistics</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gray-50 rounded-lg p-4 text-center">
                                <Users className="w-8 h-8 text-indigo-600 mx-auto mb-2"/>
                                <p className="text-2xl font-bold text-gray-800">
                                    {
                                    organization.stats.students || 0
                                }</p>
                                <p className="text-sm text-gray-500">Total Students</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center">
                                <BookOpen className="w-8 h-8 text-indigo-600 mx-auto mb-2"/>
                                <p className="text-2xl font-bold text-gray-800">
                                    {
                                    organization.stats.courses || 0
                                }</p>
                                <p className="text-sm text-gray-500">Total Courses</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center">
                                <Briefcase className="w-8 h-8 text-indigo-600 mx-auto mb-2"/>
                                <p className="text-2xl font-bold text-gray-800">
                                    {
                                    organization.stats.instructors || 0
                                }</p>
                                <p className="text-sm text-gray-500">Instructors</p>
                            </div>
                        </div>
                    </div>
                )
            }

                {/* Metadata */}
                <div className="p-6 bg-gray-50 rounded-b-lg">
                    <p className="text-xs text-gray-500">
                        Created on: {
                        new Date(organization.createdAt).toLocaleString()
                    } </p>
                    <p className="text-xs text-gray-500">
                        Organization ID: {
                        organization.id
                    } </p>
                </div>
            </div>
        </div>
    );
};

export default OrganizationDetails;
