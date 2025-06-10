'use client'
import React from 'react';
import { DoctorCard } from './DoctorCard';

interface Doctor {
    id: string;
    name: string;
    department: string;
    schedule: {
        weekdays: string;
        saturday?: string;
        sunday?: string;
    };
    status: 'available' | 'busy' | 'off';
    avatar?: string;
}

export const DoctorSchedule = () => {
    const doctors: Doctor[] = [
        {
            id: '1',
            name: 'BS. Trần Thị Mai',
            department: 'Nội khoa',
            schedule: {
                weekdays: '8:00 - 17:00',
                saturday: '8:00 - 12:00'
            },
            status: 'available'
        },
        {
            id: '2',
            name: 'BS. Phạm Văn Đức',
            department: 'Tim mạch',
            schedule: {
                weekdays: '9:00 - 16:00',
                sunday: '9:00 - 13:00'
            },
            status: 'available'
        },
        {
            id: '3',
            name: 'BS. Nguyễn Thị Lan',
            department: 'Ngoại khoa',
            schedule: {
                weekdays: '7:30 - 15:30',
                sunday: '8:00 - 12:00'
            },
            status: 'off'
        },
        {
            id: '4',
            name: 'BS. Lê Minh Tuấn',
            department: 'Da liễu',
            schedule: {
                weekdays: '8:30 - 16:30',
                saturday: '9:00 - 13:00'
            },
            status: 'busy'
        },
        {
            id: '5',
            name: 'BS. Hoàng Thị Hoa',
            department: 'Sản phụ khoa',
            schedule: {
                weekdays: '7:00 - 16:00',
                saturday: '8:00 - 12:00',
                sunday: '8:00 - 11:00'
            },
            status: 'available'
        },
        {
            id: '6',
            name: 'BS. Nguyễn Văn Hùng',
            department: 'Chấn thương chỉnh hình',
            schedule: {
                weekdays: '9:00 - 17:00',
                saturday: '9:00 - 14:00'
            },
            status: 'available'
        }
    ];

    const availableDoctors = doctors.filter(doc => doc.status === 'available').length;
    const busyDoctors = doctors.filter(doc => doc.status === 'busy').length;
    const offDoctors = doctors.filter(doc => doc.status === 'off').length;

    return (
        <div>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Lịch làm việc Bác sĩ</h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{doctors.length}</div>
                        <div className="text-sm text-blue-600">Tổng bác sĩ</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{availableDoctors}</div>
                        <div className="text-sm text-green-600">Có mặt</div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">{busyDoctors}</div>
                        <div className="text-sm text-yellow-600">Bận</div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{offDoctors}</div>
                        <div className="text-sm text-red-600">Nghỉ</div>
                    </div>
                </div>
            </div>

            {/* Doctor Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((doctor) => (
                    <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
            </div>
        </div>
    );
};