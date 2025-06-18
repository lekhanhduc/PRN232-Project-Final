'use client'
import React, { useState } from 'react';
import { Settings, Bell, Shield, Database, Globe, User } from 'lucide-react';

export const SettingsManagement = () => {
    const [activeTab, setActiveTab] = useState('general');

    const settingsTabs = [
        { id: 'general', label: 'Cài đặt chung', icon: Settings },
        { id: 'notifications', label: 'Thông báo', icon: Bell },
        { id: 'security', label: 'Bảo mật', icon: Shield },
        { id: 'data', label: 'Dữ liệu', icon: Database },
        { id: 'system', label: 'Hệ thống', icon: Globe },
        { id: 'profile', label: 'Hồ sơ', icon: User }
    ];

    const renderSettingsContent = () => {
        switch (activeTab) {
            case 'general':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Cài đặt chung</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tên bệnh viện
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        defaultValue="Bệnh viện Đa khoa Trung ương"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Múi giờ
                                    </label>
                                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh (GMT+7)</option>
                                        <option value="UTC">UTC</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ngôn ngữ
                                    </label>
                                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="vi">Tiếng Việt</option>
                                        <option value="en">English</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'notifications':
                return (
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Cài đặt thông báo</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Thông báo email</p>
                                    <p className="text-sm text-gray-500">Nhận thông báo qua email</p>
                                </div>
                                <input type="checkbox" className="rounded" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Thông báo push</p>
                                    <p className="text-sm text-gray-500">Thông báo trên trình duyệt</p>
                                </div>
                                <input type="checkbox" className="rounded" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Thông báo SMS</p>
                                    <p className="text-sm text-gray-500">Thông báo qua tin nhắn</p>
                                </div>
                                <input type="checkbox" className="rounded" />
                            </div>
                        </div>
                    </div>
                );
            case 'security':
                return (
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Bảo mật</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mật khẩu hiện tại
                                </label>
                                <input
                                    type="password"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mật khẩu mới
                                </label>
                                <input
                                    type="password"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Xác nhận mật khẩu mới
                                </label>
                                <input
                                    type="password"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                                Cập nhật mật khẩu
                            </button>
                        </div>
                    </div>
                );
            case 'data':
                return (
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Quản lý dữ liệu</h3>
                        <div className="space-y-4">
                            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                                <p className="text-sm text-yellow-800">
                                    <strong>Lưu ý:</strong> Các thao tác này không thể hoàn tác.
                                </p>
                            </div>
                            <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
                                Xuất dữ liệu
                            </button>
                            <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
                                Sao lưu dữ liệu
                            </button>
                        </div>
                    </div>
                );
            case 'system':
                return (
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin hệ thống</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Phiên bản</p>
                                    <p className="text-sm text-gray-500">v1.0.0</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Cập nhật cuối</p>
                                    <p className="text-sm text-gray-500">15/01/2025</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Trạng thái</p>
                                    <p className="text-sm text-green-600">Hoạt động</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Bộ nhớ sử dụng</p>
                                    <p className="text-sm text-gray-500">2.5 GB</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'profile':
                return (
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Hồ sơ cá nhân</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Họ và tên
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    defaultValue="Nguyễn Văn Quản lý"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    defaultValue="manager@hospital.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Số điện thoại
                                </label>
                                <input
                                    type="tel"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    defaultValue="0123456789"
                                />
                            </div>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                                Cập nhật hồ sơ
                            </button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200">
                <h2 className="text-2xl font-bold text-gray-900">Cài đặt hệ thống</h2>
                <p className="text-gray-600 mt-1">Quản lý cài đặt và cấu hình hệ thống</p>
            </div>
            
            <div className="flex">
                <div className="w-64 border-r border-slate-200">
                    <nav className="p-4 space-y-2">
                        {settingsTabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                                    activeTab === tab.id
                                        ? 'bg-slate-100 text-slate-700 border-r-2 border-slate-400 shadow-sm'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-700'
                                }`}
                            >
                                <tab.icon className={`w-5 h-5 mr-3 ${
                                    activeTab === tab.id ? 'text-slate-600' : 'text-slate-500'
                                }`} />
                                <span className="font-medium">{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>
                
                <div className="flex-1 p-6">
                    {renderSettingsContent()}
                </div>
            </div>
        </div>
    );
}; 