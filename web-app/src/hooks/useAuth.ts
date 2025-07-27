'use client';

import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

interface AuthUser {
    id: number;
    email: string;
    role: string;
}

export const useAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<AuthUser | null>(null);

    const parseToken = (token: string | null) => {
        if (!token) return null;
        try {
            const decoded = jwtDecode<any>(token);
            return {
                id: decoded.userId,
                email: decoded.email,
                role: decoded.role
            };
        } catch (error) {
            console.error('Error parsing token:', error);
            return null;
        }
    };

    const checkAuthStatus = () => {
        const token = localStorage.getItem('accessToken');
        const userData = parseToken(token);
        setIsLoggedIn(!!token && !!userData);
        setUser(userData);
        setLoading(false);
    };

    useEffect(() => {
        checkAuthStatus();

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'accessToken') {
                checkAuthStatus();
            }
        };

        const handleAuthChange = () => {
            checkAuthStatus();
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('authChange', handleAuthChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('authChange', handleAuthChange);
        };
    }, []);

    const login = (userData?: any) => {
        setIsLoggedIn(true);
        checkAuthStatus(); // Check auth status to update user info
        window.dispatchEvent(new CustomEvent('authChange'));
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setIsLoggedIn(false);
        setUser(null);
        window.dispatchEvent(new CustomEvent('authChange'));
    };

    return {
        isLoggedIn,
        loading,
        login,
        logout,
        checkAuthStatus,
        user
    };
};
