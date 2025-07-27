'use client'
import { useState, useEffect, useRef } from 'react';
import { Bell, Settings, LogOut, Calendar, Activity, User, ChevronDown, Shield, UserCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { tokenStorage } from '@/utils/tokenStorage';

export const Header = () => {
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const notificationRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowUserDropdown(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        tokenStorage.clearAccessToken();
        tokenStorage.clearRefreshToken();
        router.push('/login');
        setShowUserDropdown(false);
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="bg-white shadow-sm border-b sticky top-0 z-40">
            <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Left side - Logo and Title */}
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
                                <Activity className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Hệ thống Lễ tân</h1>
                                <p className="text-xs text-gray-500">Quản lý tiếp nhận bệnh nhân</p>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Controls */}
                    <div className="flex items-center space-x-4">
                        {/* Date and Time */}
                        <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <div className="text-right">
                                <div className="font-medium">{formatTime(currentTime)}</div>
                                <div className="text-xs text-gray-500">{formatDate(currentTime)}</div>
                            </div>
                        </div>

                        {/* Notifications */}
                        <div className="relative" ref={notificationRef}>
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <Bell className="w-5 h-5" />
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                                    <span className="text-xs text-white font-bold">3</span>
                                </span>
                            </button>

                            {/* Notifications Dropdown */}
                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <h3 className="text-sm font-semibold text-gray-900">Thông báo</h3>
                                    </div>
                                    <div className="max-h-64 overflow-y-auto">
                                        <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                                            <div className="flex items-start space-x-3">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-900">Bệnh nhân mới đăng ký</p>
                                                    <p className="text-xs text-gray-500 mt-1">2 phút trước</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                                            <div className="flex items-start space-x-3">
                                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-900">Lịch hẹn được xác nhận</p>
                                                    <p className="text-xs text-gray-500 mt-1">15 phút trước</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                                            <div className="flex items-start space-x-3">
                                                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-900">Cập nhật lịch làm việc</p>
                                                    <p className="text-xs text-gray-500 mt-1">1 giờ trước</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* User Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setShowUserDropdown(!showUserDropdown)}
                                className="flex items-center space-x-2 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <div className="w-8 h-8 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-gray-600" />
                                </div>
                                <div className="hidden md:block text-left">
                                    <div className="text-sm font-medium text-gray-900">Lễ tân</div>
                                    <div className="text-xs text-gray-500">Đang hoạt động</div>
                                </div>
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                            </button>

                            {/* User Dropdown Menu */}
                            {showUserDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <div className="text-sm font-medium text-gray-900">Lễ tân</div>
                                        <div className="text-xs text-gray-500">receptionist@hospital.com</div>
                                    </div>

                                    <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                                        <UserCircle className="w-4 h-4 mr-3 text-gray-500" />
                                        Thông tin cá nhân
                                    </button>

                                    <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                                        <Settings className="w-4 h-4 mr-3 text-gray-500" />
                                        Cài đặt
                                    </button>

                                    <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                                        <Shield className="w-4 h-4 mr-3 text-gray-500" />
                                        Bảo mật
                                    </button>

                                    <div className="border-t border-gray-100 my-2"></div>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4 mr-3" />
                                        Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};