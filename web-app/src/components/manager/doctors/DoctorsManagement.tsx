'use client';

import { useEffect, useState } from 'react';
import { Plus, Upload } from 'lucide-react';
import { DoctorCreationRequest, DoctorDetailResponse, DoctorUpdateRequest, Gender } from '@/types/doctor';
import { SpecialtyDetailResponse } from '@/types/specialty';
import { DoctorTable } from './DoctorTable';
import { DoctorModal } from './DoctorModal';
import { ScheduleModal } from './ScheduleModal';
import { UploadScheduleModal } from './UploadScheduleModal';
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
        doctors: allDoctors,
        currentPage,
        totalPages,
        setCurrentPage,
        searchDoctors
    } = useManagerDoctors();

    const departments = ['Tất cả', ...specialties.map(s => s.specialtyName)];

    // Frontend filtering
    const filteredDoctors = allDoctors.filter(doctor => {
        // Search term filter (tìm kiếm theo tên, email, phone)
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase().trim();
            const matchName = doctor.fullName?.toLowerCase().includes(searchLower);
            const matchEmail = doctor.email?.toLowerCase().includes(searchLower);
            const matchPhone = doctor.phone?.includes(searchTerm.trim());
            const matchId = doctor.doctorId.toString().includes(searchTerm.trim());

            if (!matchName && !matchEmail && !matchPhone && !matchId) {
                return false;
            }
        }

        // Department filter
        if (selectedDepartment !== 'all') {
            if (doctor.specialty.specialtyName !== selectedDepartment) {
                return false;
            }
        }

        // Gender filter
        if (selectedGender && doctor.gender !== selectedGender) {
            return false;
        }

        // Availability filter
        if (isAvailable !== undefined && doctor.isAvailable !== isAvailable) {
            return false;
        }

        return true;
    });

    useEffect(() => {
        // Load all doctors initially without server-side filtering
        searchDoctors({});
    }, []);

    const getSearchParams = () => {
        return {}; // We'll do filtering on frontend
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
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Quản lý Bác sĩ</h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Quản lý thông tin và lịch làm việc của các bác sĩ
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setShowUploadModal(true)}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                Tải lên lịch làm việc
                            </button>
                            <button
                                onClick={() => setShowModal(true)}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Thêm Bác sĩ
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-6">
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Tổng Bác sĩ</dt>
                                            <dd className="text-2xl font-semibold text-gray-900">{allDoctors.length}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Đang hoạt động</dt>
                                            <dd className="text-2xl font-semibold text-gray-900">
                                                {allDoctors.filter((d: DoctorDetailResponse) => d.isAvailable).length}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Tạm nghỉ</dt>
                                            <dd className="text-2xl font-semibold text-gray-900">
                                                {allDoctors.filter((d: DoctorDetailResponse) => !d.isAvailable).length}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Chuyên khoa</dt>
                                            <dd className="text-2xl font-semibold text-gray-900">{specialties.length}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
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

                    {/* Doctor Table */}
                    <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                        <DoctorTable
                            doctors={filteredDoctors}
                            onView={handleView}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onSchedule={handleSchedule}
                        />
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="bg-white px-4 py-3 border border-gray-200 rounded-lg">
                            <PageNavigation
                                currentPage={currentPage}
                                totalPages={totalPages}
                                setCurrentPage={handlePageChange}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
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