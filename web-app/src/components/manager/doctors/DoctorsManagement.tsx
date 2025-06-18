'use client'
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Doctor } from '@/types/doctor';
import { DoctorFilters } from './DoctorFilters';
import { DoctorTable } from './DoctorTable';
import { DoctorModal } from './DoctorModal';

interface DoctorsManagementProps {
    doctors: Doctor[];
}

export const DoctorsManagement = ({ doctors }: DoctorsManagementProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

    const departments = ['Tất cả', 'Khoa Nội', 'Khoa Ngoại', 'Khoa Nhi', 'Khoa Tim mạch', 'Khoa Thần kinh'];

    const filteredDoctors = doctors.filter(doctor => {
        const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            doctor.department.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDepartment = selectedDepartment === 'all' || doctor.department === selectedDepartment;
        return matchesSearch && matchesDepartment;
    });

    const handleView = (doctor: Doctor) => {
        setSelectedDoctor(doctor);
        setShowModal(true);
    };

    const handleEdit = (doctor: Doctor) => {
        setSelectedDoctor(doctor);
        setShowModal(true);
    };

    const handleDelete = (doctor: Doctor) => {
        if (confirm('Bạn có chắc chắn muốn xóa bác sĩ này?')) {
            // Handle delete
            console.log('Delete doctor:', doctor.id);
        }
    };

    const handleModalSubmit = (data: Partial<Doctor>) => {
        if (selectedDoctor) {
            // Handle update
            console.log('Update doctor:', { ...selectedDoctor, ...data });
        } else {
            // Handle create
            console.log('Create doctor:', data);
        }
        setShowModal(false);
        setSelectedDoctor(null);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedDoctor(null);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Quản lý Bác sĩ</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>Thêm Bác sĩ</span>
                </button>
            </div>

            {/* Filters */}
            <DoctorFilters
                searchTerm={searchTerm}
                selectedDepartment={selectedDepartment}
                departments={departments}
                onSearchChange={setSearchTerm}
                onDepartmentChange={setSelectedDepartment}
            />

            {/* Doctors Table */}
            <DoctorTable
                doctors={filteredDoctors}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {/* Modal */}
            <DoctorModal
                isOpen={showModal}
                doctor={selectedDoctor}
                departments={departments}
                onClose={handleModalClose}
                onSubmit={handleModalSubmit}
            />
        </div>
    );
}; 