'use client';

import React, { useState, useEffect } from 'react';
import { User, Phone, Shield, Edit, Save, X, Camera, Lock, Loader2, AlertCircle, MapPin, Calendar, Mail, Stethoscope, Award } from 'lucide-react';
import { PatientDetailRequest, Gender } from '@/types/user';
import Toast from '@/components/ui/Toast';
import { usePatientProfile } from '@/hooks/usePatientProfile';
import TwoFactorAuth from '@/components/profile/TwoFactorAuth';
import ChangePassword from '@/components/profile/ChangePassword';
import { API_URL } from '@/utils/baseUrl';
import { fetchInterceptor } from '@/utils/interceptor';
import { tokenStorage } from '@/utils/tokenStorage';

interface ProfileResponse {
    userType: 'PATIENT' | 'DOCTOR';
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    dob?: string;
    gender?: Gender;
    address?: string;
    enable2FA?: boolean;
    avatar?: string;
    // For DOCTOR  
    doctorId?: number;
    fullName?: string;
    specialty?: {
        specialtyId: number;
        specialtyName: string;
        description: string;
    };
    licenseNumber?: string;
    degree?: string;
    yearsOfExperience?: number;
    consultationFee?: number;
    bio?: string;
    isAvailable?: boolean;
}

const getUnifiedProfile = async (): Promise<ProfileResponse | null> => {
    try {
        const response = await fetchInterceptor(`${API_URL}/api/v1/patients`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        if (data.code === 200 && data.result) {
            if (data.result.items && data.result.items.length > 0) {
                const doctorData = data.result.items[0];
                return {
                    userType: 'DOCTOR',
                    ...doctorData
                };
            }
            else if (data.result.userType) {
                return data.result;
            }
        }
        return null;
    } catch (error) {
        console.error('Error fetching unified profile:', error);
        return null;
    }
};

const PatientProfile: React.FC = () => {
    const { patient, loading: patientLoading, saving, updateProfile, refreshProfile } = usePatientProfile();
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

    // New states for unified profile
    const [userType, setUserType] = useState<'PATIENT' | 'DOCTOR' | null>(null);
    const [profileData, setProfileData] = useState<ProfileResponse | null>(null);
    const [loading, setLoading] = useState(true);

    // Doctor edit form states
    const [editingDoctorProfile, setEditingDoctorProfile] = useState(false);
    const [doctorEditForm, setDoctorEditForm] = useState({
        fullName: '',
        phone: '',
        bio: ''
    });

    const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' | 'info' });

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const profileResponse = await getUnifiedProfile();
                if (!profileResponse) {
                    setLoading(false);
                    return;
                }

                setUserType(profileResponse.userType);
                setProfileData(profileResponse);

                if (profileResponse.userType === 'DOCTOR') {
                    setDoctorEditForm({
                        fullName: profileResponse.fullName || '',
                        phone: profileResponse.phone || '',
                        bio: profileResponse.bio || ''
                    });
                }
            } catch (error) {
                console.error('Error loading profile:', error);
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

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

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const getGenderText = (gender?: Gender | string): string => {
        if (typeof gender === 'string') {
            switch (gender.toUpperCase()) {
                case 'MALE':
                    return 'Nam';
                case 'FEMALE':
                    return 'Nữ';
                case 'OTHER':
                    return 'Khác';
                default:
                    return 'Không xác định';
            }
        } else {
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
        }
    };

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

    const handleInputChange = (field: keyof PatientDetailRequest, value: string | Gender) => {
        setEditForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                showToast('Vui lòng chọn file ảnh!', 'error');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                showToast('Kích thước ảnh không được vượt quá 5MB!', 'error');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);

            uploadAvatar(file);
        }
    };

    const uploadAvatar = async (file: File) => {
        try {
            setUploadingAvatar(true);

            const formData = new FormData();
            formData.append('file', file);

            const token = tokenStorage.getAccessToken();

            const response = await fetch(`${API_URL}/api/v1/patients/upload-avatar`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData
            });

            const data = await response.json();
            if (data.code === 200) {
                if (userType === 'PATIENT') {
                    await refreshProfile();
                } else if (userType === 'DOCTOR') {
                    const updatedProfile = await getUnifiedProfile();
                    if (updatedProfile) {
                        setProfileData(updatedProfile);
                    }
                }
                setAvatarPreview(null);
                showToast('Cập nhật ảnh đại diện thành công!');
            } else {
                throw new Error(data.message || 'Upload failed');
            }
        } catch (error) {
            console.error('Error uploading avatar:', error);
            showToast('Không thể cập nhật ảnh đại diện', 'error');
            setAvatarPreview(null);
        } finally {
            setUploadingAvatar(false);
        }
    };

    // Doctor profile functions
    const handleEditDoctorProfile = () => {
        if (profileData) {
            setDoctorEditForm({
                fullName: profileData.fullName || '',
                phone: profileData.phone || '',
                bio: profileData.bio || ''
            });
            setEditingDoctorProfile(true);
        }
    };

    const handleCancelDoctorEdit = () => {
        if (profileData) {
            setDoctorEditForm({
                fullName: profileData.fullName || '',
                phone: profileData.phone || '',
                bio: profileData.bio || ''
            });
        }
        setEditingDoctorProfile(false);
    };

    const handleSaveDoctorProfile = async () => {
        try {
            const response = await fetchInterceptor(`${API_URL}/api/v1/doctors`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    doctorId: profileData?.doctorId,
                    fullName: doctorEditForm.fullName,
                    phone: doctorEditForm.phone,
                    bio: doctorEditForm.bio
                })
            });

            const data = await response.json();
            if (data.code === 200) {
                // Update local profile data
                setProfileData(prev => prev ? {
                    ...prev,
                    fullName: doctorEditForm.fullName,
                    phone: doctorEditForm.phone,
                    bio: doctorEditForm.bio
                } : null);
                setEditingDoctorProfile(false);
                showToast('Cập nhật thông tin thành công!');
            } else {
                showToast('Có lỗi xảy ra khi cập nhật thông tin!', 'error');
            }
        } catch (error) {
            console.error('Error updating doctor profile:', error);
            showToast('Có lỗi xảy ra khi cập nhật thông tin!', 'error');
        }
    };

    const handleDoctorInputChange = (field: string, value: string) => {
        setDoctorEditForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const tabs = [
        { id: 'profile', label: 'Thông tin cá nhân', icon: User },
        { id: '2fa', label: 'Bảo mật', icon: Shield },
        { id: 'password', label: 'Đổi mật khẩu', icon: Lock },
    ];

    if (loading || (userType === 'PATIENT' && patientLoading)) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Đang tải thông tin hồ sơ...</p>
                </div>
            </div>
        );
    }

    if ((userType === 'PATIENT' && !patient) || (userType === 'DOCTOR' && !profileData)) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Không thể tải thông tin hồ sơ</p>
                    <button
                        onClick={() => window.location.reload()}
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
                                            {userType === 'PATIENT' && !editingProfile ? (
                                                <button
                                                    onClick={handleEditProfile}
                                                    className="inline-flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors duration-200"
                                                >
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Chỉnh sửa
                                                </button>
                                            ) : userType === 'PATIENT' && editingProfile ? (
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
                                            ) : userType === 'DOCTOR' && !editingDoctorProfile ? (
                                                <button
                                                    onClick={handleEditDoctorProfile}
                                                    className="inline-flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors duration-200"
                                                >
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Chỉnh sửa
                                                </button>
                                            ) : userType === 'DOCTOR' && editingDoctorProfile ? (
                                                <div className="flex space-x-3">
                                                    <button
                                                        onClick={handleCancelDoctorEdit}
                                                        className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors duration-200"
                                                    >
                                                        <X className="w-4 h-4 mr-2" />
                                                        Hủy
                                                    </button>
                                                    <button
                                                        onClick={handleSaveDoctorProfile}
                                                        className="inline-flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors duration-200"
                                                    >
                                                        <Save className="w-4 h-4 mr-2" />
                                                        Lưu
                                                    </button>
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>

                                    {/* Avatar Section */}
                                    <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-8 mb-8 pb-8 border-b border-gray-200">
                                        <div className="relative group">
                                            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 shadow-md">
                                                {avatarPreview ? (
                                                    <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                                                ) : (userType === 'PATIENT' && patient?.avatar) ? (
                                                    <img src={patient.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                                ) : (userType === 'DOCTOR' && profileData?.avatar) ? (
                                                    <img src={profileData.avatar} alt="Avatar" className="w-full h-full object-cover" />
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
                                                {userType === 'PATIENT' ?
                                                    `${patient?.firstName || ''} ${patient?.lastName || ''}` :
                                                    profileData?.fullName || ''
                                                }
                                            </h3>
                                            <div className="space-y-1">
                                                <p className="text-gray-600 flex items-center justify-center sm:justify-start text-sm">
                                                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                                                    {userType === 'PATIENT' ?
                                                        (patient?.phone || 'Chưa cập nhật') :
                                                        (profileData?.phone || 'Chưa cập nhật')
                                                    }
                                                </p>
                                                <p className="text-gray-600 flex items-center justify-center sm:justify-start text-sm">
                                                    {userType === 'PATIENT' ? (
                                                        <>
                                                            <User className="w-4 h-4 mr-2 text-gray-500" />
                                                            {getGenderText(patient?.gender)}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Stethoscope className="w-4 h-4 mr-2 text-gray-500" />
                                                            {profileData?.specialty?.specialtyName || 'Chưa xác định'}
                                                        </>
                                                    )}
                                                </p>
                                                {userType === 'PATIENT' && patient?.address && (
                                                    <p className="text-gray-600 flex items-start justify-center sm:justify-start text-sm">
                                                        <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-500" />
                                                        <span className="max-w-xs">{patient.address}</span>
                                                    </p>
                                                )}
                                                {userType === 'DOCTOR' && (
                                                    <p className="text-gray-600 flex items-center justify-center sm:justify-start text-sm">
                                                        <Award className="w-4 h-4 mr-2 text-gray-500" />
                                                        {profileData?.yearsOfExperience || 0} năm kinh nghiệm
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Profile Form Fields */}
                                    {userType === 'PATIENT' ? (
                                        // Patient Profile Form
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
                                                        <p className="text-gray-900">{patient?.firstName || 'Chưa cập nhật'}</p>
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
                                                        <p className="text-gray-900">{patient?.lastName || 'Chưa cập nhật'}</p>
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
                                                        <p className="text-gray-900">{patient?.phone || 'Chưa cập nhật'}</p>
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
                                                        <p className="text-gray-900">{patient?.email || 'Chưa cập nhật'}</p>
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
                                                        <p className="text-gray-900">{patient?.dob ? formatDate(patient.dob) : 'Chưa cập nhật'}</p>
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
                                                        <p className="text-gray-900">{getGenderText(patient?.gender)}</p>
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
                                                        <p className="text-gray-900">{patient?.address || 'Chưa cập nhật'}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        // Doctor Profile Form (Editable)
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    <User className="w-4 h-4 inline mr-2 text-gray-500" />
                                                    Họ và tên
                                                </label>
                                                {editingDoctorProfile ? (
                                                    <input
                                                        type="text"
                                                        value={doctorEditForm.fullName}
                                                        onChange={(e) => handleDoctorInputChange('fullName', e.target.value)}
                                                        className="w-full px-3 py-2 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:bg-white transition-all duration-200"
                                                        placeholder="Nhập họ và tên"
                                                    />
                                                ) : (
                                                    <div className="px-3 py-2 bg-gray-50 rounded-md">
                                                        <p className="text-gray-900">{profileData?.fullName || 'Chưa cập nhật'}</p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    <Stethoscope className="w-4 h-4 inline mr-2 text-gray-500" />
                                                    Chuyên khoa
                                                </label>
                                                <div className="px-3 py-2 bg-gray-50 rounded-md">
                                                    <p className="text-gray-900">{profileData?.specialty?.specialtyName || 'Chưa xác định'}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    <Phone className="w-4 h-4 inline mr-2 text-gray-500" />
                                                    Số điện thoại
                                                </label>
                                                {editingDoctorProfile ? (
                                                    <input
                                                        type="tel"
                                                        value={doctorEditForm.phone}
                                                        onChange={(e) => handleDoctorInputChange('phone', e.target.value)}
                                                        className="w-full px-3 py-2 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:bg-white transition-all duration-200"
                                                        placeholder="Nhập số điện thoại"
                                                    />
                                                ) : (
                                                    <div className="px-3 py-2 bg-gray-50 rounded-md">
                                                        <p className="text-gray-900">{profileData?.phone || 'Chưa cập nhật'}</p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    <Mail className="w-4 h-4 inline mr-2 text-gray-500" />
                                                    Email
                                                </label>
                                                <div className="px-3 py-2 bg-gray-50 rounded-md">
                                                    <p className="text-gray-900">{profileData?.email || 'Chưa cập nhật'}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    <Award className="w-4 h-4 inline mr-2 text-gray-500" />
                                                    Số năm kinh nghiệm
                                                </label>
                                                <div className="px-3 py-2 bg-gray-50 rounded-md">
                                                    <p className="text-gray-900">{profileData?.yearsOfExperience || 0} năm</p>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    <User className="w-4 h-4 inline mr-2 text-gray-500" />
                                                    Giới tính
                                                </label>
                                                <div className="px-3 py-2 bg-gray-50 rounded-md">
                                                    <p className="text-gray-900">{getGenderText(profileData?.gender)}</p>
                                                </div>
                                            </div>

                                            <div className="md:col-span-2 lg:col-span-3 space-y-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    <MapPin className="w-4 h-4 inline mr-2 text-gray-500" />
                                                    Thông tin bổ sung
                                                </label>
                                                {editingDoctorProfile ? (
                                                    <textarea
                                                        value={doctorEditForm.bio}
                                                        onChange={(e) => handleDoctorInputChange('bio', e.target.value)}
                                                        rows={3}
                                                        className="w-full px-3 py-2 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:bg-white transition-all duration-200 resize-none"
                                                        placeholder="Nhập thông tin bổ sung"
                                                    />
                                                ) : (
                                                    <div className="px-3 py-2 bg-gray-50 rounded-md min-h-[80px]">
                                                        <p className="text-gray-900">{profileData?.bio || 'Chưa có thông tin'}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === '2fa' && (
                                <TwoFactorAuth
                                    onShowToast={showToast}
                                    userEmail={
                                        userType === 'PATIENT' ?
                                            (patient?.email || patient?.phone || 'user@example.com') :
                                            (profileData?.email || 'user@example.com')
                                    }
                                    is2FAEnabled={
                                        userType === 'PATIENT' ?
                                            (patient?.enable2FA || false) :
                                            (profileData?.enable2FA || false)
                                    }
                                />
                            )}

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