'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { SignInRequest } from '@/types/auth';
import { loginUser } from '@/services/authService';
import { login } from '@/redux/slice/authSlice';
import Link from 'next/link';
import { useAppDispatch } from '@/redux/hook';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import SocialLoginButtons from '@/components/social/SocialLoginButtons';
import { getRedirectPath } from '@/utils/authorities';

const SignIn = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            router.push('/');
        } else {
            setLoading(false);
        }
    }, [router]);

    if (loading) {
        return <LoadingSpinner />;
    }

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!emailOrPhone || !password) {
            toast.error('Vui lòng nhập đầy đủ email/số điện thoại và mật khẩu!', {
                duration: 4000,
                position: 'top-right',
            });
            return;
        }

        const request: SignInRequest = { emailOrPhone, password };
        setIsLoading(true);

        const loadingToast = toast.loading('Đang đăng nhập...', {
            position: 'top-right',
        });

        try {
            const data = await loginUser(request);

            toast.dismiss(loadingToast);
            toast.success('Đăng nhập thành công! Chào mừng bạn trở lại! 🏥', {
                duration: 3000,
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

            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);

            dispatch(login());

            const redirectPath = getRedirectPath(data.userType);

            setTimeout(() => {
                router.push(redirectPath);
            }, 500);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Login error:', error.message);
            }
            toast.dismiss(loadingToast);
            toast.error('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!', {
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Chào mừng trở lại!</h2>
                            <p className="text-gray-600 text-base">Đăng nhập để quản lý lịch khám và thông tin sức khỏe của bạn</p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                            <form className="space-y-6" onSubmit={handleLogin}>
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

                                <div>
                                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Mật khẩu
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            disabled={isLoading}
                                            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                            placeholder="Nhập mật khẩu"
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            id="remember-me"
                                            name="remember-me"
                                            type="checkbox"
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                            Ghi nhớ đăng nhập
                                        </label>
                                    </div>
                                    <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                        Quên mật khẩu?
                                    </Link>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="cursor-pointer w-full bg-gray-900 text-white py-2.5 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Đang đăng nhập...
                                        </>
                                    ) : (
                                        'Đăng nhập'
                                    )}
                                </button>

                                <SocialLoginButtons
                                    isLoading={isLoading}
                                    dividerText="Hoặc đăng nhập bằng"
                                />

                            </form>
                        </div>

                        {/* Register Link */}
                        <div className="text-center mt-6">
                            <p className="text-gray-600">
                                Chưa có tài khoản?{' '}
                                <Link href="/registration" className="text-blue-600 hover:text-blue-700 font-semibold">
                                    Đăng ký ngay
                                </Link>
                            </p>
                        </div>

                        {/* Trust Indicators */}
                        <div className="mt-8 text-center">
                            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-emerald-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    Bảo mật cao
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Hỗ trợ 24/7
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-emerald-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    Chăm sóc tận tình
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignIn;