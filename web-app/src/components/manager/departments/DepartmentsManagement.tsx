'use client'
import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Users, Building2 } from 'lucide-react';

interface Department {
    id: string;
    name: string;
    description: string;
    headDoctor: string;
    totalDoctors: number;
    totalPatients: number;
    status: 'active' | 'inactive';
}

interface DepartmentsManagementProps {
    departments: Department[];
}

export const DepartmentsManagement = ({ departments }: DepartmentsManagementProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

    const filteredDepartments = departments.filter(dept =>
        dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.headDoctor.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    };

    const getStatusText = (status: string) => {
        return status === 'active' ? 'Hoạt động' : 'Không hoạt động';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Quản lý Khoa/Phòng ban</h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>Thêm Khoa</span>
                </button>
            </div>

            {/* Search */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm khoa..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Departments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDepartments.map((department) => (
                    <div key={department.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-blue-100 rounded-full">
                                    <Building2 className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{department.name}</h3>
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(department.status)}`}>
                                        {getStatusText(department.status)}
                                    </span>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setSelectedDepartment(department)}
                                    className="text-green-600 hover:text-green-900"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => {
                                        if (confirm('Bạn có chắc chắn muốn xóa khoa này?')) {
                                            // Handle delete
                                        }
                                    }}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-4">{department.description}</p>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Trưởng khoa:</span>
                                <span className="font-medium text-gray-900">{department.headDoctor}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Số bác sĩ:</span>
                                <div className="flex items-center space-x-1">
                                    <Users className="w-4 h-4 text-gray-400" />
                                    <span className="font-medium text-gray-900">{department.totalDoctors}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Bệnh nhân:</span>
                                <span className="font-medium text-gray-900">{department.totalPatients}</span>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <button className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium">
                                Xem chi tiết
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add/Edit Department Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            {selectedDepartment ? 'Chỉnh sửa Khoa' : 'Thêm Khoa mới'}
                        </h3>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tên khoa</label>
                                <input
                                    type="text"
                                    defaultValue={selectedDepartment?.name || ''}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                                <textarea
                                    defaultValue={selectedDepartment?.description || ''}
                                    rows={3}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Trưởng khoa</label>
                                <input
                                    type="text"
                                    defaultValue={selectedDepartment?.headDoctor || ''}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                                <select 
                                    defaultValue={selectedDepartment?.status || 'active'}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="active">Hoạt động</option>
                                    <option value="inactive">Không hoạt động</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setSelectedDepartment(null);
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                >
                                    {selectedDepartment ? 'Cập nhật' : 'Thêm'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}; 