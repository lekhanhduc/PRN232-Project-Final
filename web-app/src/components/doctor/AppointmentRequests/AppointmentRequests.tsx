"use client";

import React from 'react';
import {User, CheckCircle, XCircle, Edit3 } from 'lucide-react';
import { AppointmentRequest, StatusType } from '@/hooks/doctor/types';


interface AppointmentRequestsProps {
  appointmentRequests: AppointmentRequest[];
  getStatusColor: (status: StatusType) => string;
  getStatusText: (status: StatusType) => string;
  getPriorityColor: (priority: string) => string;
  getPriorityText: (priority: string) => string;
}

const AppointmentRequests = ({
  appointmentRequests,
  getStatusColor,
  getStatusText,
  getPriorityColor,
  getPriorityText,
}: AppointmentRequestsProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Yêu cầu Khám bệnh</h2>
        <div className="flex gap-2">
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
            {appointmentRequests.filter(req => req.status === 'pending').length} yêu cầu chờ xử lý
          </span>
          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
            {appointmentRequests.filter(req => req.urgency === 'high').length} khẩn cấp
          </span>
        </div>
      </div>

      <div className="grid gap-4">
        {appointmentRequests.map((request) => (
          <div key={request.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{request.patientName}</h3>
                  <p className="text-sm text-gray-500">{request.phone}</p>
                  {request.patientAge && (
                    <p className="text-xs text-gray-400">{request.patientAge} tuổi</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {request.urgency && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.urgency)}`}>
                    {getPriorityText(request.urgency)}
                  </span>
                )}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                  {getStatusText(request.status)}
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Ngày yêu cầu: <span className="font-medium">{request.requestDate}</span></p>
                <p className="text-sm text-gray-600">Thời gian mong muốn: <span className="font-medium">{request.requestedTime}</span></p>
                <p className="text-sm text-gray-600">Khoa: <span className="font-medium">{request.department}</span></p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Triệu chứng:</p>
                <p className="text-sm text-gray-800">{request.symptoms}</p>
              </div>
            </div>

            {request.status === 'pending' && (
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <CheckCircle size={16} />
                  Chấp nhận
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  <XCircle size={16} />
                  Từ chối
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Edit3 size={16} />
                  Đề xuất thời gian khác
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppointmentRequests;