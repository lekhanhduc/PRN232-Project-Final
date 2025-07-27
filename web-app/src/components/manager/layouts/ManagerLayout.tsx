'use client'
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/manager/layouts/Header';
import { Sidebar } from './Sidebar';

interface ManagerLayoutProps {
    children: React.ReactNode;
}

export const ManagerLayout = ({ children }: ManagerLayoutProps) => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const pathname = usePathname();

    // Xác định active tab dựa trên pathname
    useEffect(() => {
        const path = pathname.split('/').pop() || 'dashboard';
        setActiveTab(path === 'manager' ? 'dashboard' : path);
    }, [pathname]);

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />
            <div className="flex">
                <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
                <main className="flex-1 p-6">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}; 