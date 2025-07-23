'use client';

import { useState } from 'react';
import { Plus, Upload } from 'lucide-react';
import { DoctorCreationRequest, DoctorDetailResponse, DoctorUpdateRequest, Gender } from '@/types/doctor';
import { SpecialtyDetailResponse } from '@/types/specialty';
import { DoctorTable } from './DoctorTable';
import { DoctorModal } from './DoctorModal';
import { createDoctor, deleteDoctor, importDoctorSchedules, updateDoctor } from '@/services/doctorService';
import toast from 'react-hot-toast';
import { useManagerDoctors } from '@/hooks/useManagerDoctors';
import PageNavigation from '@/components/doctors/PageNavigation';
import DoctorFilters from './DoctorFilters';

interface DoctorsManagementProps {
    specialties: SpecialtyDetailResponse[];
}

export const DoctorsManagement = ({ specialties }: DoctorsManagementProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('all');
    const [selectedGender, setSelectedGender] = useState<Gender | undefined>(undefined);
    const [isAvailable, setIsAvailable] = useState<boolean | undefined>(undefined);
    const [showModal, setShowModal] = useState(false);
    const [showScheduleModal, setScheduleModal] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState<DoctorDetailResponse | null>(null);
    const [showUploadModal, setShowUploadModal] = useState(false);

    const {
        doctors,
        currentPage,
        totalPages,
        setCurrentPage,
        searchDoctors
    } = useManagerDoctors();

    const departments = ['Tất cả', ...specialties.map(s => s.specialtyName)];


    useEffect(() => {
        // const params: any = {};
        // if (searchTerm.trim()) params.doctorName = searchTerm.trim();
        // if (selectedDepartment !== 'all') params.specialtyName = selectedDepartment;
        // if (selectedGender) params.gender = selectedGender;
        // if (isAvailable !== undefined) params.isAvailable = isAvailable;
        searchDoctors(getSearchParams());
    }, [searchTerm, selectedDepartment, selectedGender, isAvailable]);

    const getSearchParams = () => {
        const params: any = {};
        if (searchTerm.trim()) params.doctorName = searchTerm.trim();
        if (selectedDepartment !== 'all') params.specialtyName = selectedDepartment;
        if (selectedGender) params.gender = selectedGender;
        if (isAvailable !== undefined) params.isAvailable = isAvailable;
        return params;
    };


    const handleView = (doctor: DoctorDetailResponse) => {
        setSelectedDoctor(doctor);
        setShowModal(true);
    };

    const handleEdit = (doctor: DoctorDetailResponse) => {
        setSelectedDoctor(doctor);
        setShowModal(true);
    };

    const handleSchedule = (doctor: DoctorDetailResponse) => {
        setSelectedDoctor(doctor);
        setScheduleModal(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm('Bạn có chắc chắn muốn xóa bác sĩ này?')) {
            try {
                await deleteDoctor(id);
                toast.success('Xóa bác sĩ thành công!');
                setShowModal(false);
                setSelectedDoctor(null);
                searchDoctors(getSearchParams());
            } catch (error) {
                toast.error('Đã xảy ra lỗi khi xử lý!');
                console.error(error);
            }
        }
    };

    const handleModalSubmit = async (data: DoctorCreationRequest | DoctorUpdateRequest) => {
        try {
            if (selectedDoctor) {
                const updateData: DoctorUpdateRequest = { ...(data as DoctorUpdateRequest) };
                await updateDoctor(updateData);
                toast.success('Cập nhật bác sĩ thành công!');
            } else {
                await createDoctor(data as DoctorCreationRequest);
                toast.success('Tạo bác sĩ thành công!');
            }

            setShowModal(false);
            setSelectedDoctor(null);
            searchDoctors(getSearchParams());
        } catch (error) {
            toast.error('Đã xảy ra lỗi khi xử lý!');
            console.error(error);
        }
    };

    const handleUploadScheduleSubmit = async (file: File) => {
        try {
            const result = await importDoctorSchedules(file);
            toast.success(result.message || 'Tải lên thành công!');
            searchDoctors(getSearchParams());
        } catch (error) {
            toast.error('Tải lên thất bại!');
            console.error(error);
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedDoctor(null);
    };

    const handleScheduleModalClose = () => {
        setScheduleModal(false);
        setSelectedDoctor(null);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Quản lý Bác sĩ</h2>
                <div className="flex space-x-2 ml-auto">
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                    >
                        <Upload className="w-4 h-4" />
                        <span>Tải lên lịch làm việc</span>
                    </button>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Thêm Bác sĩ</span>
                    </button>
                </div>
            </div>

            <DoctorFilters
                searchTerm={searchTerm}
                selectedDepartment={selectedDepartment}
                selectedGender={selectedGender}
                isAvailable={isAvailable}
                departments={departments}
                onSearchChange={setSearchTerm}
                onDepartmentChange={setSelectedDepartment}
                onGenderChange={setSelectedGender}
                onAvailabilityChange={setIsAvailable}
            />

            <DoctorTable
                doctors={doctors}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSchedule={handleSchedule}
            />

            {totalPages > 1 && (
                <PageNavigation
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={handlePageChange}
                />
            )}

            <DoctorModal
                isOpen={showModal}
                doctor={selectedDoctor}
                specialties={specialties}
                onClose={handleModalClose}
                onSubmit={handleModalSubmit}
            />

            <ScheduleModal
                isOpen={showScheduleModal}
                doctor={selectedDoctor}
                onClose={handleScheduleModalClose}
            />

            <UploadScheduleModal
                isOpen={showUploadModal}
                onClose={() => setShowUploadModal(false)}
                onSubmit={handleUploadScheduleSubmit}
            />
        </div>
    );
};
