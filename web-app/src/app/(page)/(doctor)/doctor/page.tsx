'use client'
import React, { useState } from 'react';
import { Search, Filter, Star, MapPin, Calendar, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const DoctorsList = () => {

    const router = useRouter();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState('All');

    // Sample data for doctors
    const doctors = [
        {
            id: 1,
            name: 'Dr. Sarah Johnson',
            specialty: 'Cardiologist',
            rating: 4.9,
            reviews: 124,
            experience: '15 years',
            location: 'Manhattan Medical Center',
            availability: 'Available Today',
            image: 'https://randomuser.me/api/portraits/women/45.jpg',
            verified: true,
        },
        {
            id: 2,
            name: 'Dr. Michael Chen',
            specialty: 'Neurologist',
            rating: 4.8,
            reviews: 98,
            experience: '12 years',
            location: 'Central Hospital',
            availability: 'Available Tomorrow',
            image: 'https://randomuser.me/api/portraits/men/32.jpg',
            verified: true,
        },
        {
            id: 3,
            name: 'Dr. Emily Rodriguez',
            specialty: 'Pediatrician',
            rating: 4.7,
            reviews: 156,
            experience: '10 years',
            location: 'Children\'s Medical Center',
            availability: 'Available Today',
            image: 'https://randomuser.me/api/portraits/women/33.jpg',
            verified: true,
        },
        {
            id: 4,
            name: 'Dr. James Wilson',
            specialty: 'Dermatologist',
            rating: 4.6,
            reviews: 87,
            experience: '8 years',
            location: 'Skin & Beauty Clinic',
            availability: 'Available in 2 days',
            image: 'https://randomuser.me/api/portraits/men/52.jpg',
            verified: false,
        },
        {
            id: 5,
            name: 'Dr. Sophia Patel',
            specialty: 'Gynecologist',
            rating: 4.9,
            reviews: 215,
            experience: '14 years',
            location: 'Women\'s Health Center',
            availability: 'Available Today',
            image: 'https://randomuser.me/api/portraits/women/67.jpg',
            verified: true,
        },
        {
            id: 6,
            name: 'Dr. Robert Kim',
            specialty: 'Orthopedic Surgeon',
            rating: 4.8,
            reviews: 178,
            experience: '16 years',
            location: 'Orthopedic Specialists',
            availability: 'Available Tomorrow',
            image: 'https://randomuser.me/api/portraits/men/64.jpg',
            verified: true,
        }
    ];

    const specialties = ['All', 'Cardiologist', 'Neurologist', 'Pediatrician', 'Dermatologist', 'Gynecologist', 'Orthopedic Surgeon'];

    // Filter doctors based on search term and selected specialty
    const filteredDoctors = doctors.filter(doctor => {
        const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSpecialty = selectedSpecialty === 'All' || doctor.specialty === selectedSpecialty;
        return matchesSearch && matchesSpecialty;
    });

    return (
        <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Specialist</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Browse our network of highly qualified medical professionals and book your appointment today.
                    </p>
                </div>

                {/* Search and Filter Section */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search Box */}
                        <div className="flex-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Search by doctor name or specialty..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Specialty Filter */}
                        <div className="w-full md:w-64">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Filter className="h-5 w-5 text-gray-400" />
                                </div>
                                <select
                                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none"
                                    value={selectedSpecialty}
                                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                                >
                                    {specialties.map((specialty) => (
                                        <option key={specialty} value={specialty}>
                                            {specialty}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-6">
                    <p className="text-gray-600">
                        Showing <span className="font-medium text-gray-900">{filteredDoctors.length}</span> doctors
                    </p>
                </div>

                {/* Doctors Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDoctors.map((doctor) => (
                        <div key={doctor.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            <div className="p-6">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 mr-4">
                                        <img
                                            className="h-20 w-20 rounded-full object-cover border-2 border-blue-100"
                                            src={doctor.image}
                                            alt={doctor.name}
                                        />
                                    </div>
                                    <div>
                                        <div className="flex items-center">
                                            <h2 className="text-xl font-semibold text-gray-900">{doctor.name}</h2>
                                            {doctor.verified && (
                                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                    Verified
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-blue-600 font-medium">{doctor.specialty}</p>
                                        <div className="mt-1 flex items-center">
                                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                            <span className="ml-1 text-gray-700">{doctor.rating}</span>
                                            <span className="mx-1 text-gray-500">•</span>
                                            <span className="text-gray-500">{doctor.reviews} reviews</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 border-t border-gray-100 pt-4">
                                    <div className="flex items-center text-gray-600 mb-2">
                                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                                        <span>{doctor.location}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600 mb-2">
                                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                        <span>{doctor.experience} experience</span>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center justify-between">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${doctor.availability.includes('Today')
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-blue-100 text-blue-800'
                                        }`}>
                                        {doctor.availability}
                                    </span>
                                    <button
                                        onClick={() => router.push(`/doctor-detail/${doctor.id}`)}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="mt-10 flex justify-center">
                    <nav className="inline-flex rounded-md shadow">
                        <a href="#" className="py-2 px-4 border border-gray-300 bg-white rounded-l-md hover:bg-gray-50">
                            Previous
                        </a>
                        <a href="#" className="py-2 px-4 border-t border-b border-gray-300 bg-white hover:bg-gray-50">
                            1
                        </a>
                        <a href="#" className="py-2 px-4 border-t border-b border-gray-300 bg-blue-50 text-blue-600 font-medium">
                            2
                        </a>
                        <a href="#" className="py-2 px-4 border-t border-b border-gray-300 bg-white hover:bg-gray-50">
                            3
                        </a>
                        <a href="#" className="py-2 px-4 border border-gray-300 bg-white rounded-r-md hover:bg-gray-50">
                            Next
                        </a>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default DoctorsList;
