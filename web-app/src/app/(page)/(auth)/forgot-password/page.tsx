'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';

const ForgotPassword = () => {
    const router = useRouter();
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleForgotPassword = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!emailOrPhone) {
            toast.error('Vui lòng nhập email hoặc số điện thoại!', {
                duration: 4000,
                position: 'top-right',
            });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10,11}$/;

        if (!emailRegex.test(emailOrPhone) && !phoneRegex.test(emailOrPhone)) {
            toast.error('Vui lòng nhập email hoặc số điện thoại hợp lệ!', {
                duration: 4000,
                position: 'top-right',
            });
            return;
        }

        setIsLoading(true);

        const loadingToast = toast.loading('Đang gửi yêu cầu...', {
            position: 'top-right',
        });

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));

            toast.dismiss(loadingToast);
            toast.success('Đã gửi hướng dẫn đặt lại mật khẩu! Vui lòng kiểm tra email/SMS 📧', {
                duration: 5000,
                position: 'top-right',
                style: {
                    background: '#059669',
                    color: '#fff',
                },
                iconTheme: {
                    primary: '#fff',
                    secondary: '#059669',
                },
            });

            setIsSubmitted(true);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Forgot password error:', error.message);
            }
            toast.dismiss(loadingToast);
            toast.error('Không thể gửi yêu cầu. Vui lòng thử lại sau!', {
                duration: 5000,
                position: 'top-right',
                style: {
                    background: '#DC2626',
                    color: '#fff',
                },
                iconTheme: {
                    primary: '#fff',
                    secondary: '#DC2626',
                },
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendRequest = () => {
        setIsSubmitted(false);
        setEmailOrPhone('');
        toast.success('Bạn có thể gửi yêu cầu mới!', {
            duration: 3000,
            position: 'top-right',
        });
    };

    return (
        <>
            <Toaster
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#FFFFFF',
                        color: '#1F2937',
                        fontSize: '14px',
                        borderRadius: '12px',
                        padding: '16px 20px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        border: '1px solid #E5E7EB',
                    },
                }}
            />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
                <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
                    <div className="max-w-md w-full">
                        <div className="text-center mb-8">
                            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                {isSubmitted ? 'Kiểm tra email/SMS' : 'Quên mật khẩu?'}
                            </h2>
                            <p className="text-gray-600 text-base">
                                {isSubmitted
                                    ? 'Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email/số điện thoại của bạn'
                                    : 'Nhập email hoặc số điện thoại để nhận hướng dẫn đặt lại mật khẩu'
                                }
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                            {!isSubmitted ? (
                                <form className="space-y-6" onSubmit={handleForgotPassword}>
                                    <div>
                                        <label htmlFor="emailOrPhone" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Email hoặc Số điện thoại
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                                </svg>
                                            </div>
                                            <input
                                                type="text"
                                                id="emailOrPhone"
                                                value={emailOrPhone}
                                                onChange={(e) => setEmailOrPhone(e.target.value)}
                                                disabled={isLoading}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                placeholder="Nhập email hoặc số điện thoại"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Đang gửi...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                </svg>
                                                Gửi hướng dẫn
                                            </>
                                        )}
                                    </button>
                                </form>
                            ) : (
                                <div className="text-center space-y-6">
                                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                                        <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Đã gửi thành công!</h3>
                                        <p className="text-gray-600 text-sm mb-4">
                                            Nếu tài khoản tồn tại, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu trong vòng 5-10 phút.
                                        </p>
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                                            <div className="flex">
                                                <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <div className="text-sm text-blue-800">
                                                    <p className="font-medium mb-1">Lưu ý:</p>
                                                    <ul className="list-disc list-inside space-y-1 text-blue-700">
                                                        <li>Kiểm tra cả hộp thư spam/junk</li>
                                                        <li>Link đặt lại có hiệu lực trong 24 giờ</li>
                                                        <li>Nếu không nhận được, vui lòng thử lại</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleResendRequest}
                                        className="w-full bg-gray-100 text-gray-700 py-2.5 px-4 rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 font-medium transition-colors"
                                    >
                                        Gửi lại yêu cầu
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="text-center mt-6">
                            <Link href="/login" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Quay lại đăng nhập
                            </Link>
                        </div>

                        <div className="mt-8 bg-gray-50 rounded-xl p-6 text-center">
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">Cần hỗ trợ?</h4>
                            <p className="text-sm text-gray-600 mb-4">
                                Liên hệ với chúng tôi nếu bạn gặp khó khăn trong việc đặt lại mật khẩu
                            </p>
                            <div className="flex items-center justify-center space-x-6 text-sm">
                                <a href="tel:1900xxxx" className="flex items-center text-blue-600 hover:text-blue-700">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    Hotline
                                </a>
                                <a href="mailto:support@example.com" className="flex items-center text-blue-600 hover:text-blue-700">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    Email
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ForgotPassword;