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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {isEditing ? 'Chỉnh sửa Lễ tân' : 'Thêm Lễ tân mới'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                disabled={isEditing}
                                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    errors.email ? 'border-red-500' : 'border-gray-300'
                                } ${isEditing ? 'bg-gray-100' : ''}`}
                                placeholder="Nhập email"
                            />
                        </div>
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                        )}
                    </div>
                 
                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Số điện thoại
                        </label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    errors.phone ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Nhập số điện thoại"
                            />
                        </div>
                        {errors.phone && (
                            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                        )}
                    </div>
                    {/* User Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Trạng thái
                        </label>
                        <select
                            value={formData.userStatus}
                            onChange={(e) => handleInputChange('userStatus', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value={0}>Hoạt động</option>
                            <option value={1}>Không hoạt động</option>
                        </select>
                    </div>

                    {/* Buttons */}
                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            {isEditing ? 'Cập nhật' : 'Thêm mới'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}; 