'use client';

import React, { useState } from 'react';
import { User, Phone, Shield, Edit, Save, X, Camera, Lock, Loader2, AlertCircle, MapPin, Calendar, Mail } from 'lucide-react';
import { PatientDetailRequest, Gender } from '@/types/user';
import Toast from '@/components/ui/Toast';
import { usePatientProfile } from '@/hooks/usePatientProfile';
import TwoFactorAuth from '@/components/profile/TwoFactorAuth';
import ChangePassword from '@/components/profile/ChangePassword';
import { patientService } from '@/services/patientService';



const PatientProfile: React.FC = () => {
    const { patient, loading, saving, updateProfile, refreshProfile } = usePatientProfile();
    const [activeTab, setActiveTab] = useState<'profile' | '2fa' | 'password'>('profile');
    const [editingProfile, setEditingProfile] = useState(false);
    const [editForm, setEditForm] = useState<PatientDetailRequest>({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        dob: '',
        gender: Gender.Male,
        address: ''
    });
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    // Toast state
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' | 'info' });

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    // Cập nhật editForm khi patient data thay đổi
    React.useEffect(() => {
        if (patient) {
            setEditForm({
                firstName: patient.firstName || '',
                lastName: patient.lastName || '',
                phone: patient.phone || '',
                email: patient.email || '',
                dob: patient.dob || '',
                gender: patient.gender ?? Gender.Male,
                address: patient.address || ''
            });
        }
    }, [patient]);

    // Hàm định dạng ngày
    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    // Hàm lấy văn bản giới tính
    const getGenderText = (gender?: Gender): string => {
        switch (gender) {
            case Gender.Male:
                return 'Nam';
            case Gender.Female:
                return 'Nữ';
            case Gender.Other:
                return 'Khác';
            default:
                return 'Không xác định';
        }
    };

    // Xử lý chỉnh sửa hồ sơ
    const handleEditProfile = () => {
        if (patient) {
            setEditForm({
                firstName: patient.firstName || '',
                lastName: patient.lastName || '',
                phone: patient.phone || '',
                email: patient.email || '',
                dob: patient.dob || '',
                gender: patient.gender ?? Gender.Male,
                address: patient.address || ''
            });
            setEditingProfile(true);
        }
    };

    const handleCancelEdit = () => {
        if (patient) {
            setEditForm({
                firstName: patient.firstName || '',
                lastName: patient.lastName || '',
                phone: patient.phone || '',
                email: patient.email || '',
                dob: patient.dob || '',
                gender: patient.gender ?? Gender.Male,
                address: patient.address || ''
            });
        }
        setEditingProfile(false);
    };

    const handleSaveProfile = async () => {
        const success = await updateProfile(editForm);
        if (success) {
            setEditingProfile(false);
            showToast('Cập nhật thông tin thành công!');
        } else {
            showToast('Không thể cập nhật thông tin', 'error');
        }
    };

    // Xử lý thay đổi input
    const handleInputChange = (field: keyof PatientDetailRequest, value: string | Gender) => {
        setEditForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // Xử lý upload avatar
    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Kiểm tra loại file
            if (!file.type.startsWith('image/')) {
                showToast('Vui lòng chọn file ảnh!', 'error');
                return;
            }

            // Kiểm tra kích thước file (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showToast('Kích thước ảnh không được vượt quá 5MB!', 'error');
                return;
            }

            // Tạo preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);

            // Upload avatar (giả lập - bạn có thể thay thế bằng API thực tế)
            uploadAvatar(file);
        }
    };

    const uploadAvatar = async (file: File) => {
        try {
            setUploadingAvatar(true);

            // Upload avatar qua API
            const response = await patientService.uploadAvatar(file);

            if (response.code === 200 && response.result) {
                showToast('Cập nhật ảnh đại diện thành công!');
                // Refresh profile để lấy avatar mới
                await refreshProfile();
                setAvatarPreview(null); // Clear preview sau khi upload thành công
            } else {
                throw new Error(response.message || 'Upload failed');
            }
        } catch (error) {
            console.error('Error uploading avatar:', error);
            showToast('Không thể cập nhật ảnh đại diện', 'error');
            setAvatarPreview(null);
        } finally {
            setUploadingAvatar(false);
        }
    };



    const tabs = [
        { id: 'profile', label: 'Thông tin cá nhân', icon: User },
        { id: '2fa', label: 'Bảo mật', icon: Shield },
        { id: 'password', label: 'Đổi mật khẩu', icon: Lock },
    ];

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Đang tải thông tin hồ sơ...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (!patient) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Không thể tải thông tin hồ sơ</p>
                    <button
                        onClick={refreshProfile}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Toast {...toast} onClose={() => setToast({ ...toast, show: false })} />

            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="flex gap-8">
                    {/* Sidebar */}
                    <div className="w-72 flex-shrink-0">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6 bg-gray-900 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-white mb-1">Cài đặt tài khoản</h3>
                                <p className="text-sm text-gray-300">Quản lý thông tin và bảo mật</p>
                            </div>
                            <nav className="p-4">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id as any)}
                                            className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 mb-2 group ${activeTab === tab.id
                                                ? 'bg-gray-900 text-white shadow-md'
                                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                }`}
                                        >
                                            <Icon className={`w-5 h-5 mr-4 transition-colors duration-200 ${activeTab === tab.id ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`} />
                                            <span className="flex-1 text-left">{tab.label}</span>
                                            {activeTab === tab.id && (
                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                            )}
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            {/* Profile Tab */}
                            {activeTab === 'profile' && (
                                <div className="p-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-gray-200">
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900 mb-1">Thông tin cá nhân</h2>
                                            <p className="text-gray-600 text-sm">Cập nhật thông tin cá nhân của bạn</p>
                                        </div>
                                        <div className="mt-4 sm:mt-0">
                                            {!editingProfile ? (
                                                <button
                                                    onClick={handleEditProfile}
                                                    className="inline-flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors duration-200"
                                                >
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Chỉnh sửa
                                                </button>
                                            ) : (
                                                <div className="flex space-x-3">
                                                    <button
                                                        onClick={handleCancelEdit}
                                                        className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors duration-200"
                                                    >
                                                        <X className="w-4 h-4 mr-2" />
                                                        Hủy
                                                    </button>
                                                    <button
                                                        onClick={handleSaveProfile}
                                                        disabled={saving}
                                                        className="inline-flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                                    >
                                                        {saving ? (
                                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                        ) : (
                                                            <Save className="w-4 h-4 mr-2" />
                                                        )}
                                                        {saving ? 'Đang lưu...' : 'Lưu'}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Avatar Section */}
                                    <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-8 mb-8 pb-8 border-b border-gray-200">
                                        <div className="relative group">
                                            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 shadow-md">
                                                {avatarPreview ? (
                                                    <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                                                ) : patient.avatar ? (
                                                    <img src={patient.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <User className="w-12 h-12 text-gray-400" />
                                                    </div>
                                                )}
                                                {uploadingAvatar && (
                                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
                                                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Camera button */}
                                            <div className="absolute bottom-0 right-0">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleAvatarChange}
                                                    className="hidden"
                                                    id="avatar-upload"
                                                    disabled={uploadingAvatar}
                                                />
                                                <label
                                                    htmlFor="avatar-upload"
                                                    className={`w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white shadow-md cursor-pointer transition-all duration-200 hover:bg-gray-800 ${uploadingAvatar ? 'opacity-50 cursor-not-allowed' : ''
                                                        }`}
                                                >
                                                    <Camera className="w-4 h-4" />
                                                </label>
                                            </div>
                                        </div>

                                        <div className="flex-1 text-center sm:text-left">
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                {patient.firstName} {patient.lastName}
                                            </h3>
                                            <div className="space-y-1">
                                                <p className="text-gray-600 flex items-center justify-center sm:justify-start text-sm">
                                                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                                                    {patient.phone || 'Chưa cập nhật'}
                                                </p>
                                                <p className="text-gray-600 flex items-center justify-center sm:justify-start text-sm">
                                                    <User className="w-4 h-4 mr-2 text-gray-500" />
                                                    {getGenderText(patient.gender)}
                                                </p>
                                                {patient.address && (
                                                    <p className="text-gray-600 flex items-start justify-center sm:justify-start text-sm">
                                                        <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-500" />
                                                        <span className="max-w-xs">{patient.address}</span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Form Fields */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <User className="w-4 h-4 inline mr-2 text-gray-500" />
                                                Họ
                                            </label>
                                            {editingProfile ? (
                                                <input
                                                    type="text"
                                                    value={editForm.firstName || ''}
                                                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                                                    className="w-full px-3 py-2 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:bg-white transition-all duration-200"
                                                    placeholder="Nhập họ của bạn"
                                                />
                                            ) : (
                                                <div className="px-3 py-2 bg-gray-50 rounded-md">
                                                    <p className="text-gray-900">{patient.firstName || 'Chưa cập nhật'}</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <User className="w-4 h-4 inline mr-2 text-gray-500" />
                                                Tên
                                            </label>
                                            {editingProfile ? (
                                                <input
                                                    type="text"
                                                    value={editForm.lastName || ''}
                                                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                                                    className="w-full px-3 py-2 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:bg-white transition-all duration-200"
                                                    placeholder="Nhập tên của bạn"
                                                />
                                            ) : (
                                                <div className="px-3 py-2 bg-gray-50 rounded-md">
                                                    <p className="text-gray-900">{patient.lastName || 'Chưa cập nhật'}</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Phone className="w-4 h-4 inline mr-2 text-gray-500" />
                                                Số điện thoại
                                            </label>
                                            {editingProfile ? (
                                                <input
                                                    type="tel"
                                                    value={editForm.phone || ''}
                                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                                    className="w-full px-3 py-2 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:bg-white transition-all duration-200"
                                                    placeholder="Nhập số điện thoại"
                                                />
                                            ) : (
                                                <div className="px-3 py-2 bg-gray-50 rounded-md">
                                                    <p className="text-gray-900">{patient.phone || 'Chưa cập nhật'}</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Mail className="w-4 h-4 inline mr-2 text-gray-500" />
                                                Email
                                            </label>
                                            {editingProfile ? (
                                                <input
                                                    type="email"
                                                    value={editForm.email || ''}
                                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                                    className="w-full px-3 py-2 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:bg-white transition-all duration-200"
                                                    placeholder="Nhập email"
                                                />
                                            ) : (
                                                <div className="px-3 py-2 bg-gray-50 rounded-md">
                                                    <p className="text-gray-900">{patient.email || 'Chưa cập nhật'}</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Calendar className="w-4 h-4 inline mr-2 text-gray-500" />
                                                Ngày sinh
                                            </label>
                                            {editingProfile ? (
                                                <input
                                                    type="date"
                                                    value={editForm.dob}
                                                    onChange={(e) => handleInputChange('dob', e.target.value)}
                                                    className="w-full px-3 py-2 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:bg-white transition-all duration-200"
                                                />
                                            ) : (
                                                <div className="px-3 py-2 bg-gray-50 rounded-md">
                                                    <p className="text-gray-900">{formatDate(patient.dob)}</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <User className="w-4 h-4 inline mr-2 text-gray-500" />
                                                Giới tính
                                            </label>
                                            {editingProfile ? (
                                                <select
                                                    value={editForm.gender ?? Gender.Male}
                                                    onChange={(e) => handleInputChange('gender', parseInt(e.target.value))}
                                                    className="w-full px-3 py-2 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:bg-white transition-all duration-200"
                                                >
                                                    <option value={Gender.Male}>Nam</option>
                                                    <option value={Gender.Female}>Nữ</option>
                                                    <option value={Gender.Other}>Khác</option>
                                                </select>
                                            ) : (
                                                <div className="px-3 py-2 bg-gray-50 rounded-md">
                                                    <p className="text-gray-900">{getGenderText(patient.gender)}</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="md:col-span-2 lg:col-span-3 space-y-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <MapPin className="w-4 h-4 inline mr-2 text-gray-500" />
                                                Địa chỉ
                                            </label>
                                            {editingProfile ? (
                                                <textarea
                                                    value={editForm.address || ''}
                                                    onChange={(e) => handleInputChange('address', e.target.value)}
                                                    rows={3}
                                                    className="w-full px-3 py-2 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:bg-white transition-all duration-200 resize-none"
                                                    placeholder="Nhập địa chỉ của bạn"
                                                />
                                            ) : (
                                                <div className="px-3 py-2 bg-gray-50 rounded-md min-h-[80px]">
                                                    <p className="text-gray-900">{patient.address || 'Chưa cập nhật'}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 2FA Tab */}
                            {activeTab === '2fa' && (
                                <TwoFactorAuth
                                    onShowToast={showToast}
                                    userEmail={patient?.email || patient?.phone || 'user@example.com'}
                                    is2FAEnabled={patient?.enable2FA || false}
                                />
                            )}

                            {/* Password Tab */}
                            {activeTab === 'password' && (
                                <ChangePassword onShowToast={showToast} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientProfile;