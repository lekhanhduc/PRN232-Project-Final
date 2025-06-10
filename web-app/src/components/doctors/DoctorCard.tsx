'use client';
import React from 'react';
import { Star, MapPin, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Doctor } from './data/doctorData';

interface DoctorCardProps {
    doctor: Doctor;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
    const router = useRouter();

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl">
            <div className="p-8">
                <div className="flex items-start">
                    <div className="flex-shrink-0 mr-5">
                        <img
                            className="h-24 w-24 rounded-full object-cover border-4 border-blue-100 shadow-sm"
                            src={doctor.image}
                            alt={doctor.name}
                        />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900">{doctor.name}</h2>
                        <p className="text-blue-600 font-semibold text-lg mt-1">{doctor.specialty}</p>
                        <div className="mt-2 flex items-center">
                            <Star className="h-5 w-5 text-yellow-400 fill-current" />
                            <span className="ml-2 text-gray-800 font-medium">{doctor.rating}</span>
                            <span className="mx-2 text-gray-400">•</span>
                            <span className="text-gray-500">{doctor.reviews} đánh giá</span>
                        </div>
                    </div>
                </div>

                <div className="mt-6 border-t border-gray-100 pt-6">
                    <div className="flex items-center text-gray-600 mb-3">
                        <MapPin className="h-5 w-5 mr-2 text-blue-400" />
                        <span className="text-gray-700">{doctor.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                        <Calendar className="h-5 w-5 mr-2 text-blue-400" />
                        <span className="text-gray-700">{doctor.experience} kinh nghiệm</span>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                    <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${doctor.availability.includes('Today') ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                            }`}
                    >
                        {doctor.availability}
                    </span>
                    <button
                        onClick={() => router.push(`/doctor-detail/${doctor.id}`)}
                        className="inline-flex items-center px-5 py-2.5 border border-transparent text-base font-semibold rounded-lg shadow-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                    >
                        Đặt lịch ngay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DoctorCard;