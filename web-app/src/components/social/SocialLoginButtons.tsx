'use client'
import React from 'react';
import { GoogleConfiguration } from '@/configuration/GoogleConfiguration';
import { FacebookConfiguration } from '@/configuration/FacebookConfiguration';

interface SocialLoginButtonsProps {
    isLoading?: boolean;
    showDivider?: boolean;
    dividerText?: string;
}

const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
    isLoading = false,
    dividerText = "Hoặc đăng nhập bằng"
}) => {
    const handleGoogleLogin = () => {
        const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GoogleConfiguration.client_id}&redirect_uri=${GoogleConfiguration.redirect_uri}&response_type=${GoogleConfiguration.response_type}&scope=${GoogleConfiguration.scope}&prompt=consent`;
        window.location.href = url;
    };

    const handleFacebookLogin = () => {
        const url = `https://www.facebook.com/v23.0/dialog/oauth?client_id=${FacebookConfiguration.client_id}&redirect_uri=${FacebookConfiguration.redirect_uri}&response_type=${FacebookConfiguration.response_type}&scope=${FacebookConfiguration.scope}`;
        window.location.href = url;
    };

    return (
        <>

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">{dividerText}</span>
                </div>
            </div>

            <div className="space-y-3">
                <button
                    type="button"
                    disabled={isLoading}
                    className="cursor-pointer w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleGoogleLogin}
                >
                    <GoogleIcon />
                    Tiếp tục với Google
                </button>

                <button
                    type="button"
                    disabled={isLoading}
                    className="cursor-pointer w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleFacebookLogin}
                >
                    <FacebookIcon />
                    Tiếp tục với Facebook
                </button>
            </div>
        </>
    );
};

const GoogleIcon: React.FC = () => (
    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
);

const FacebookIcon: React.FC = () => (
    <svg className="w-5 h-5 mr-3" fill="#1877F2" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
);

export default SocialLoginButtons;