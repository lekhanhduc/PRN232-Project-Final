'use client'
import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Shield, User, UserCheck, Building2 } from 'lucide-react';

interface SystemUser {
    id: string;
    username: string;
    email: string;
    fullName: string;
    role: 'admin' | 'manager' | 'doctor' | 'receptionist' | 'patient';
    department?: string;
    status: 'active' | 'inactive';
    lastLogin?: string;
    createdAt: string;
}

interface UsersManagementProps {
    users: SystemUser[];
}

export const UsersManagement = ({ users }: UsersManagementProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);

    const roleOptions = [
        { value: 'all', label: 'Tất cả vai trò' },
        { value: 'admin', label: 'Quản trị viên' },
        { value: 'manager', label: 'Quản lý' },
        { value: 'doctor', label: 'Bác sĩ' },
        { value: 'receptionist', label: 'Lễ tân' },
        { value: 'patient', label: 'Bệnh nhân' }
    ];

    const statusOptions = [
        { value: 'all', label: 'Tất cả trạng thái' },
        { value: 'active', label: 'Hoạt động' },
        { value: 'inactive', label: 'Không hoạt động' }
    ];

    const filteredUsers = users.filter(user => {
        const matchesSearch = 
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.fullName.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

        return matchesSearch && matchesRole && matchesStatus;
    });

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin':
                return 'bg-red-100 text-red-800';
            case 'manager':
                return 'bg-purple-100 text-purple-800';
            case 'doctor':
                return 'bg-blue-100 text-blue-800';
            case 'receptionist':
                return 'bg-green-100 text-green-800';
            case 'patient':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getRoleText = (role: string) => {
        switch (role) {
            case 'admin':
                return 'Quản trị viên';
            case 'manager':
                return 'Quản lý';
            case 'doctor':
                return 'Bác sĩ';
            case 'receptionist':
                return 'Lễ tân';
            case 'patient':
                return 'Bệnh nhân';
            default:
                return 'Không xác định';
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'admin':
                return Shield;
            case 'manager':
                return UserCheck;
            case 'doctor':
                return UserCheck;
            case 'receptionist':
                return Building2;
            case 'patient':
                return User;
            default:
                return User;
        }
    };

    const getStatusColor = (status: string) => {
        return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    };

    const getStatusText = (status: string) => {
        return status === 'active' ? 'Hoạt động' : 'Không hoạt động';
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Quản lý Người dùng</h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>Thêm người dùng</span>
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm người dùng..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {roleOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                        Xuất danh sách
                    </button>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Người dùng
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Vai trò
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Khoa/Phòng ban
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Trạng thái
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Đăng nhập cuối
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map((user) => {
                                const RoleIcon = getRoleIcon(user.role);
                                return (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0">
                                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                        <RoleIcon className="w-5 h-5 text-gray-500" />
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                    <div className="text-sm text-gray-500">@{user.username}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                                                {getRoleText(user.role)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {user.department || 'Không có'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                                                {getStatusText(user.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {user.lastLogin ? formatDate(user.lastLogin) : 'Chưa đăng nhập'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => setSelectedUser(user)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    Xem
                                                </button>
                                                <button
                                                    onClick={() => setSelectedUser(user)}
                                                    className="text-green-600 hover:text-green-900"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
                                                            // Handle delete
                                                        }
                                                    }}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-sm border p-4">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-full">
                            <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Tổng người dùng</p>
                            <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-4">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-full">
                            <Shield className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Quản trị viên</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {users.filter(u => u.role === 'admin').length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-4">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-full">
                            <UserCheck className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Bác sĩ</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {users.filter(u => u.role === 'doctor').length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-4">
                    <div className="flex items-center">
                        <div className="p-2 bg-orange-100 rounded-full">
                            <Building2 className="w-6 h-6 text-orange-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Lễ tân</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {users.filter(u => u.role === 'receptionist').length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add/Edit User Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            {selectedUser ? 'Chỉnh sửa Người dùng' : 'Thêm Người dùng mới'}
                        </h3>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tên đầy đủ</label>
                                <input
                                    type="text"
                                    defaultValue={selectedUser?.fullName || ''}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tên đăng nhập</label>
                                <input
                                    type="text"
                                    defaultValue={selectedUser?.username || ''}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    defaultValue={selectedUser?.email || ''}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Vai trò</label>
                                <select 
                                    defaultValue={selectedUser?.role || 'patient'}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {roleOptions.slice(1).map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                                <select 
                                    defaultValue={selectedUser?.status || 'active'}
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
                                        setSelectedUser(null);
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                >
                                    {selectedUser ? 'Cập nhật' : 'Thêm'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}; 