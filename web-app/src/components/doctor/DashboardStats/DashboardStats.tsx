"use client";

import React from 'react';
import { Calendar, CheckCircle, Clock, Users, TrendingUp, Activity, AlertCircle } from 'lucide-react';
import { DashboardStats } from '@/hooks/doctor/types';

interface DashboardStatsProps {
  dashboardStats: DashboardStats;
}

const DashboardStats = ({ dashboardStats }: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Lịch hẹn hôm nay</p>
            <p className="text-3xl font-bold text-gray-900">{dashboardStats.todayAppointments}</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Calendar className="text-blue-600" size={24} />
          </div>
        </div>
        <div className="flex items-center mt-4 text-sm">
          <TrendingUp className="text-green-500 mr-1" size={16} />
          <span className="text-green-600">+12% so với hôm qua</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Đã hoàn thành</p>
            <p className="text-3xl font-bold text-gray-900">{dashboardStats.completedToday}</p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <CheckCircle className="text-green-600" size={24} />
          </div>
        </div>
        <div className="flex items-center mt-4 text-sm">
          <Activity className="text-blue-500 mr-1" size={16} />
          <span className="text-gray-600">{Math.round((dashboardStats.completedToday / dashboardStats.todayAppointments) * 100)}% tỷ lệ hoàn thành</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Yêu cầu chờ xử lý</p>
            <p className="text-3xl font-bold text-gray-900">{dashboardStats.pendingRequests}</p>
          </div>
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Clock className="text-yellow-600" size={24} />
          </div>
        </div>
        <div className="flex items-center mt-4 text-sm">
          <AlertCircle className="text-yellow-500 mr-1" size={16} />
          <span className="text-yellow-600">Cần xử lý trong hôm nay</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Sắp tới</p>
            <p className="text-3xl font-bold text-gray-900">{dashboardStats.upcomingAppointments}</p>
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Users className="text-purple-600" size={24} />
          </div>
        </div>
        <div className="flex items-center mt-4 text-sm">
          <Clock className="text-purple-500 mr-1" size={16} />
          <span className="text-gray-600">Trong tuần này</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;