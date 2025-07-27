'use client'
import React, { useState, useEffect } from "react";
import { Heart, Search, ShoppingBag, UserCircle, LogIn, UserPlus, History, LogOut, User, Calendar, Settings, Bell } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from '@/hooks/useAuth';

const Header = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const { isLoggedIn, logout: authLogout } = useAuth();

    const isActive = (path: string) => {
        if (path === '/') {
            return pathname === '/';
        }
        return pathname.startsWith(path);
    };

    const getMenuItemClasses = (path: string) => {
        const baseClasses = "font-medium hover:text-blue-700 transition-colors";
        if (isActive(path)) {
            return `${baseClasses} text-blue-600 border-b-2 border-blue-600 pb-1`;
        }
        return `${baseClasses} text-gray-600 hover:text-gray-900`;
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            if (!target.closest('.user-dropdown')) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    const handleLogout = () => {
        authLogout();
        setIsDropdownOpen(false);
        router.push("/login");
    };

    return (
        <div>
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                <Heart className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-gray-900">Medically</span>
                        </div>

                        <nav className="hidden md:flex space-x-8">
                            <Link href="/" className={getMenuItemClasses('/')}>Trang chủ</Link>
                            <Link href="/about" className={getMenuItemClasses('/about')}>Giới thiệu</Link>
                            <Link href="/doctor" className={getMenuItemClasses('/doctor')}>Bác sĩ</Link>
                            <Link href="/services" className={getMenuItemClasses('/services')}>Dịch vụ</Link>
                            <Link href="/portfolio" className={getMenuItemClasses('/portfolio')}>Danh mục</Link>
                            <Link href="/blog" className={getMenuItemClasses('/blog')}>Tin tức</Link>
                            <Link href="/contact" className={getMenuItemClasses('/contact')}>Liên hệ</Link>
                        </nav>

                        <div className="flex items-center space-x-6">
                            <Search className="w-6 h-6 text-gray-600 hover:text-gray-900 cursor-pointer transition-colors" />
                            <div className="relative">
                                <ShoppingBag className="w-6 h-6 text-gray-600 hover:text-gray-900 cursor-pointer transition-colors" />
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">0</span>
                            </div>

                            {/* User Dropdown */}
                            <div className="relative user-dropdown">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center space-x-2 focus:outline-none bg-blue-50 hover:bg-blue-100 p-2 rounded-full transition-colors"
                                >
                                    <UserCircle className="w-7 h-7 text-blue-600" />
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-3 w-64 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200">
                                        <div className="px-4 py-3 border-b border-gray-200">
                                            {isLoggedIn ? (
                                                <>
                                                    <p className="text-sm text-gray-500">Xin chào</p>
                                                    <p className="font-medium text-gray-900">Bệnh nhân</p>
                                                </>
                                            ) : (
                                                <>
                                                    <p className="text-sm text-gray-500">Chào mừng đến với</p>
                                                    <p className="font-medium text-gray-900">Medically Healthcare</p>
                                                </>
                                            )}
                                        </div>

                                        {!isLoggedIn &&
                                            <>
                                                <Link href="/login" className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors">
                                                    <LogIn className="w-5 h-5 mr-3 text-blue-600" />
                                                    <span className="text-base">Đăng nhập</span>
                                                </Link>

                                                <Link href="/registration" className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors">
                                                    <UserPlus className="w-5 h-5 mr-3 text-blue-600" />
                                                    <span className="text-base">Đăng ký</span>
                                                </Link>
                                            </>
                                        }


                                        {isLoggedIn && (
                                            <>
                                                <Link href="/profile" className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors">
                                                    <User className="w-5 h-5 mr-3 text-blue-600" />
                                                    <span className="text-base">Hồ sơ cá nhân</span>
                                                </Link>

                                                <Link href="/appointments" className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors">
                                                    <Calendar className="w-5 h-5 mr-3 text-blue-600" />
                                                    <span className="text-base">Lịch hẹn</span>
                                                </Link>

                                                <Link href="/notifications" className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors">
                                                    <Bell className="w-5 h-5 mr-3 text-blue-600" />
                                                    <span className="text-base">Thông báo</span>
                                                </Link>

                                                <Link href="/settings" className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors">
                                                    <Settings className="w-5 h-5 mr-3 text-blue-600" />
                                                    <span className="text-base">Cài đặt</span>
                                                </Link>

                                                <div className="border-t border-gray-200 my-2"></div>
                                            </>
                                        )}


                                        {
                                            isLoggedIn &&
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center px-4 py-3 text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                                            >
                                                <LogOut className="w-5 h-5 mr-3" />
                                                <span className="text-base font-medium">Đăng xuất</span>
                                            </button>
                                        }
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
};

export default Header;