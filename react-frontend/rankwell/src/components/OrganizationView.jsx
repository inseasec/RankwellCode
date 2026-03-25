import React from 'react';
import {Building2, Mail, MapPin, Calendar, Award} from 'lucide-react';

const InfoRow = ({label, value}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 py-2 border-b border-gray-100 last:border-b-0">
            <p className="text-sm font-medium text-gray-500">{label}</p>
            <p className={`text-sm md:col-span-2 break-words ${value ? 'text-gray-800' : 'text-gray-400 italic'}`}>
                {value || 'Not provided'}
            </p>
        </div>
    );
};

const OrganizationView = ({organization}) => {
    const previewOrganization = {
        id: 'ORG-001',
        name: 'Sample Academy',
        tagline: 'Upskilling students for modern careers',
        description: 'This is a sample organization description. Replace it by adding a real organization from the Add Organization form.',
        values: 'Innovation, practical learning, and student success.',
        email: 'info@sampleacademy.com',
        phone: '+91 90000 00000',
        address: '123 Learning Street, Education City',
        website: 'https://sampleacademy.com',
        establishedYear: '2021',
        createdAt: new Date().toISOString()
    };

    const organizationToDisplay = organization || previewOrganization;
    const isPreviewMode = !organization;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {isPreviewMode && (
                <div className="bg-orange-50 border border-orange-200 text-orange-700 rounded-lg px-4 py-3 text-sm">
                    Preview mode: sample content is shown to demonstrate the View Organization page structure.
                </div>
            )}
            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-start gap-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                            {organizationToDisplay.logo ? (
                                <img src={organizationToDisplay.logo} alt={organizationToDisplay.name} className="w-full h-full object-cover"/>
                            ) : (
                                <Building2 className="w-10 h-10 text-gray-400"/>
                            )}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">{organizationToDisplay.name || 'Organization'}</h2>
                            <p className={`mt-1 ${organizationToDisplay.tagline ? 'text-orange-600' : 'text-gray-400 italic'}`}>
                                {organizationToDisplay.tagline || 'Tagline not provided'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                        <p className={organizationToDisplay.description ? 'text-gray-600' : 'text-gray-400 italic'}>
                            {organizationToDisplay.description || 'Description not provided'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-orange-600"/>
                    <h3 className="text-lg font-semibold text-gray-800">Contact Information</h3>
                </div>
                <div className="p-6">
                    <InfoRow label="Email" value={organizationToDisplay.email}/>
                    <InfoRow label="Phone" value={organizationToDisplay.phone}/>
                    <InfoRow label="Address" value={organizationToDisplay.address}/>
                    <InfoRow label="Website" value={organizationToDisplay.website}/>
                    <InfoRow label="Established Year" value={organizationToDisplay.establishedYear}/>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200 flex items-center gap-2">
                    <Award className="w-5 h-5 text-orange-600"/>
                    <h3 className="text-lg font-semibold text-gray-800">Values</h3>
                </div>
                <div className="p-6">
                    <p className={organizationToDisplay.values ? 'text-gray-600' : 'text-gray-400 italic'}>
                        {organizationToDisplay.values || 'Values not provided'}
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">Organization Meta</h3>
                </div>
                <div className="p-6 space-y-2 text-sm text-gray-600">
                    <p className="flex items-center gap-2"><Calendar className="w-4 h-4"/>Created: {new Date(organizationToDisplay.createdAt).toLocaleString()}</p>
                    <p className="flex items-center gap-2"><MapPin className="w-4 h-4"/>ID: {organizationToDisplay.id}</p>
                </div>
            </div>
        </div>
    );
};

export default OrganizationView;
