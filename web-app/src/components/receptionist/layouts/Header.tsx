'use client'
import { Bell, Settings, LogOut, Calendar, Activity } from 'lucide-react';

export const Header = () => {
    return (
        <div className="bg-white shadow-sm border-b">
            <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <Activity className="w-8 h-8 text-blue-600" />
                            <h1 className="text-2xl font-bold text-gray-900">Hệ thống Lễ tân</h1>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>Hôm nay: {new Date().toLocaleDateString('vi-VN')}</span>
                        </div>
                        <Bell className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
                        <Settings className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
                        <LogOut className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
                    </div>
                </div>
            </div>
        </div>
    );
};