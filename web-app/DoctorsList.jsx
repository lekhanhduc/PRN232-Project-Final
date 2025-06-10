'use client'
import React, { useState } from 'react';
import { Search, Filter, Star, MapPin, Calendar, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const DoctorsList = () => {
    const router = useRouter();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState('All');

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

    const filteredDoctors = doctors.filter(doctor => {
        const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSpecialty = selectedSpecialty === 'All' || doctor.specialty === selectedSpecialty;
        return matchesSearch && matchesSpecialty;
    });

    return (
        <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
                        Find Your <span className="text-blue-600">Specialist</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Browse our network of highly qualified medical professionals and book your appointment today.
                    </p>
                </div>

                {/* Search and Filter Section */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 backdrop-blur-sm bg-opacity-95 border border-gray-100">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Search Box */}
                        <div className="flex-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-blue-500" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-12 pr-4 py-4 border-0 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:bg-white transition duration-200"
                                placeholder="Search by doctor name or specialty..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Specialty Filter */}
                        <div className="w-full md:w-72">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Filter className="h-5 w-5 text-blue-500" />
                                </div>
                                <select
                                    className="block w-full pl-12 pr-12 py-4 border-0 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:bg-white transition duration-200 appearance-none"
                                    value={selectedSpecialty}
                                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                                >
                                    {specialties.map((specialty) => (
                                        <option key={specialty} value={specialty}>
                                            {specialty}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                    <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-8 flex items-center justify-between">
                    <p className="text-gray-600 font-medium">
                        Showing <span className="text-blue-600 font-semibold">{filteredDoctors.length}</span> specialists
                    </p>
                    <div className="flex gap-2">
                        <button className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                            Most Popular
                        </button>
                        <button className="bg-white hover:bg-gray-50 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                            Highest Rated
                        </button>
                    </div>
                </div>

                {/* Doctors Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredDoctors.map((doctor) => (
                        <div
                            key={doctor.id}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                        >
                            <div className="relative h-32 bg-gradient-to-r from-blue-500 to-blue-600">
                                <div className="absolute -bottom-12 left-6">
                                    <div className="relative h-24 w-24 rounded-xl overflow-hidden border-4 border-white shadow-md">
                                        <img
                                            className="h-full w-full object-cover"
                                            src={doctor.image}
                                            alt={doctor.name}
                                        />
                                    </div>
                                </div>
                                {doctor.verified && (
                                    <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-full p-1">
                                        <CheckCircle className="h-5 w-5 text-blue-600" />
                                    </div>
                                )}
                            </div>

                            <div className="p-6 pt-14">
                                <div>
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-bold text-gray-900">{doctor.name}</h2>
                                        <div className="flex items-center bg-yellow-50 px-2 py-1 rounded">
                                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                            <span className="ml-1 text-gray-800 font-semibold">{doctor.rating}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center mt-1">
                                        <span className="text-blue-600 font-medium">{doctor.specialty}</span>
                                        <span className="mx-2 text-gray-300">•</span>
                                        <span className="text-gray-500 text-sm">{doctor.reviews} reviews</span>
                                    </div>
                                </div>

                                <div className="mt-6 space-y-3">
                                    <div className="flex items-center text-gray-600">
                                        <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                                        <span className="text-sm">{doctor.location}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                                        <span className="text-sm">{doctor.experience} experience</span>
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center justify-between">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${doctor.availability.includes('Today')
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-blue-100 text-blue-800'
                                        }`}>
                                        {doctor.availability}
                                    </span>
                                    <button
                                        onClick={() => router.push(`/doctor-detail/${doctor.id}`)}
                                        className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                    >
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="mt-16 flex justify-center">
                    <nav className="inline-flex rounded-xl shadow-md overflow-hidden">
                        <Link href="#" className="py-3 px-4 bg-white border-r border-gray-200 text-gray-500 hover:bg-gray-50 flex items-center">
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Previous
                        </Link>
                        <Link href="#" className="py-3 px-5 bg-white border-r border-gray-200 hover:bg-gray-50">
                            1
                        </Link>
                        <Link href="#" className="py-3 px-5 bg-blue-600 text-white font-medium border-r border-blue-700">
                            2
                        </Link>
                        <Link href="#" className="py-3 px-5 bg-white border-r border-gray-200 hover:bg-gray-50">
                            3
                        </Link>
                        <Link href="#" className="py-3 px-4 bg-white text-gray-500 hover:bg-gray-50 flex items-center">
                            Next
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default DoctorsList; 