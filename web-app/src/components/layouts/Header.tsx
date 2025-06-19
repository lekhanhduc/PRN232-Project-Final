'use client'
import React, { useState } from "react";
import { Heart, Search, ShoppingBag, UserCircle, LogIn, UserPlus, History, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Header = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

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
                            <Link href="/" className="text-blue-600 font-medium hover:text-blue-700 transition-colors">Home</Link>
                            <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">About</Link>
                            <Link href="/doctor" className="text-gray-600 hover:text-gray-900 transition-colors">Doctors</Link>
                            <Link href="/services" className="text-gray-600 hover:text-gray-900 transition-colors">Services</Link>
                            <Link href="/portfolio" className="text-gray-600 hover:text-gray-900 transition-colors">Portfolio</Link>
                            <Link href="/blog" className="text-gray-600 hover:text-gray-900 transition-colors">Blog</Link>
                            <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</Link>
                        </nav>

                        {/* Right side icons */}
                        <div className="flex items-center space-x-6">
                            <Search className="w-6 h-6 text-gray-600 hover:text-gray-900 cursor-pointer transition-colors" />
                            <div className="relative">
                                <ShoppingBag className="w-6 h-6 text-gray-600 hover:text-gray-900 cursor-pointer transition-colors" />
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">0</span>
                            </div>

                            {/* User Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center space-x-2 focus:outline-none bg-blue-50 hover:bg-blue-100 p-2 rounded-full transition-colors"
                                >
                                    <UserCircle className="w-7 h-7 text-blue-600" />
                                </button>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-3 w-64 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200">
                                        <div className="px-4 py-3 border-b border-gray-200">
                                            <p className="text-sm text-gray-500">Welcome to</p>
                                            <p className="font-medium text-gray-900">Medically Healthcare</p>
                                        </div>
                                        <Link href="/login" className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors">
                                            <LogIn className="w-5 h-5 mr-3 text-blue-600" />
                                            <span className="text-base">Login</span>
                                        </Link>
                                        <Link href="/registration" className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors">
                                            <UserPlus className="w-5 h-5 mr-3 text-blue-600" />
                                            <span className="text-base">Register</span>
                                        </Link>
                                        <Link href="#" className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors">
                                            <History className="w-5 h-5 mr-3 text-blue-600" />
                                            <span className="text-base">Order History</span>
                                        </Link>
                                        <div className="border-t border-gray-200 mt-1"></div>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center px-4 py-3 text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                                        >
                                            <LogOut className="w-5 h-5 mr-3" />
                                            <span className="text-base font-medium">Logout</span>
                                        </button>
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