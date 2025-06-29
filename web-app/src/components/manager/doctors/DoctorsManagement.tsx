'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { DoctorDetailResponse, DoctorCreationRequest, DoctorUpdateRequest } from '@/types/doctor';
import { SpecialtyDetailResponse } from '@/types/specialty';
import { DoctorFilters } from './DoctorFilters';
import { DoctorTable } from './DoctorTable';
import { DoctorModal } from './DoctorModal';
import { createDoctor, updateDoctor, deleteDoctor } from '@/services/doctorService';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface DoctorsManagementProps {
    doctors: DoctorDetailResponse[];
    specialties: SpecialtyDetailResponse[];
}

export const DoctorsManagement = ({ doctors, specialties }: DoctorsManagementProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState<DoctorDetailResponse | null>(null);

    const departments = ['Tất cả', ...specialties.map(s => s.specialtyName)];

   const filteredDoctors = doctors.filter(doctor => {
        const name = doctor.userName?.toLowerCase() || '';
        const dept = doctor.specialtyName?.toLowerCase() || '';
        const matchesSearch = name.includes(searchTerm.toLowerCase()) || dept.includes(searchTerm.toLowerCase());
        const matchesDepartment =
            selectedDepartment === 'all' || doctor.specialtyName === selectedDepartment;

        return matchesSearch && matchesDepartment;
    });

    const router = useRouter();

    const handleView = (doctor: DoctorDetailResponse) => {
        setSelectedDoctor(doctor);
        setShowModal(true);
    };

    const handleEdit = (doctor: DoctorDetailResponse) => {
        setSelectedDoctor(doctor);
        setShowModal(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Bạn có chắc chắn muốn xóa bác sĩ này?')) {
             try {             
                deleteDoctor(id);
                toast.success('Xóa bác sĩ thành công!');               
                setShowModal(false);
                setSelectedDoctor(null);
                router.refresh();
            } catch (error) {
                toast.error('Đã xảy ra lỗi khi xử lý!');
                console.error(error);
            }
        }
    };

   const handleModalSubmit = async (
        data: DoctorCreationRequest | DoctorUpdateRequest
            ) => {
            try {
                if (selectedDoctor) {
                const updateData: DoctorUpdateRequest = {
                    ...(data as DoctorUpdateRequest)                 
                };
                await updateDoctor(updateData);
                toast.success('Cập nhật bác sĩ thành công!');
                } else {
                await createDoctor(data as DoctorCreationRequest);
                toast.success('Tạo bác sĩ thành công!');
                }

                setShowModal(false);
                setSelectedDoctor(null);
                router.refresh();
            } catch (error) {
                toast.error('Đã xảy ra lỗi khi xử lý!');
                console.error(error);
            }
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
                specialties={specialties}
                onClose={handleModalClose}
                onSubmit={handleModalSubmit}
            />
        </div>
    );
};
