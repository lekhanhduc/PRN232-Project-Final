'use client';
import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Users, Building2, Loader2 } from 'lucide-react';
import { SpecialtyCreationRequest, SpecialtyCreationResponse, SpecialtyDetailResponse } from '@/types/specialty';
import { PageResponse } from '@/types/pageResponse';
import { ApiResponse } from '@/types/apiResonse';
import { API_URL } from '@/utils/baseUrl';
import toast from 'react-hot-toast';

export const DepartmentsManagement = () => {
    const [specialties, setSpecialties] = useState<SpecialtyDetailResponse[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedSpecialty, setSelectedSpecialty] = useState<SpecialtyDetailResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [creating, setCreating] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize] = useState(10);
    const [errors, setErrors] = useState<{ name?: string; description?: string }>({}); // State cho lỗi validation

    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });

    const fetchSpecialties = async (page: number = 1, keyword: string = '') => {
        try {
            setLoading(true);
            let url = `${API_URL}/api/v1/specialty?page=${page}&size=${pageSize}`;
            if (keyword.trim()) {
                url += `&keyword=${encodeURIComponent(keyword)}`;
            }

            const response = await fetch(url);
            const data: ApiResponse<PageResponse<SpecialtyDetailResponse>> = await response.json();
            if (data.code === 200 && data.result) {
                setSpecialties(data.result.items || []);
                setCurrentPage(data.result.currentPages);
                setTotalPages(data.result.totalPages || 1);
            } else {
                setSpecialties([]);
            }
        } catch (error) {
            console.error('Error fetching specialties:', error);
            setSpecialties([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSpecialties();
    }, []);

    useEffect(() => {
        const delayedSearch = setTimeout(() => {
            fetchSpecialties(1, searchTerm);
        }, 500);
        return () => clearTimeout(delayedSearch);
    }, [searchTerm]);

    const validateForm = () => {
        const newErrors: { name?: string; description?: string } = {};
        if (!formData.name.trim()) newErrors.name = 'Tên chuyên khoa không được để trống';
        if (!formData.description.trim()) newErrors.description = 'Mô tả không được để trống';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (value.trim()) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            setCreating(true);
            const request: SpecialtyCreationRequest = {
                specialtyName: formData.name,
                description: formData.description
            };
            const response = await fetch(`${API_URL}/api/v1/specialty`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(request)
            });
            const data: ApiResponse<SpecialtyCreationResponse> = await response.json();
            if (data.code === 200 && data.result) {
                toast.success('Thêm chuyên khoa thành công!', { duration: 3000 }); // Toast thành công
                setFormData({ name: '', description: '' });
                setShowAddModal(false);
                setSelectedSpecialty(null);
                fetchSpecialties(currentPage, searchTerm);
            } else {
                toast.error('Thêm chuyên khoa thất bại. Vui lòng thử lại!', { duration: 3000 }); // Toast lỗi
            }
        } catch (error) {
            console.error('Error creating specialty:', error);
            toast.error('Đã xảy ra lỗi khi tạo chuyên khoa!', { duration: 3000 }); // Toast lỗi
        } finally {
            setCreating(false);
        }
    };

    const handleEdit = (specialty: SpecialtyDetailResponse) => {
        setSelectedSpecialty(specialty);
        setFormData({ name: specialty.specialtyName, description: specialty.description });
        setShowAddModal(true);
    };

    const handleCloseModal = () => {
        setShowAddModal(false);
        setSelectedSpecialty(null);
        setFormData({ name: '', description: '' });
        setErrors({});
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        fetchSpecialties(page, searchTerm);
    };

    const DeleteById = async (id: number) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa chuyên khoa này?')) return;
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/v1/specialty/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            const data: ApiResponse<null> = await response.json();
            if (data.code === 200) {
                toast.success('Xóa chuyên khoa thành công!', { duration: 3000 });
                fetchSpecialties(currentPage, searchTerm);
            } else {
                toast.error('Xóa chuyên khoa thất bại. Vui lòng thử lại!', { duration: 3000 });
            }
        } catch (error) {
            console.error('Error deleting specialty:', error);
            toast.error('Đã xảy ra lỗi khi xóa chuyên khoa!', { duration: 3000 });
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">Quản lý Chuyên khoa</h1>
                            <p className="text-gray-600 mt-1">Quản lý thông tin các chuyên khoa trong hệ thống</p>
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Thêm Chuyên khoa</span>
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="p-6">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm chuyên khoa..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                    </div>
                </div>
            </div>

            {loading && (
                <div className="flex justify-center items-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-600">Đang tải...</span>
                </div>
            )}

            {!loading && specialties.length > 0 && (
                <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 divide-y divide-x-0 md:divide-y-0 md:divide-x divide-gray-200">
                        {specialties.map((specialty) => (
                            <div key={specialty.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <Building2 className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900">{specialty.specialtyName}</h3>
                                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 border border-green-200">
                                                Hoạt động
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex space-x-1">
                                        <button
                                            onClick={() => handleEdit(specialty)}
                                            className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded-lg transition-colors"
                                            title="Chỉnh sửa"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => DeleteById(specialty.id)}
                                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Xóa"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{specialty.description}</p>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Số bác sĩ:</span>
                                        <div className="flex items-center space-x-1">
                                            <Users className="w-4 h-4 text-gray-400" />
                                            <span className="font-medium text-gray-900">{specialty.doctorNumber || 0}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Bệnh nhân:</span>
                                        <span className="font-medium text-gray-900">{specialty.patientNumber || 0}</span>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <button className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium hover:bg-blue-50 py-2 rounded-lg transition-colors">
                                        Xem chi tiết
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!loading && specialties.length === 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <Building2 className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy chuyên khoa</h3>
                    <p className="text-gray-500">Không có chuyên khoa nào phù hợp với tiêu chí tìm kiếm của bạn.</p>
                </div>
            )}

            {totalPages > 1 && (
                <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-4">
                    <div className="flex justify-center items-center space-x-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                        >
                            Trước
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={`page-${page}`}
                                onClick={() => handlePageChange(page)}
                                className={`px-4 py-2 text-sm border rounded-lg transition-colors ${currentPage === page
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                        >
                            Sau
                        </button>
                    </div>
                </div>
            )}

            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto transform transition-all">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white rounded-t-lg">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {selectedSpecialty ? 'Chỉnh sửa Chuyên khoa' : 'Thêm Chuyên khoa mới'}
                                </h2>
                                <p className="text-gray-600 mt-1">
                                    {selectedSpecialty ? 'Cập nhật thông tin chuyên khoa' : 'Điền thông tin để tạo chuyên khoa mới'}
                                </p>
                            </div>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tên chuyên khoa <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        onBlur={validateForm}
                                        required
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                        placeholder="Nhập tên chuyên khoa..."
                                    />
                                    {errors.name && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                                            <span className="w-4 h-4 text-red-500">⚠</span>
                                            <span>{errors.name}</span>
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mô tả <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        onBlur={validateForm}
                                        rows={4}
                                        required
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                        placeholder="Nhập mô tả chuyên khoa..."
                                    />
                                    {errors.description && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                                            <span className="w-4 h-4 text-red-500">⚠</span>
                                            <span>{errors.description}</span>
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex space-x-4 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    disabled={creating}
                                    className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                                >
                                    {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                                    <span>{selectedSpecialty ? 'Cập nhật thông tin' : 'Tạo chuyên khoa'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};