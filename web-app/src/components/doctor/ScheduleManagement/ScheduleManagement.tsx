"use client";

import React, { useMemo } from 'react';
import { Calendar, Plus, Search, Edit3, Trash2, CheckCircle } from 'lucide-react';
import { ScheduleItem, StatusType } from '@/hooks/doctor/types';

interface ScheduleManagementProps {
  scheduleData: ScheduleItem[];
  selectedDate: string;
  searchTerm: string;
  filterStatus: StatusType | 'all';
  onDateChange: (date: string) => void;
  onSearchChange: (term: string) => void;
  onFilterChange: (status: StatusType | 'all') => void;
  getStatusColor: (status: StatusType) => string;
  getStatusText: (status: StatusType) => string;
  getPriorityColor: (priority: string) => string;
  getPriorityText: (priority: string) => string;
}

const ScheduleManagement = ({
  scheduleData,
  selectedDate,
  searchTerm,
  filterStatus,
  onDateChange,
  onSearchChange,
  onFilterChange,
  getStatusColor,
  getStatusText,
  getPriorityColor,
  getPriorityText,
}: ScheduleManagementProps) => {
  const filteredScheduleData = useMemo(() => {
    return scheduleData.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.phone.includes(searchTerm);
      const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [scheduleData, searchTerm, filterStatus]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Quản lý Lịch hẹn</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors">
          <Plus size={20} />
          Thêm lịch hẹn
        </button>
      </div>

      <div className="flex gap-4 items-center flex-wrap">
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm theo tên bệnh nhân hoặc số điện thoại..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => onFilterChange(e.target.value as StatusType | 'all')}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="confirmed">Đã xác nhận</option>
          <option value="pending">Chờ xử lý</option>
          <option value="completed">Hoàn thành</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Bệnh nhân</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Khoa</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Thời gian</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Triệu chứng</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Độ ưu tiên</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Trạng thái</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredScheduleData.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{appointment.patientName}</div>
                      <div className="text-sm text-gray-500">{appointment.phone}</div>
                      {appointment.patientAge && (
                        <div className="text-xs text-gray-400">{appointment.patientAge} tuổi</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{appointment.department}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{appointment.time}</div>
                    {appointment.duration && (
                      <div className="text-xs text-gray-500">{appointment.duration} phút</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                    <div className="truncate" title={appointment.symptoms}>{appointment.symptoms}</div>
                  </td>
                  <td className="px-6 py-4">
                    {appointment.priority && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(appointment.priority)}`}>
                        {getPriorityText(appointment.priority)}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                      {getStatusText(appointment.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="text-blue-600 hover:text-blue-800 p-1 rounded">
                        <Edit3 size={16} />
                      </button>
                      <button className="text-red-600 hover:text-red-800 p-1 rounded">
                        <Trash2 size={16} />
                      </button>
                      {appointment.status === 'confirmed' && (
                        <button className="text-green-600 hover:text-green-800 p-1 rounded">
                          <CheckCircle size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredScheduleData.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Không tìm thấy lịch hẹn nào phù hợp với bộ lọc
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleManagement;