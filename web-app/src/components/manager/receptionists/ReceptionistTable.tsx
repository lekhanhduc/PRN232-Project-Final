'use client'
import { Eye, Edit, Trash2, User, Mail, Phone, Calendar } from 'lucide-react';
import { ReceptionistManagerResponse } from '@/types/receptionist';

interface ReceptionistTableProps {
    receptionists: ReceptionistManagerResponse[];
    onView: (receptionist: ReceptionistManagerResponse) => void;
    onEdit: (receptionist: ReceptionistManagerResponse) => void;
    onDelete: (receptionist: ReceptionistManagerResponse) => void;
}

export const ReceptionistTable = ({
    receptionists,
    onView,
    onEdit,
    onDelete
}: ReceptionistTableProps) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const generateInitialAvatar = (email: string) => {
        const initial = email.charAt(0).toUpperCase();
        const colors = [
            'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500',
            'bg-indigo-500', 'bg-yellow-500', 'bg-red-500', 'bg-teal-500'
        ];
        const colorIndex = email.charCodeAt(0) % colors.length;
        return { initial, color: colors[colorIndex] };
    };

    const getStatusColor = (userStatus: number) => {
        return userStatus === 0
            ? 'bg-green-100 text-green-800 border-green-200'
            : 'bg-red-100 text-red-800 border-red-200';
    };

    const getStatusText = (userStatus: number) => {
        return userStatus === 0 ? 'Hoạt động' : 'Tạm nghỉ';
    };

    if (receptionists.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy lễ tân</h3>
                <p className="text-gray-500">Không có lễ tân nào phù hợp với tiêu chí tìm kiếm của bạn.</p>
            </div>
        );
    }

    return (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Lễ tân
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Thông tin liên hệ
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Trạng thái
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ngày tạo
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Hành động
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {receptionists.map((receptionist, index) => {
                            const avatarData = generateInitialAvatar(receptionist.email);
                            return (
                                <tr key={receptionist.id} className="hover:bg-gray-50 transition-colors duration-200">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-12 w-12">
                                                <div className={`h-12 w-12 rounded-full ${avatarData.color} flex items-center justify-center text-white font-bold text-lg shadow-sm`}>
                                                    {avatarData.initial}
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 flex items-center space-x-1">
                                                    <Mail className="w-4 h-4" />
                                                    <span>{receptionist.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-2">
                                            <Phone className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm text-gray-900">{receptionist.phone}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(receptionist.userStatus)}`}>
                                            <span className={`w-2 h-2 rounded-full mr-2 ${receptionist.userStatus === 0 ? 'bg-green-500' : 'bg-red-500'
                                                }`}></span>
                                            {getStatusText(receptionist.userStatus)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <div className="text-sm text-gray-900">
                                                {formatDate(receptionist.createdAt)}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="inline-flex items-center space-x-2">
                                            <button
                                                onClick={() => onView(receptionist)}
                                                className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50 transition-colors"
                                                title="Xem chi tiết"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => onEdit(receptionist)}
                                                className="text-yellow-600 hover:text-yellow-900 p-2 rounded-full hover:bg-yellow-50 transition-colors"
                                                title="Chỉnh sửa"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => onDelete(receptionist)}
                                                className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition-colors"
                                                title="Xóa"
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
    );
};
