import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    icon?: LucideIcon;
    disabled?: boolean;
    className?: string;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    icon: Icon,
    disabled = false,
    className = ''
}) => {
    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-white/10 border border-white/20 text-white hover:bg-white/20',
        success: 'bg-green-500 text-white hover:bg-green-600',
        danger: 'bg-red-500 text-white hover:bg-red-600',
        outline: 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50'
    };

    const sizes = {
        sm: 'px-3 py-2 text-sm',
        md: 'px-6 py-3',
        lg: 'px-8 py-4 text-lg'
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
          flex items-center gap-2 rounded-xl font-medium transition-all
          ${variants[variant]}
          ${sizes[size]}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
        >
            {Icon && <Icon className="w-5 h-5" />}
            {children}
        </button>
    );
};