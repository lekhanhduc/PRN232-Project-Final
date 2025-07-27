'use client'
import React from 'react';
import { useAllDoctors } from '@/hooks/useAllDoctors';
import { DoctorDetailResponse } from '@/types/doctor';
import Link from 'next/link';

interface DoctorCardProps {
    doctor: DoctorDetailResponse;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
    return (
        <div className="relative bg-white rounded-2xl border border-gray-100 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-200 transition-all duration-300 overflow-hidden group transform hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-white to-indigo-50/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative p-6">
                <div className="flex items-start gap-6">
                    {/* Avatar Section */}
                    <div className="flex-shrink-0">
                        <div className="relative w-20 h-20">
                            {doctor.avatar ? (
                                <img
                                    src={doctor.avatar}
                                    alt={doctor.fullName}
                                    className="w-full h-full rounded-xl object-cover ring-3 ring-white shadow-lg group-hover:ring-blue-200 transition-all duration-300"
                                />
                            ) : (
                                <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-100 via-blue-200 to-indigo-200 flex items-center justify-center ring-3 ring-white shadow-lg group-hover:ring-blue-200 transition-all duration-300">
                                    <svg className="w-10 h-10 text-blue-600 group-hover:text-blue-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            )}
                            {doctor.isAvailable && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-3 border-white shadow-md animate-pulse">
                                    <div className="w-full h-full rounded-full bg-white/30 animate-ping"></div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="flex-1 min-w-0">
                        <div className="mb-3">
                            <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors duration-300 truncate">{doctor.fullName}</h3>
                            <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 rounded-lg text-xs font-semibold">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                                {doctor.specialty.specialtyName}
                            </div>
                        </div>

                        {/* Bio - Compact */}
                        {doctor.bio && (
                            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-3 mb-3 border border-gray-100">
                                <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
                                    {doctor.bio}
                                </p>
                            </div>
                        )}

                        {/* Consultation Fee & Status - Side by side */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-gradient-to-r from-emerald-100 to-green-100 rounded-lg flex items-center justify-center mr-2">
                                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                </div>
                                <div>
                                    <span className="text-xs text-emerald-700 font-medium block">Phí khám</span>
                                    <span className="font-bold text-emerald-800 text-sm">
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        }).format(doctor.consultationFee)}
                                    </span>
                                </div>
                            </div>
                            <div className={`flex items-center px-3 py-1 rounded-lg text-xs font-semibold ${doctor.isAvailable
                                ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700'
                                : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700'
                                }`}>
                                <div className={`w-2 h-2 rounded-full mr-2 ${doctor.isAvailable ? 'bg-green-500' : 'bg-red-500'
                                    } ${doctor.isAvailable ? 'animate-pulse' : ''}`}></div>
                                {doctor.isAvailable ? 'Sẵn sàng' : 'Bận'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons - Horizontal */}
                <div className="flex gap-3 mt-4">
                    <Link
                        href={`/doctor-detail/${doctor.doctorId}`}
                        className="flex-1 bg-gradient-to-r from-slate-50 to-gray-50 hover:from-blue-50 hover:to-indigo-50 border border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-700 text-center py-2.5 px-4 rounded-lg font-medium transition-all duration-200 text-sm"
                    >
                        Xem chi tiết
                    </Link>
                    {doctor.isAvailable && (
                        <Link
                            href={`/doctors/${doctor.doctorId}/appointment`}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-center py-2.5 px-4 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg text-sm"
                        >
                            Đặt lịch ngay
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

const FeaturedDoctorsSection: React.FC = () => {
    const { doctors, loading, error } = useAllDoctors(1, 8);

    if (loading) {
        return (
            <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-4">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                            </svg>
                            Đội ngũ y tế
                        </div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Bác Sĩ <span className="text-blue-600">Chuyên Nghiệp</span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Đang tải thông tin các bác sĩ chuyên nghiệp...
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
                                <div className="p-6">
                                    <div className="flex items-start gap-6">
                                        <div className="w-20 h-20 bg-gray-200 rounded-xl flex-shrink-0"></div>
                                        <div className="flex-1">
                                            <div className="h-5 bg-gray-200 rounded mb-2 w-3/4"></div>
                                            <div className="h-4 bg-gray-200 rounded mb-3 w-1/2"></div>
                                            <div className="h-4 bg-gray-200 rounded mb-3 w-2/3"></div>
                                            <div className="h-12 bg-gray-200 rounded mb-3"></div>
                                            <div className="flex gap-2">
                                                <div className="flex-1 h-8 bg-gray-200 rounded"></div>
                                                <div className="flex-1 h-8 bg-gray-200 rounded"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto shadow-lg">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-red-800 mb-3">Không thể tải danh sách bác sĩ</h3>
                            <p className="text-red-600 text-sm leading-relaxed">{error}</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (!doctors || doctors.length === 0) {
        return (
            <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Đội Ngũ Bác Sĩ</h2>
                        <p className="text-gray-600">Hiện tại chưa có bác sĩ nào có sẵn.</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-4">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                        </svg>
                        Đội ngũ y tế
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Bác Sĩ <span className="text-blue-600">Chuyên Nghiệp</span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Gặp gỡ đội ngũ bác sĩ giàu kinh nghiệm với chuyên môn cao, luôn sẵn sàng mang đến dịch vụ chăm sóc sức khỏe tốt nhất cho bạn
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-16">
                    {doctors.map((doctor) => (
                        <DoctorCard key={doctor.doctorId} doctor={doctor} />
                    ))}
                </div>

                <div className="text-center">
                    <Link
                        href="/doctor "
                        className="inline-flex items-center px-8 py-4 bg-white border-2 border-blue-200 hover:border-blue-400 rounded-xl text-blue-600 hover:text-blue-700 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 group"
                    >
                        <span>Xem tất cả bác sĩ</span>
                        <svg className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedDoctorsSection;
