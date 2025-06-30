'use client'
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Receptionist, CreateReceptionistRequest, UpdateReceptionistRequest } from '@/types/receptionist';
import { receptionistService } from '@/services/receptionistService';
import { ReceptionistFilters } from './ReceptionistFilters';
import { ReceptionistTable } from './ReceptionistTable';
import { ReceptionistModal } from './ReceptionistModal';

export const ReceptionistsManagement = () => {
    const [receptionists, setReceptionists] = useState<Receptionist[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('Tất cả');
    const [showModal, setShowModal] = useState(false);
    const [selectedReceptionist, setSelectedReceptionist] = useState<Receptionist | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReceptionists();
    }, []);

    const fetchReceptionists = async () => {
        try {
            setLoading(true);
            const data = await receptionistService.getAllReceptionists();
            setReceptionists(data);
        } catch (error) {
            console.error('Error fetching receptionists:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredReceptionists = receptionists.filter(receptionist => {
        const matchesSearch = 
            receptionist.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            receptionist.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            receptionist.phone.includes(searchTerm) ||
            receptionist.username.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = 
            selectedStatus === 'Tất cả' ||
            (selectedStatus === 'Hoạt động' && receptionist.isActive) ||
            (selectedStatus === 'Không hoạt động' && !receptionist.isActive);
        
        return matchesSearch && matchesStatus;
    });

    const handleView = (receptionist: Receptionist) => {
        setSelectedReceptionist(receptionist);
        setShowModal(true);
    };

    const handleEdit = (receptionist: Receptionist) => {
        setSelectedReceptionist(receptionist);
        setShowModal(true);
    };

    const handleDelete = async (receptionist: Receptionist) => {
        if (confirm(`Bạn có chắc chắn muốn xóa lễ tân "${receptionist.fullName}"?`)) {
            try {
                await receptionistService.deleteReceptionist(receptionist.userId);
                await fetchReceptionists();
                alert('Xóa lễ tân thành công');
            } catch (error) {
                console.error('Error deleting receptionist:', error);
                alert('Có lỗi xảy ra khi xóa lễ tân');
            }
        }
    };

    const handleModalSubmit = async (data: CreateReceptionistRequest | UpdateReceptionistRequest) => {
        try {
            if (selectedReceptionist) {
                // Update existing receptionist
                await receptionistService.updateReceptionist(selectedReceptionist.userId, data as UpdateReceptionistRequest);
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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Quản lý Lễ tân</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>Thêm Lễ tân</span>
                </button>
            </div>

            {/* Filters */}
            <ReceptionistFilters
                searchTerm={searchTerm}
                selectedStatus={selectedStatus}
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