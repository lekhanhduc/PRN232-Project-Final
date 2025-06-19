"use client";

import React from 'react';
import { User, Bell } from 'lucide-react';
import { DashboardStats } from '@/hooks/doctor/types';

interface HeaderProps {
  dashboardStats: DashboardStats;
  doctorName: string;
  showNotifications: boolean;
  onToggleNotifications: () => void;
}

const Header = ({ dashboardStats, doctorName, showNotifications, onToggleNotifications }: HeaderProps) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Bác sĩ</h1>
          <p className="text-gray-600">Hôm nay: {new Date().toLocaleDateString('vi-VN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={onToggleNotifications}
            className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bell size={20} />
            {dashboardStats.pendingRequests > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {dashboardStats.pendingRequests}
              </span>
            )}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="text-white" size={16} />
            </div>
            <span className="text-sm font-medium text-gray-700">{doctorName}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;