'use client'
import React from 'react';

interface AuthCallbackLayoutProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
}

const AuthCallbackLayout = ({
    children,
    title = "Đang xác thực...",
    description = "Vui lòng đợi trong giây lát"
}: AuthCallbackLayoutProps) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center">
            <div className="max-w-md w-full mx-4">
                {/* Logo/Brand Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C13.1 2 14 2.9 14 4V8H18C19.1 8 20 8.9 20 10V14C20 15.1 19.1 16 18 16H14V20C14 21.1 13.1 22 12 22H10C8.9 22 8 21.1 8 20V16H4C2.9 16 2 15.1 2 14V10C2 8.9 2.9 8 4 8H8V4C8 2.9 8.9 2 10 2H12Z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Medically</h1>
                    <p className="text-gray-600">Hệ thống y tế chuyên nghiệp</p>
                </div>

                {/* Auth Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
                        <p className="text-gray-600 text-sm">{description}</p>
                    </div>

                    {/* Content */}
                    <div className="space-y-6">
                        {children}
                    </div>

                    {/* Security Notice */}
                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <div className="flex items-center justify-center text-xs text-gray-500">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                            Kết nối được bảo mật SSL
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8 text-xs text-gray-500">
                    © 2025 Medically. Tất cả quyền được bảo lưu.
                </div>
            </div>
        </div>
    );
};

export default AuthCallbackLayout;
