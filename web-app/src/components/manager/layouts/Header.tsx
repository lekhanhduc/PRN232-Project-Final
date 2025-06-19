'use client'
import { Bell, Settings, LogOut, Calendar, Activity, User } from 'lucide-react';

export const Header = () => {
    return (
        <div className="bg-white shadow-sm border-b border-slate-200">
            <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <Activity className="w-8 h-8 text-slate-600" />
                            <h1 className="text-2xl font-bold text-slate-800">Quản lý Hệ thống</h1>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                            <Calendar className="w-4 h-4" />
                            <span>Hôm nay: {new Date().toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-slate-500" />
                            <span className="text-sm text-slate-600">Quản lý</span>
                        </div>
                        <Bell className="w-5 h-5 text-slate-500 cursor-pointer hover:text-slate-700 transition-colors" />
                        <Settings className="w-5 h-5 text-slate-500 cursor-pointer hover:text-slate-700 transition-colors" />
                        <LogOut className="w-5 h-5 text-slate-500 cursor-pointer hover:text-slate-700 transition-colors" />
                    </div>
                </div>
            </div>
        </div>
    );
}; 