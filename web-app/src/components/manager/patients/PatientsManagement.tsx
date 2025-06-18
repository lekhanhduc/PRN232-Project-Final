'use client'
import { useState } from 'react';
import { Search, Filter, User, Phone, Mail, Calendar, MapPin } from 'lucide-react';
import { Patient } from '@/types/appointment';

interface PatientsManagementProps {
    patients: Patient[];
}

export const PatientsManagement = ({ patients }: PatientsManagementProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [genderFilter, setGenderFilter] = useState('all');
    const [ageFilter, setAgeFilter] = useState('all');

    const genderOptions = [
        { value: 'all', label: 'Tất cả giới tính' },
        { value: 'male', label: 'Nam' },
        { value: 'female', label: 'Nữ' }
    ];

    const ageOptions = [
        { value: 'all', label: 'Tất cả độ tuổi' },
        { value: 'child', label: 'Trẻ em (0-12)' },
        { value: 'teen', label: 'Thanh thiếu niên (13-19)' },
        { value: 'adult', label: 'Người lớn (20-59)' },
        { value: 'senior', label: 'Người cao tuổi (60+)' }
    ];

    const calculateAge = (birthDate: string) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const getAgeGroup = (birthDate: string) => {
        const age = calculateAge(birthDate);
        if (age <= 12) return 'child';
        if (age <= 19) return 'teen';
        if (age <= 59) return 'adult';
        return 'senior';
    };

    const filteredPatients = patients.filter(patient => {
        const matchesSearch = 
            patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.phone.includes(searchTerm) ||
            patient.email.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesGender = genderFilter === 'all' || patient.gender === genderFilter;
        const matchesAge = ageFilter === 'all' || getAgeGroup(patient.birthDate) === ageFilter;

        return matchesSearch && matchesGender && matchesAge;
    });

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    const getGenderText = (gender: string) => {
        return gender === 'male' ? 'Nam' : 'Nữ';
    };

    const getGenderColor = (gender: string) => {
        return gender === 'male' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Quản lý Bệnh nhân</h2>
                <div className="text-sm text-gray-500">
                    Tổng cộng: {filteredPatients.length} bệnh nhân
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm bệnh nhân..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <select
                            value={genderFilter}
                            onChange={(e) => setGenderFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {genderOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <select
                            value={ageFilter}
                            onChange={(e) => setAgeFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {ageOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Xuất danh sách
                    </button>
                </div>
            </div>

            {/* Patients Table */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Bệnh nhân
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thông tin liên hệ
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ngày sinh
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Giới tính
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Lần khám cuối
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredPatients.map((patient) => (
                                <tr key={patient.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0">
                                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <User className="w-5 h-5 text-gray-500" />
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                                                <div className="text-sm text-gray-500">ID: {patient.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-1">
                                            <div className="flex items-center space-x-2">
                                                <Phone className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm text-gray-900">{patient.phone}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Mail className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm text-gray-500">{patient.email}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <MapPin className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm text-gray-500">{patient.address}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{formatDate(patient.birthDate)}</div>
                                        <div className="text-sm text-gray-500">
                                            ({calculateAge(patient.birthDate)} tuổi)
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGenderColor(patient.gender)}`}>
                                            {getGenderText(patient.gender)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {patient.lastVisit ? formatDate(patient.lastVisit) : 'Chưa có'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button className="text-blue-600 hover:text-blue-900">
                                                Xem
                                            </button>
                                            <button className="text-green-600 hover:text-green-900">
                                                Sửa
                                            </button>
                                            <button className="text-purple-600 hover:text-purple-900">
                                                Lịch sử
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
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
                            <p className="text-sm font-medium text-gray-600">Tổng bệnh nhân</p>
                            <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-4">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-full">
                            <User className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Nam</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {patients.filter(p => p.gender === 'male').length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-4">
                    <div className="flex items-center">
                        <div className="p-2 bg-pink-100 rounded-full">
                            <User className="w-6 h-6 text-pink-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Nữ</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {patients.filter(p => p.gender === 'female').length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-4">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-full">
                            <Calendar className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Mới tháng này</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {patients.filter(p => {
                                    if (!p.lastVisit) return false;
                                    const visitDate = new Date(p.lastVisit);
                                    const now = new Date();
                                    return visitDate.getMonth() === now.getMonth() && 
                                           visitDate.getFullYear() === now.getFullYear();
                                }).length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 