'use client'
import React from 'react';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'success' | 'warning';
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary', className = '' }) => {
    const variants = {
        primary: 'bg-blue-100 text-blue-800',
        secondary: 'bg-slate-100 text-slate-800',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800'
    };

    return (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};