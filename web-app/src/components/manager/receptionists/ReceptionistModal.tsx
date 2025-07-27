'use client'
import { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { ReceptionistManagerResponse, CreateReceptionistRequest, UpdateReceptionistRequest } from '@/types/receptionist';

interface ReceptionistModalProps {
    isOpen: boolean;
    receptionist: ReceptionistManagerResponse | null;
    onClose: () => void;
    onSubmit: (data: CreateReceptionistRequest) => void;
}

export const ReceptionistModal = ({
    isOpen,
    receptionist,
    onClose,
    onSubmit
}: ReceptionistModalProps) => {
    const [formData, setFormData] = useState<CreateReceptionistRequest>({
        email: '',
        phone: '',
        userStatus: 0
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const isEditing = !!receptionist;

    useEffect(() => {
        if (receptionist) {
            setFormData({
                email: receptionist.email,
                phone: receptionist.phone,
                userStatus: receptionist.userStatus
            });
        } else {
            setFormData({
                email: '',
                phone: '',
                userStatus: 0
            });
        }
        setErrors({});
    }, [receptionist]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email là bắt buộc';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Số điện thoại là bắt buộc';
        } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Số điện thoại không hợp lệ';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (isEditing) {
            const updateData: CreateReceptionistRequest = {
                email: formData.email,
                phone: formData.phone,
                userStatus: formData.userStatus
            };
            onSubmit(updateData);
        } else {
            onSubmit(formData);
        }
    };

    const handleInputChange = (field: keyof CreateReceptionistRequest, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-auto transform transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white rounded-t-lg">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            {isEditing ? 'Chỉnh sửa Lễ tân' : 'Thêm Lễ tân mới'}
                        </h2>
                        <p className="text-gray-600 mt-1">
                            {isEditing ? 'Cập nhật thông tin lễ tân' : 'Điền thông tin để tạo tài khoản lễ tân mới'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    disabled={isEditing}
                                    className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                        } ${isEditing ? 'bg-gray-50 text-gray-600' : 'bg-white'}`}
                                    placeholder="example@hospital.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                                    <span className="w-4 h-4 text-red-500">⚠</span>
                                    <span>{errors.email}</span>
                                </p>
                            )}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Số điện thoại <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                        }`}
                                    placeholder="0912345678"
                                />
                            </div>
                            {errors.phone && (
                                <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                                    <span className="w-4 h-4 text-red-500">⚠</span>
                                    <span>{errors.phone}</span>
                                </p>
                            )}
                        </div>

                        {/* User Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Trạng thái hoạt động <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <select
                                    value={formData.userStatus}
                                    onChange={(e) => handleInputChange('userStatus', parseInt(e.target.value))}
                                    className="w-full pl-12 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white appearance-none"
                                >
                                    <option value={0}>Hoạt động</option>
                                    <option value={1}>Tạm nghỉ</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex space-x-4 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            {isEditing ? 'Cập nhật thông tin' : 'Tạo tài khoản'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}; 