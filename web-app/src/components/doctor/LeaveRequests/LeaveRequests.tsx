"use client";

import React from 'react';
import { Clock, Plus, Edit3, Trash2 } from 'lucide-react';
import { LeaveRequest, StatusType } from '@/hooks/doctor/types';

interface LeaveRequestsProps {
  leaveRequests: LeaveRequest[];
  getStatusColor: (status: StatusType) => string;
  getStatusText: (status: StatusType) => string;
}

const LeaveRequests = ({
  leaveRequests,
  getStatusColor,
  getStatusText,
}: LeaveRequestsProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Đơn xin Nghỉ</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors">
          <Plus size={20} />
          Tạo đơn xin nghỉ
        </button>
      </div>

      <div className="grid gap-4">
        {leaveRequests.map((request) => (
          <div key={request.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Clock className="text-purple-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Đơn xin nghỉ #{request.id}</h3>
                  <p className="text-sm text-gray-500">Ngày tạo: {request.requestDate}</p>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${
                    request.type === 'vacation' ? 'bg-blue-100 text-blue-800' :
                    request.type === 'sick' ? 'bg-red-100 text-red-800' :
                    request.type === 'conference' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {request.type === 'vacation' ? 'Nghỉ phép' :
                     request.type === 'sick' ? 'Nghỉ ốm' :
                     request.type === 'conference' ? 'Hội nghị' : 'Khẩn cấp'}
                  </span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                {getStatusText(request.status)}
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Từ ngày: <span className="font-medium">{request.startDate}</span></p>
                <p className="text-sm text-gray-600">Đến ngày: <span className="font-medium">{request.endDate}</span></p>
                <p className="text-sm text-gray-600">Số ngày: <span className="font-medium">
                  {Math.ceil((new Date(request.endDate).getTime() - new Date(request.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1}
                </span></p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Lý do:</p>
                <p className="text-sm text-gray-800">{request.reason}</p>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Edit3 size={16} />
                Chỉnh sửa
              </button>
              {request.status === 'pending' && (
                <button className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors">
                  <Trash2 size={16} />
                  Hủy đơn
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaveRequests;