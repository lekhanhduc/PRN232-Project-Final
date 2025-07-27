'use client'
import { useState, useEffect } from 'react';
import { Plus, Users, UserCheck, UserX, Clock } from 'lucide-react';
import { ReceptionistManagerResponse, CreateReceptionistRequest, UpdateReceptionistRequest } from '@/types/receptionist';
import { receptionistService } from '@/services/receptionistService';
import { ReceptionistFilters } from './ReceptionistFilters';
import { ReceptionistTable } from './ReceptionistTable';
import { ReceptionistModal } from './ReceptionistModal';

export const ReceptionistsManagement = () => {
    const [allReceptionists, setAllReceptionists] = useState<ReceptionistManagerResponse[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [selectedReceptionist, setSelectedReceptionist] = useState<ReceptionistManagerResponse | null>(null);
    const [loading, setLoading] = useState(true);

    // Frontend filtering
    const filteredReceptionists = allReceptionists.filter(receptionist => {
        // Search term filter (tìm kiếm theo email, phone)
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase().trim();
            const matchEmail = receptionist.email?.toLowerCase().includes(searchLower);
            const matchPhone = receptionist.phone?.includes(searchTerm.trim());
            const matchId = receptionist.id.toString().includes(searchTerm.trim());

            if (!matchEmail && !matchPhone && !matchId) {
                return false;
            }
        }

        // Status filter
        if (selectedStatus !== 'all') {
            if (selectedStatus === 'active' && receptionist.userStatus !== 0) {
                return false;
            }
            if (selectedStatus === 'inactive' && receptionist.userStatus !== 1) {
                return false;
            }
        }

        return true;
    });

    useEffect(() => {
        fetchReceptionists();
    }, []);

    const fetchReceptionists = async () => {
        try {
            setLoading(true);
            const data = await receptionistService.getAllReceptionists();
            if (Array.isArray(data?.result)) {
                setAllReceptionists(data.result);
            } else {
                setAllReceptionists([]);
            }
        } catch (error) {
            console.error('Error fetching receptionists:', error);
            setAllReceptionists([]);
        } finally {
            setLoading(false);
        }
    };

    const handleView = (receptionist: ReceptionistManagerResponse) => {
        setSelectedReceptionist(receptionist);
        setShowModal(true);
    };

    const handleEdit = (receptionist: ReceptionistManagerResponse) => {
        setSelectedReceptionist(receptionist);
        setShowModal(true);
    };

    const handleDelete = async (receptionist: ReceptionistManagerResponse) => {
        if (confirm(`Bạn có chắc chắn muốn xóa lễ tân với email "${receptionist.email}"?`)) {
            try {
                await receptionistService.deleteReceptionist(receptionist.id);
                await fetchReceptionists();
                alert('Xóa lễ tân thành công');
            } catch (error) {
                console.error('Error deleting receptionist:', error);
                alert('Có lỗi xảy ra khi xóa lễ tân');
            }
        }
    };

    const handleModalSubmit = async (data: CreateReceptionistRequest) => {
        try {
            if (selectedReceptionist) {
                // Update existing receptionist
                await receptionistService.updateReceptionist(selectedReceptionist.id, data as CreateReceptionistRequest);
                alert('Cập nhật lễ tân thành công');
            } else {
                // Create new receptionist
                await receptionistService.createReceptionist(data as CreateReceptionistRequest);
                alert('Tạo lễ tân thành công');
            }
            await fetchReceptionists();
            setShowModal(false);
            setSelectedReceptionist(null);
        } catch (error) {
            console.error('Error saving receptionist:', error);
            alert('Có lỗi xảy ra khi lưu thông tin lễ tân');
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedReceptionist(null);
    };

    // Statistics calculations
    const totalReceptionists = allReceptionists.length;
    const activeReceptionists = allReceptionists.filter(r => r.userStatus === 0).length;
    const inactiveReceptionists = allReceptionists.filter(r => r.userStatus === 1).length;
    const todayReceptionists = allReceptionists.filter(r => {
        const today = new Date().toDateString();
        return new Date(r.createdAt).toDateString() === today;
    }).length;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Quản lý Lễ tân</h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Quản lý thông tin và trạng thái hoạt động của lễ tân
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setShowModal(true)}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Thêm Lễ tân
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
                                        <Users className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Tổng số lễ tân
                                            </dt>
                                            <dd className="flex items-baseline">
                                                <div className="text-2xl font-semibold text-gray-900">
                                                    {totalReceptionists}
                                                </div>
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
                                        <UserCheck className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Đang hoạt động
                                            </dt>
                                            <dd className="flex items-baseline">
                                                <div className="text-2xl font-semibold text-green-600">
                                                    {activeReceptionists}
                                                </div>
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
                                        <UserX className="h-6 w-6 text-red-600" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Tạm nghỉ
                                            </dt>
                                            <dd className="flex items-baseline">
                                                <div className="text-2xl font-semibold text-red-600">
                                                    {inactiveReceptionists}
                                                </div>
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
                                        <Clock className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Mới hôm nay
                                            </dt>
                                            <dd className="flex items-baseline">
                                                <div className="text-2xl font-semibold text-purple-600">
                                                    {todayReceptionists}
                                                </div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <ReceptionistFilters
                        searchTerm={searchTerm}
                        selectedStatus={selectedStatus}
                        resultsCount={filteredReceptionists.length}
                        totalCount={totalReceptionists}
                        onSearchChange={setSearchTerm}
                        onStatusChange={setSelectedStatus}
                    />

                    {/* Receptionists Table */}
                    <ReceptionistTable
                        receptionists={filteredReceptionists}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>
            </div>

            {/* Modal */}
            <ReceptionistModal
                isOpen={showModal}
                receptionist={selectedReceptionist}
                onClose={handleModalClose}
                onSubmit={handleModalSubmit}
            />
        </div>
    );
}; 