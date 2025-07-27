'use client'
import React, { useState } from "react";
import { Bell, Settings, LogOut, Calendar, Activity, User, ChevronDown } from 'lucide-react';
import { useRouter } from "next/navigation";
import { useAuth } from '@/hooks/useAuth';

export const Header = () => {

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const router = useRouter();
    const { isLoggedIn, logout: authLogout } = useAuth();

    const handleLogout = () => {
        authLogout();
        setIsDropdownOpen(false);
        router.push("/login");
    };

    const formatDate = () => {
        const date = new Date();
        return date.toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
            <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Activity className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900">Medical Admin</h1>
                                <p className="text-sm text-gray-500">Hệ thống quản lý bệnh viện</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="hidden md:flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700 font-medium">{formatDate()}</span>
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                                className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <Bell className="w-5 h-5" />
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                                </span>
                            </button>
                        </div>

                        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                            <Settings className="w-5 h-5" />
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4 text-white" />
                                </div>
                                <div className="hidden sm:block text-left">
                                    <p className="text-sm font-medium text-gray-900">Admin</p>
                                    <p className="text-xs text-gray-500">Quản trị viên</p>
                                </div>
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="text-sm font-medium text-gray-900">Admin</p>
                                        <p className="text-xs text-gray-500">admin@hospital.com</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setIsDropdownOpen(false);
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                                    >
                                        <User className="w-4 h-4" />
                                        <span>Thông tin cá nhân</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsDropdownOpen(false);
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                                    >
                                        <Settings className="w-4 h-4" />
                                        <span>Cài đặt</span>
                                    </button>
                                    <hr className="my-1" />
                                    <button
                                        onClick={handleLogout}
                                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Đăng xuất</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {(isDropdownOpen || isNotificationOpen) && (
                <div
                    className="fixed inset-0 z-30"
                    onClick={() => {
                        setIsDropdownOpen(false);
                        setIsNotificationOpen(false);
                    }}
                />
            )}
        </header>
    );
}; 