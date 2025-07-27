"use client";

import React, { useState, useEffect } from 'react';
import { Clock, Plus, X, Calendar, FileText } from 'lucide-react';
import { LeaveResponse, LeaveRequestPayload } from '@/types/doctorSchedule';
import { doctorScheduleService } from '@/services/doctorScheduleService';
import { toast } from 'react-hot-toast';

interface LeaveRequestsProps {
  leaveRequests: LeaveResponse[];
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
}

const LeaveRequests = ({ leaveRequests: initialLeaveRequests, getStatusColor, getStatusText }: LeaveRequestsProps) => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveResponse[]>(initialLeaveRequests);
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    leaveDate: '',
    reason: '',
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  // Update local state when prop changes
  useEffect(() => {
    setLeaveRequests(initialLeaveRequests);
  }, [initialLeaveRequests]);

  // Fetch leave requests
  const fetchLeaveRequests = async () => {
    setLoading(true);
    try {
      const response = await doctorScheduleService.getMyLeaves();
      if (response.code === 200 && response.result) {
        setLeaveRequests(response.result);
      } else {
        toast.error(response.message || 'Không thể tải danh sách đơn nghỉ');
      }
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      toast.error('Lỗi khi tải danh sách đơn nghỉ');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.leaveDate || !formData.reason.trim()) {
      toast.error('Vui lòng nhập đầy đủ thông tin');
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
        reason: formData.reason,
      };
      const response = await doctorScheduleService.requestLeave(payload);
      if (response.code === 200) {
        toast.success(response.message || 'Gửi đơn nghỉ thành công');
        setShowModal(false);
        setFormData({ leaveDate: '', reason: '' });
        fetchLeaveRequests();
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
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN');
  };

  const getRequestStatus = (request: LeaveResponse) => {
    return request.requestedAt ? 'approved' : 'pending';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Đơn xin Nghỉ</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
          disabled={loading}
        >
          <Plus size={20} />
          Tạo đơn xin nghỉ
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2">
            <FileText className="text-blue-600" size={20} />
            <span className="text-blue-800 font-medium">Tổng đơn: {leaveRequests.length}</span>
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-2">
            <Clock className="text-yellow-600" size={20} />
            <span className="text-yellow-800 font-medium">Đang chờ: {leaveRequests.filter((req) => !req.requestedAt).length}</span>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2">
            <Clock className="text-green-600" size={20} />
            <span className="text-green-800 font-medium">Đã duyệt: {leaveRequests.filter((req) => req.requestedAt).length}</span>
          </div>
        </div>
      </div>

      {/* Leave Requests List */}
      <div className="space-y-4">
        {leaveRequests.length === 0 && (
          <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow-sm border border-gray-200">
            <FileText className="mx-auto mb-2 text-gray-400" size={48} />
            <p>Không có đơn xin nghỉ nào</p>
          </div>
        )}
        {leaveRequests.map((request) => (
          <div
            key={request.leaveId}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Calendar className="text-blue-600" size={20} />
                  {formatDate(request.leaveDate)}
                </h3>
                <p className="text-sm text-gray-600 mt-1">Lý do: {request.reason}</p>
                <p className="text-sm text-gray-600">Gửi lúc: {formatDateTime(request.requestedAt)}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(getRequestStatus(request))}`}
              >
                {getStatusText(getRequestStatus(request))}
              </span>
            </div>
          </div>
        ))}
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