'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { SignInRequest, SignInResponse, TwoFASetupResponse } from '@/types/auth';
import { loginUser } from '@/services/authService';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import SocialLoginButtons from '@/components/social/SocialLoginButtons';
import Modal from 'react-modal';
import { ApiResponse } from '@/types/apiResonse';
import { getRedirectPath } from '@/utils/Authorities';
import { fetchInterceptor } from '@/utils/Interceptor';
import { API_URL } from '@/utils/baseUrl';

const SignIn = () => {
    const { login: authLogin } = useAuth();
    const router = useRouter();
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [twoFaStep, setTwoFaStep] = useState<'NONE' | 'SETUP_REQUIRED' | 'VERIFICATION_REQUIRED'>('NONE');
    const [qrCodeData, setQrCodeData] = useState<string>('');
    const [otpCode, setOtpCode] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

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

        const request: SignInRequest = { phoneOrEmail: emailOrPhone, password };
        setIsLoading(true);

        const loadingToast = toast.loading('Đang đăng nhập...', {
            position: 'top-right',
        });

        try {
            const data = await loginUser(request);
            toast.dismiss(loadingToast);

            if (data.twoFaStep === 1) {
                const response = await fetchInterceptor(`${API_URL}/api/v1/2fa`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phoneOrEmail: emailOrPhone }),
                });
                const twoFaData: TwoFASetupResponse = await response.json();
                console.log('twoFaData:', twoFaData);
                console.log(twoFaData)
                if (twoFaData.code === 200 && twoFaData.result) {
                    setQrCodeData(twoFaData.result);

                    setTwoFaStep('SETUP_REQUIRED');
                    setIsModalOpen(true);
                } else {
                    throw new Error('Không thể lấy mã QR');
                }
            } else if (data.twoFaStep === 2) {
                setTwoFaStep('VERIFICATION_REQUIRED');
                setIsModalOpen(true);
            } else {
                toast.success('Đăng nhập thành công! Chào mừng bạn trở lại! 🏥', {
                    duration: 3000,
                    position: 'top-right',
                    style: { background: '#059669', color: '#fff' },
                    iconTheme: { primary: '#fff', secondary: '#059669' },
                });
   
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);
                authLogin(data);
                const redirectPath = getRedirectPath(data.userType);
                setTimeout(() => router.push(redirectPath), 500);
            }
        } catch (error: unknown) {
            toast.dismiss(loadingToast);
            toast.error('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!', {
                duration: 5000,
                position: 'top-right',
                style: { background: '#DC2626', color: '#fff' },
                iconTheme: { primary: '#fff', secondary: '#DC2626' },
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handle2FASubmit = async () => {
        if (!otpCode) {
            toast.error('Vui lòng nhập mã OTP!', { duration: 4000, position: 'top-right' });
            return;
        }

        setIsLoading(true);
        const loadingToast = toast.loading('Đang xác minh OTP...', { position: 'top-right' });

        try {
            const response = await fetch(`${API_URL}/api/v1/2fa/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneOrEmail: emailOrPhone, code: otpCode }),
            });
            const data: ApiResponse<SignInResponse> = await response.json();

            if (data.code === 200 && data.result) {
                toast.dismiss(loadingToast);
                toast.success('Xác minh OTP thành công!', {
                    duration: 3000,
                    position: 'top-right',
                    style: { background: '#059669', color: '#fff' },
                    iconTheme: { primary: '#fff', secondary: '#059669' },
                });

                localStorage.setItem('accessToken', data.result.accessToken);
                localStorage.setItem('refreshToken', data.result.refreshToken);
                authLogin(data.result);
                const redirectPath = getRedirectPath(data.result.userType);
                setTimeout(() => router.push(redirectPath), 500);
                setIsModalOpen(false);
            } else {
                throw new Error('Mã OTP không hợp lệ');
            }
        } catch (error: unknown) {
            toast.dismiss(loadingToast);
            toast.error('Xác minh OTP thất bại. Vui lòng thử lại!', {
                duration: 5000,
                position: 'top-right',
                style: { background: '#DC2626', color: '#fff' },
                iconTheme: { primary: '#fff', secondary: '#DC2626' },
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

                        <div className="text-center mt-6">
                            <p className="text-gray-600">
                                Chưa có tài khoản?{' '}
                                <Link href="/registration" className="text-blue-600 hover:text-blue-700 font-semibold">
                                    Đăng ký ngay
                                </Link>
                            </p>
                        </div>

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

            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 1000,
                    },
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        maxWidth: '450px',
                        width: '90%',
                        borderRadius: '8px',
                        padding: '32px',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        background: 'white',
                    },
                }}
            >
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {twoFaStep === 'SETUP_REQUIRED' ? 'Cài đặt Xác thực Hai Yếu tố' : 'Xác minh Mã OTP'}
                        </h2>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {twoFaStep === 'SETUP_REQUIRED' && (
                        <div className="mb-6">
                            <p className="text-gray-600 text-sm mb-4">
                                Quét mã QR bằng ứng dụng xác thực như Google Authenticator hoặc Authy:
                            </p>

                            <div className="flex justify-center mb-4">
                                <div className="p-4 border border-gray-200 rounded-lg bg-white">
                                    <img
                                        src={qrCodeData}
                                        alt="QR Code"
                                        className="w-40 h-40"
                                    />
                                </div>
                            </div>

                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
                                <p className="text-gray-700 text-xs">
                                    <strong>Lưu ý:</strong> Hãy lưu mã backup hoặc chụp màn hình QR code để phòng trường hợp mất thiết bị.
                                </p>
                            </div>
                        </div>
                    )}

                    <div>
                        <label htmlFor="otpCode" className="block text-sm font-medium text-gray-700 mb-2">
                            {twoFaStep === 'SETUP_REQUIRED' ? 'Nhập mã từ ứng dụng xác thực' : 'Nhập mã OTP'}
                        </label>
                        <input
                            type="text"
                            id="otpCode"
                            value={otpCode}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                setOtpCode(value);
                            }}
                            disabled={isLoading}
                            className="w-full px-4 py-3 text-lg font-mono text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed tracking-wider"
                            placeholder="000000"
                            maxLength={6}
                        />
                        <p className="text-xs text-gray-500 mt-1 text-center">Mã gồm 6 chữ số</p>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 font-medium transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handle2FASubmit}
                            disabled={isLoading || otpCode.length !== 6}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors flex items-center space-x-2"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Đang xác minh...</span>
                                </>
                            ) : (
                                <span>Xác minh</span>
                            )}
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default SignIn;