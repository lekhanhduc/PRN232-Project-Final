'use client';
import React from 'react';
import { Star, MapPin, Calendar, Clock, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DoctorSearchResponse } from '@/types/doctor';

interface DoctorCardProps {
    doctor: DoctorSearchResponse;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
    const router = useRouter();

    // Check if doctor is available today
    const isAvailableToday = doctor.workSchedules.some(schedule => {
        const today = new Date().toISOString().split('T')[0];
        return schedule.workDate === today && schedule.timeSlots.some(slot => slot.isAvailable);
    });

    // Get next available time
    const getNextAvailableTime = () => {
        const today = new Date().toISOString().split('T')[0];
        const todaySchedule = doctor.workSchedules.find(schedule => schedule.workDate === today);
        if (todaySchedule) {
            const availableSlot = todaySchedule.timeSlots.find(slot => slot.isAvailable);
            return availableSlot ? availableSlot.slotTime : null;
        }
        return null;
    };

    const nextAvailableTime = getNextAvailableTime();

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl">
            <div className="p-8">
                <div className="flex items-start">
                    <div className="flex-shrink-0 mr-5">
                        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                            {doctor.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900">{doctor.fullName}</h2>
                        <p className="text-blue-600 font-semibold text-lg mt-1">{doctor.academicTitle}</p>
                        <p className="text-gray-600 text-sm mt-1">{doctor.specialty.specialtyName}</p>
                        <div className="mt-2 flex items-center">
                            <Star className="h-5 w-5 text-yellow-400 fill-current" />
                            <span className="ml-2 text-gray-800 font-medium">4.8</span>
                            <span className="mx-2 text-gray-400">•</span>
                            <span className="text-gray-500">{doctor.yearsOfExperience} năm kinh nghiệm</span>
                        </div>
                    </div>
                </div>

                <div className="mt-6 border-t border-gray-100 pt-6">
                    <div className="flex items-center text-gray-600 mb-3">
                        <MapPin className="h-5 w-5 mr-2 text-blue-400" />
                        <span className="text-gray-700">{doctor.gender || 'N/A'}</span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-3">
                        <Calendar className="h-5 w-5 mr-2 text-blue-400" />
                        <span className="text-gray-700">{doctor.yearsOfExperience} năm kinh nghiệm</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                        <DollarSign className="h-5 w-5 mr-2 text-green-400" />
                        <span className="text-gray-700">{doctor.consultationFee.toLocaleString('vi-VN')} VNĐ</span>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span
                            className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                                isAvailableToday ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}
                        >
                            {isAvailableToday ? 'Có sẵn hôm nay' : 'Không có sẵn hôm nay'}
                        </span>
                        {nextAvailableTime && (
                            <span className="text-xs text-gray-500 mt-1">
                                Lịch tiếp theo: {nextAvailableTime}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={() => router.push(`/doctor-detail/${doctor.doctorId}`)}
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