import React, {useState, useEffect} from 'react';
import {
    LogOut,
    Users,
    BookOpen,
    DollarSign,
    Settings,
    Target,
    Eye,
    Award,
    Briefcase,
    Menu,
    X,
    Building2,
    LayoutGrid,
    Home,
    PlusCircle,
    List
} from 'lucide-react';
import OrganizationForm from './OrganizationForm.jsx';
import OrganizationGrid from './OrganizationGrid.jsx';
import OrganizationDetails from './OrganizationDetails.jsx';
import OrganizationView from './OrganizationView.jsx';
// import { API_BASE_URL } from '../config.js';

const AdminDashboard = () => {
    const API_BASE_URL = import.meta.env.VITE_API_URL;
    const getLogoUrl = () => `${API_BASE_URL}/organization/current/logo?t=${Date.now()}`;
    const normalizeOrganizationName = (value) => (value || '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    const mapBackendToFrontendOrganization = (apiOrg) => ({
        id: apiOrg.id,
        name: apiOrg.orgName || '',
        tagline: apiOrg.orgTagline || '',
        description: apiOrg.orgAbout || '',
        values: apiOrg.orgValues || '',
        email: apiOrg.orgEmail || '',
        phone: apiOrg.orgPhone || '',
        address: apiOrg.orgAddress || '',
        website: apiOrg.orgWebsite || '',
        establishedYear: apiOrg.orgEstablishedYear || '',
        logo: apiOrg.orgLogo ? getLogoUrl() : null,
        createdAt: apiOrg.createdAt || new Date().toISOString()
    });

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activePage, setActivePage] = useState('dashboard');
    const [organizations, setOrganizations] = useState([]);
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [orgData, setOrgData] = useState(null);
    const [tenantHostMismatch, setTenantHostMismatch] = useState(false);
    const latestOrganization = selectedOrg || organizations[organizations.length - 1] || null;

    const organizationDetails = {
        name: "Rankwell",
        tagline: "The best training institute for learning in-demand skills",
        description: "Rankwell is a career boost platform for developers, nurturing the leaders and innovators of tomorrow. We offer dynamic learning environment that fosters intellectual curiosity, creativity, and critical thinking.",
        vision: "To be a premier institution known for academic training, innovative research, certification courses and live project exposures. We aspire to cultivate a vibrant learning community where students are inspired to boost their career in demanding skills.",
        mission: "To deliver career boost platform individuals with the knowledge and skills necessary for Information Technology (IT) field. We are committed to providing online and offline platforms for coding courses and live project exposures.",
        values: "We strive for quality and excellence in all aspects of our institution – in teaching, research, and service. We are committed to maintaining high standards of quality and continuously improving our programs to meet the evolving needs of the IT industry via learning the in-demand skills.",
        director: {
            name: "Mr. Jaspreet Singh Bedi",
            title: "Chairman & Director",
            bio: "Earlier, Mr Jaspreet began his career as a Software Engineer in India and subsequently transferred to Europe and Australia as a Security Consultant. While in Europe, in addition to implementing Security solutions, He also acquired significant exposure in Software Sales. He then established Seasec in 2020 from a small home setup. The company now boasts a well-established team across India and Europe and conducts its operations from a self-owned office. Alongside his responsibilities in managing the Seasec, Mr. Jaspreet is also establishing new business ventures by dedicating his time, efforts, and financial resources. His latest initiative is to develop own Ed-Tech platform named Rankwell."
        },
        offerings: [
            "Career oriented programs with practical learning",
            "Live projects facilities",
            "Certification courses",
            "Online and offline coding courses",
            "Recorded instructional videos",
            "Detailed notes and practice exams"
        ],
        stats: {
            students: 1234,
            courses: 45,
            revenue: 12345,
            instructors: 12
        }
    };

    useEffect(() => {
        setOrgData(organizationDetails);
        const loadCurrentOrganization = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/organization/current`);
                if (!response.ok) {
                    return;
                }
                const data = await response.json();
                if (!data || !data.id) {
                    return;
                }
                const mappedOrganization = mapBackendToFrontendOrganization(data);
                setOrganizations([mappedOrganization]);
                setSelectedOrg(mappedOrganization);
            } catch (error) {
                console.error('Failed to load organization data');
            }
        };

        loadCurrentOrganization();
    }, []);

    useEffect(() => {
        const currentHost = window.location.hostname.toLowerCase();
        if (!currentHost.endsWith('.edtech.com')) {
            setTenantHostMismatch(false);
            return;
        }

        const orgName = latestOrganization?.name;
        if (!orgName) {
            setTenantHostMismatch(false);
            return;
        }

        const expectedSubdomain = normalizeOrganizationName(orgName);
        if (!expectedSubdomain) {
            setTenantHostMismatch(false);
            return;
        }

        const currentSubdomain = currentHost.replace('.edtech.com', '');
        setTenantHostMismatch(currentSubdomain !== expectedSubdomain);
    }, [latestOrganization]);

    const handleLogout = () => {
        localStorage.removeItem('adminData');
        window.location.href = `${import.meta.env.BASE_URL}login`;
    };

    const handleAddOrganization = async (newOrg) => {
        const existingOrganization = organizations[0] || null;
        const orgToSave = {
            ...newOrg,
            id: existingOrganization?.id || Date.now(),
            createdAt: existingOrganization?.createdAt || new Date().toISOString()
        };
        try {
            const formData = new FormData();
            formData.append('orgName', orgToSave.name || '');
            formData.append('orgTagline', orgToSave.tagline || '');
            formData.append('orgAbout', orgToSave.description || '');
            formData.append('orgValues', orgToSave.values || '');
            formData.append('orgEmail', orgToSave.email || '');
            formData.append('orgPhone', orgToSave.phone || '');
            formData.append('orgAddress', orgToSave.address || '');
            formData.append('orgWebsite', orgToSave.website || '');
            formData.append('orgEstablishedYear', orgToSave.establishedYear || '');
            formData.append('createdAt', orgToSave.createdAt || new Date().toISOString());
            if (orgToSave.logoFile) {
                formData.append('orgLogo', orgToSave.logoFile);
            }

            const response = await fetch(`${API_BASE_URL}/organization/current`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to save organization');
            }

            const savedOrganization = await response.json();
            const mappedOrganization = mapBackendToFrontendOrganization(savedOrganization);
            setOrganizations([mappedOrganization]);
            setSelectedOrg(mappedOrganization);
            setActivePage('view-org');
        } catch (error) {
            alert('Unable to save organization details. Please try again.');
        }
    };

    const handleOrgClick = (org) => {
        setSelectedOrg(org);
        setActivePage('org-detail');
    };

    const handleBackToGrid = () => {
        setSelectedOrg(null);
        setActivePage('org-grid');
    };

    const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');
    const organizationBaseName = (latestOrganization?.name || '').trim();
    const organizationBrandName = organizationBaseName ? `${organizationBaseName} Edtech` : 'Company Edtech';

    const menuItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: Home
        }, {
            id: 'org-form',
            label: 'Add/Edit Organization',
            icon: Building2
        }, {
            id: 'view-org',
            label: 'View Organization',
            icon: Eye
        },
    ];

    if (!orgData) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-gray-500">Loading dashboard...</div>
            </div>
        );
    }

    if (tenantHostMismatch) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
                <div className="max-w-xl w-full bg-white rounded-lg shadow p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">404</h2>
                    <p className="text-gray-600">Page does not exist.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <div className={
                `${
                    sidebarOpen ? 'w-64' : 'w-20'
                } bg-gray-900 text-white transition-all duration-300 flex flex-col fixed h-full z-10`
            }>
                <div className="flex items-center justify-between p-4 border-b border-gray-800">
                    {
                    sidebarOpen && <h1 className="text-xl font-bold">
                        {organizationBrandName}</h1>
                }
                    <button onClick={
                            () => setSidebarOpen(!sidebarOpen)
                        }
                        className="p-2 rounded-lg hover:bg-gray-800">
                        {
                        sidebarOpen ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>
                        }
                    </button>
                </div>

                <nav className="flex-1 mt-6">
                    {
                    menuItems.map((item) => (
                        <button key={
                                item.id
                            }
                            onClick={
                                () => {
                                    setActivePage(item.id);
                                    if (item.id === 'org-grid') {
                                        setSelectedOrg(null);
                                    }
                                }
                            }
                            className={
                                `w-full flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors ${
                                    activePage === item.id ? 'bg-gray-800 text-white border-r-4 border-indigo-500' : ''
                                }`
                        }>
                            <item.icon className="w-5 h-5"/> {
                            sidebarOpen && <span className="ml-3">
                                {
                                item.label
                            }</span>
                        } </button>
                    ))
                } </nav>

                <div className="p-4 border-t border-gray-800">
                    {
                    sidebarOpen && (
                        <div className="text-xs text-gray-500">
                            <p>{organizationBrandName} Admin Panel</p>
                            <p>Version 1.0.0</p>
                        </div>
                    )
                } </div>
            </div>

            {/* Main Content */}
            <div className={
                `flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
                    sidebarOpen ? 'ml-64' : 'ml-20'
                }`
            }>
                {/* Navbar */}
                <nav className="bg-white shadow-lg">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                <h1 className="text-xl font-bold text-gray-800">
                                    {
                                    activePage === 'dashboard' && `${
                                        orgData.name
                                    } Admin`
                                }
                                    {
                                    activePage === 'org-form' && 'Add/Edit Organization'
                                }
                                    {
                                    activePage === 'view-org' && 'View Organization'
                                }
                                    {
                                    activePage === 'org-grid' && 'Organizations List'
                                }
                                    {
                                    activePage === 'org-detail' && 'Organization Details'
                                } </h1>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span className="text-gray-600">Welcome, {
                                    adminData.name || 'Admin'
                                }</span>
                                <button onClick={handleLogout}
                                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100">
                                    <LogOut className="w-4 h-4 mr-1"/>
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {
                    activePage === 'dashboard' && (
                        <DashboardContent orgData={orgData}
                            organizationsCount={
                                organizations.length
                            }/>
                    )
                }
                    {
                    activePage === 'org-form' && (
                        <OrganizationForm onSubmit={handleAddOrganization}
                            initialData={latestOrganization}/>
                    )
                }
                    {
                    activePage === 'view-org' && (
                        <OrganizationView organization={latestOrganization}/>
                    )
                }
                    {
                    activePage === 'org-grid' && !selectedOrg && (
                        <OrganizationGrid organizations={organizations}
                            onOrgClick={handleOrgClick}/>
                    )
                }
                    {
                    activePage === 'org-detail' && selectedOrg && (
                        <OrganizationDetails organization={selectedOrg}
                            onBack={handleBackToGrid}/>
                    )
                } </main>
            </div>
        </div>
    );
};

// Dashboard Content Component
const DashboardContent = ({orgData, organizationsCount}) => {
    return (
        <div> {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Total Students</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {
                                orgData.stats.students.toLocaleString()
                            }</p>
                        </div>
                        <Users className="w-8 h-8 text-orange-600"/>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Total Courses</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {
                                orgData.stats.courses
                            }</p>
                        </div>
                        <BookOpen className="w-8 h-8 text-orange-600"/>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Revenue</p>
                            <p className="text-2xl font-bold text-gray-800">${
                                orgData.stats.revenue.toLocaleString()
                            }</p>
                        </div>
                        <DollarSign className="w-8 h-8 text-orange-600"/>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Organizations</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {organizationsCount}</p>
                        </div>
                        <Briefcase className="w-8 h-8 text-orange-600"/>
                    </div>
                </div>
            </div>

            {/* Organization Overview */}
            <div className="bg-white rounded-lg shadow mb-8">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Organization Overview</h2>
                </div>
                <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        {
                        orgData.name
                    }</h3>
                    <p className="text-orange-600 mb-4">
                        {
                        orgData.tagline
                    }</p>
                    <p className="text-gray-600">
                        {
                        orgData.description
                    }</p>
                </div>
            </div>

            {/* Vision & Mission */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center">
                            <Eye className="w-5 h-5 text-orange-600 mr-2"/>
                            <h2 className="text-lg font-semibold text-gray-800">Our Vision</h2>
                        </div>
                    </div>
                    <div className="p-6">
                        <p className="text-gray-600">
                            {
                            orgData.vision
                        }</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center">
                            <Target className="w-5 h-5 text-orange-600 mr-2"/>
                            <h2 className="text-lg font-semibold text-gray-800">Our Mission</h2>
                        </div>
                    </div>
                    <div className="p-6">
                        <p className="text-gray-600">
                            {
                            orgData.mission
                        }</p>
                    </div>
                </div>
            </div>

            {/* Values */}
            <div className="bg-white rounded-lg shadow mb-8">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center">
                        <Award className="w-5 h-5 text-orange-600 mr-2"/>
                        <h2 className="text-lg font-semibold text-gray-800">Our Values</h2>
                    </div>
                </div>
                <div className="p-6">
                    <p className="text-gray-600">
                        {
                        orgData.values
                    }</p>
                </div>
            </div>

            {/* What We Offer */}
            <div className="bg-white rounded-lg shadow mb-8">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center">
                        <BookOpen className="w-5 h-5 text-orange-600 mr-2"/>
                        <h2 className="text-lg font-semibold text-gray-800">What We Offer</h2>
                    </div>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {
                        orgData.offerings.map((item, index) => (
                            <div key={index}
                                className="flex items-center text-gray-600">
                                <span className="text-orange-500 mr-2">✓</span>
                                {item} </div>
                        ))
                    } </div>
                </div>
            </div>

            {/* Leadership */}
            <div className="bg-white rounded-lg shadow mb-8">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Leadership</h2>
                </div>
                <div className="p-6">
                    <div className="border-l-4 border-indigo-500 pl-4">
                        <h3 className="text-xl font-semibold text-gray-800">
                            {
                            orgData.director.name
                        }</h3>
                        <p className="text-orange-600 mb-3">
                            {
                            orgData.director.title
                        }</p>
                        <p className="text-gray-600">
                            {
                            orgData.director.bio
                        }</p>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
                </div>
                <div className="p-6">
                    <p className="text-gray-500">No recent activity to display.</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
