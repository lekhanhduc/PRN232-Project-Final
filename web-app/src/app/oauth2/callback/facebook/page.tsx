'use client';

import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { SignInWithFacebook } from '@/services/authService';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';

function CallbackFacebookContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const code = searchParams.get('code');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { login: authLogin } = useAuth();

    const handleSendCode = useCallback(async (code: string) => {
        try {
            const data = await SignInWithFacebook(code);
            if (data.result && data.result.accessToken) {
                localStorage.setItem('accessToken', data.result.accessToken);
                localStorage.setItem('refreshToken', data.result.refreshToken);
                authLogin(data.result);
                toast.success('Đăng nhập Facebook thành công! 🎉', {
                    duration: 3000,
                    position: 'top-right',
                });
                router.push('/');
            } else {
                setError('Không thể xử lý xác thực Facebook. Vui lòng kiểm tra phản hồi: ' + JSON.stringify(data));
                toast.error('Không thể xử lý xác thực Facebook', {
                    duration: 5000,
                    position: 'top-right',
                });
            }
        } catch (error: unknown) {
            setError(`Lỗi trong quá trình xác thực Facebook: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`);
            toast.error(`Lỗi trong quá trình xác thực: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`, {
                duration: 5000,
                position: 'top-right',
            });
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    useEffect(() => {
        if (code) {
            handleSendCode(code);
        } else {
            setError('Không tìm thấy mã xác thực trong URL');
            setIsLoading(false);
            console.error('Không tìm thấy mã xác thực trong URL');
            toast.error('Không tìm thấy mã xác thực trong URL', {
                duration: 5000,
                position: 'top-right',
            });
        }
    }, [code, router, handleSendCode]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Callback Facebook</h1>
            {error ? (
                <div className="text-red-600 mb-4">{error}</div>
            ) : (
                <p className="text-gray-600">Đang chuyển hướng về ứng dụng...</p>
            )}
        </div>
    );
}

export default function CallbackFacebook() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <CallbackFacebookContent />
        </Suspense>
    );
}