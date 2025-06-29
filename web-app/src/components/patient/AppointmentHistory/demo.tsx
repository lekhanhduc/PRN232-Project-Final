'use client';

import React from 'react';
import AppointmentHistory from './AppointmentHistory';

// Mock data cho demo
const mockAppointments = [
    {
        appointmentId: 1,
        appointmentNumber: "APT001",
        doctor: {
            doctorId: 1,
            fullName: "BS. Nguyễn Văn A",
            specialty: "Nội khoa",
            licenseNumber: "12345",
            degree: "Bác sĩ",
            yearsOfExperience: 10,
            consultationFee: 200000,
            bio: "Bác sĩ có kinh nghiệm 10 năm trong lĩnh vực nội khoa",
            gender: "Nam",
            isAvailable: true
        },
        appointmentDate: "2025-01-15",
        appointmentTime: "09:00",
        status: "confirmed" as const,
        totalFee: 200000,
        reasonForVisit: "Đau đầu, chóng mặt, mệt mỏi",
        canCancel: true,
        canReschedule: true
    },
    {
        appointmentId: 2,
        appointmentNumber: "APT002",
        doctor: {
            doctorId: 2,
            fullName: "BS. Trần Thị B",
            specialty: "Tim mạch",
            licenseNumber: "67890",
            degree: "Bác sĩ chuyên khoa",
            yearsOfExperience: 15,
            consultationFee: 300000,
            bio: "Chuyên gia tim mạch với 15 năm kinh nghiệm",
            gender: "Nữ",
            isAvailable: true
        },
        appointmentDate: "2025-01-20",
        appointmentTime: "14:00",
        status: "pending" as const,
        totalFee: 300000,
        reasonForVisit: "Đau ngực, khó thở",
        canCancel: true,
        canReschedule: true
    },
    {
        appointmentId: 3,
        appointmentNumber: "APT003",
        doctor: {
            doctorId: 3,
            fullName: "BS. Lê Văn C",
            specialty: "Ngoại khoa",
            licenseNumber: "11111",
            degree: "Bác sĩ",
            yearsOfExperience: 8,
            consultationFee: 250000,
            bio: "Bác sĩ ngoại khoa chuyên về phẫu thuật",
            gender: "Nam",
            isAvailable: true
        },
        appointmentDate: "2024-12-10",
        appointmentTime: "10:30",
        status: "completed" as const,
        totalFee: 250000,
        reasonForVisit: "Khám sau phẫu thuật",
        canCancel: false,
        canReschedule: false
    },
    {
        appointmentId: 4,
        appointmentNumber: "APT004",
        doctor: {
            doctorId: 4,
            fullName: "BS. Phạm Thị D",
            specialty: "Da liễu",
            licenseNumber: "22222",
            degree: "Bác sĩ chuyên khoa",
            yearsOfExperience: 12,
            consultationFee: 180000,
            bio: "Chuyên gia da liễu với nhiều năm kinh nghiệm",
            gender: "Nữ",
            isAvailable: true
        },
        appointmentDate: "2024-11-25",
        appointmentTime: "16:00",
        status: "cancelled" as const,
        totalFee: 180000,
        reasonForVisit: "Nổi mẩn đỏ, ngứa",
        canCancel: false,
        canReschedule: false
    }
];

const AppointmentHistoryDemo: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Demo - Lịch sử cuộc hẹn
                    </h1>
                    <p className="text-gray-600">
                        Đây là demo cho module lịch sử cuộc hẹn của bệnh nhân.
                        Các chức năng bao gồm: xem danh sách, lọc, tìm kiếm, hủy và đổi lịch hẹn.
                    </p>
                </div>

                <AppointmentHistory />
            </div>
        </div>
    );
};

export default AppointmentHistoryDemo; 