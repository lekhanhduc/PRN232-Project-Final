"use client";

import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { doctorScheduleService } from '@/services/doctorScheduleService';
import { toast } from 'react-hot-toast';

import { LeaveResponse } from '@/types/doctorSchedule';

import { LeaveRequestPayload } from '@/types/doctorSchedule';

interface LeaveRequestsProps {
  onSuccess?: () => void;
}

const LeaveRequests = ({ onSuccess }: LeaveRequestsProps) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    leaveDate: '',
    reason: '',
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [leaveRequests, setLeaveRequests] = useState<LeaveResponse[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      setLoading(true);
      try {
        const response = await doctorScheduleService.getMyLeaves();
        if (response.code === 200 && response.result) {
          setLeaveRequests(response.result);
        } else {
          toast.error(response.message || 'Không thể tải danh sách đơn xin nghỉ');
        }
      } catch (error: any) {
        console.error('Error fetching leave requests:', error);
        toast.error('Lỗi khi tải danh sách đơn xin nghỉ');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveRequests();
  }, []);

  const handleSubmit = async () => {
    if (!formData.leaveDate) {
      toast.error('Vui lòng chọn ngày nghỉ');
      return;
    }

    const leaveDate = new Date(formData.leaveDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (leaveDate <= today) {
      toast.error('Ngày nghỉ phải sau ngày hôm nay');
      return;
    }

    setSubmitLoading(true);
    try {
      const payload: LeaveRequestPayload = {
        leaveDate: formData.leaveDate,
        reason: formData.reason.trim() || '',
      };
      
      const response = await doctorScheduleService.requestLeave(payload);
      if (response.code === 200) {
        toast.success(response.message || 'Gửi đơn nghỉ thành công');
        setShowModal(false);
        setFormData({ leaveDate: '', reason: '' });
        
        // Refresh leave requests list
        const updatedResponse = await doctorScheduleService.getMyLeaves();
        if (updatedResponse.code === 200 && updatedResponse.result) {
          setLeaveRequests(updatedResponse.result);
        }
        
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error(response.message || 'Gửi đơn nghỉ thất bại');
      }
    } catch (error: any) {
      toast.error(error.message || 'Đã xảy ra lỗi khi gửi đơn');
      console.error('Error:', error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch (error) {
      return dateString;
    }
  };

  if (submitLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Danh sách đơn xin nghỉ</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Tạo đơn xin nghỉ
        </button>
      </div>

      {/* Hardcoded Leave Requests List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày nghỉ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lý do
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày tạo
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leaveRequests.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                  Không có đơn xin nghỉ nào
                </td>
              </tr>
            ) : (
              leaveRequests.map((leave) => (
                <tr key={leave.leaveId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(leave.leaveDate)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {leave.reason || 'Không có lý do'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDateTime(leave.requestedAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Creating Leave Request */}
      {showModal && (
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-white/10 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Tạo đơn xin nghỉ</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-600 hover:text-gray-800">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày nghỉ</label>
                <input
                  type="date"
                  name="leaveDate"
                  value={formData.leaveDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lý do</label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập lý do xin nghỉ..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={submitLoading}
                >
                  {submitLoading ? 'Đang gửi...' : 'Gửi đơn'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveRequests;