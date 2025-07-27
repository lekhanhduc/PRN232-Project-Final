"use client";

import React, { useState, useEffect } from 'react';
import { User, CheckCircle, Clock, Phone, Mail, MapPin, Calendar, UserCheck, FileText, X } from 'lucide-react';
import { 
  DoctorAppointmentResponse, 
  CompleteAppointmentRequest 
} from '@/types/doctorSchedule';
import { PageResponse } from '@/types/pageResponse';
import { 
  doctorScheduleService, 
  DoctorAppointmentFilterRequest 
} from '@/services/doctorScheduleService';
import { toast } from 'react-hot-toast';

interface AppointmentRequestsProps {
  appointmentRequests: DoctorAppointmentResponse[];
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
  getPriorityColor: (priority: string | undefined) => string;
  getPriorityText: (priority: string | undefined) => string;
}

const AppointmentRequests: React.FC<AppointmentRequestsProps> = ({
  appointmentRequests: initialAppointments,
  getStatusColor,
  getStatusText,
  getPriorityColor,
  getPriorityText
}) => {
  const [appointments, setAppointments] = useState<DoctorAppointmentResponse[]>(initialAppointments);
  const [pagination, setPagination] = useState<PageResponse<DoctorAppointmentResponse> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showCompleteModal, setShowCompleteModal] = useState<number | null>(null);
  const [completionNotes, setCompletionNotes] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');

  const [filterRequest, setFilterRequest] = useState<DoctorAppointmentFilterRequest>({
    appointmentDate: undefined,
    status: undefined,
    orderBy: 'appointmentTime',
    page: 1,
    pageSize: 20,
  });

  // Fetch appointments
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await doctorScheduleService.getMyAppointments(filterRequest);
      if (response.code === 200 && response.result) {
        setAppointments(response.result.items);
        setPagination(response.result);
      } else {
        toast.error(response.message || 'Không thể tải danh sách cuộc hẹn');
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Lỗi khi tải danh sách cuộc hẹn');
    } finally {
      setLoading(false);
    }
  };

  // Load appointments when filter changes
  useEffect(() => {
    fetchAppointments();
  }, [filterRequest]);

  // Mark patient as arrived
  const handleMarkArrived = async (appointmentId: number, appointmentDate: string) => {
    // Parse appointment date
    const [year, month, day] = appointmentDate.split('-').map(Number);
    const appointmentDateTime = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if appointment is in the future
    if (appointmentDateTime > today) {
      toast.error('Không thể đánh dấu bệnh nhân có mặt cho cuộc hẹn trong tương lai');
      return;
    }

    if (!window.confirm('Bạn có chắc muốn đánh dấu bệnh nhân này đã có mặt?')) {
      return;
    }

    try {
      const response = await doctorScheduleService.markPatientArrived(appointmentId);
      if (response.code === 200) {
        toast.success(response.message || 'Đã đánh dấu bệnh nhân có mặt');
        fetchAppointments();
      } else {
        toast.error(response.message || 'Không thể đánh dấu bệnh nhân có mặt');
      }
    } catch (error: any) {
      const errorMessage = error.message?.includes('future appointments') 
        ? 'Không thể đánh dấu bệnh nhân có mặt cho cuộc hẹn trong tương lai'
        : error.message || 'Lỗi khi đánh dấu bệnh nhân có mặt';
      toast.error(errorMessage);
      console.error('Error marking patient arrived:', error);
    }
  };

  // Complete an appointment
  const handleCompleteAppointment = async (appointmentId: number) => {
    try {
      const request: CompleteAppointmentRequest = {
        notes: completionNotes.trim() || undefined,
      };
      const response = await doctorScheduleService.completeAppointment(appointmentId, request);
      if (response.code === 200) {
        toast.success(response.message || 'Hoàn thành ca khám thành công');
        setShowCompleteModal(null);
        setCompletionNotes('');
        fetchAppointments();
      } else {
        toast.error(response.message || 'Không thể hoàn thành ca khám');
      }
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi hoàn thành ca khám');
      console.error('Error completing appointment:', error);
    }
  };

  // Handle filter changes
  const handleFilterChange = (field: keyof DoctorAppointmentFilterRequest, value: any) => {
    setFilterRequest((prev) => ({
      ...prev,
      [field]: value,
      page: field === 'page' ? value : 1,
    }));
  };

  // Utility functions
  // Use the passed in utility functions instead of defining them locally

  const formatDate = (dateString: string) => {
    try {
      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day);
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

  const formatTime = (timeString: string) => {
    try {
      const [hours, minutes] = timeString.split(':').map(Number);
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    } catch (error) {
      return timeString;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
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
        <h2 className="text-2xl font-bold text-gray-800">Quản lý Cuộc hẹn</h2>
        <button
          onClick={fetchAppointments}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
          disabled={loading}
        >
          <Calendar size={20} />
          Làm mới
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày hẹn</label>
            <input
              type="date"
              value={filterRequest.appointmentDate || ''}
              onChange={(e) => handleFilterChange('appointmentDate', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
            <select
              value={filterRequest.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tất cả</option>
              <option value="scheduled">Đã đặt lịch</option>
              <option value="arrived">Đã có mặt</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sắp xếp theo</label>
            <select
              value={filterRequest.orderBy || 'appointmentTime'}
              onChange={(e) => handleFilterChange('orderBy', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="appointmentTime">Thời gian hẹn</option>
              <option value="createdAt">Ngày tạo</option>
              <option value="status">Trạng thái</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hiển thị</label>
            <select
              value={filterRequest.pageSize || 20}
              onChange={(e) => handleFilterChange('pageSize', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={10}>10 mục</option>
              <option value={20}>20 mục</option>
              <option value={50}>50 mục</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      {pagination && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2">
              <Calendar className="text-blue-600" size={20} />
              <span className="text-blue-800 font-medium">Tổng: {pagination.totalElements}</span>
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-2">
              <Clock className="text-yellow-600" size={20} />
              <span className="text-yellow-800 font-medium">Đã đặt: {appointments.filter((a) => a.status === 'scheduled').length}</span>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-600" size={20} />
              <span className="text-green-800 font-medium">Hoàn thành: {appointments.filter((a) => a.status === 'completed').length}</span>
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2">
              <UserCheck className="text-purple-600" size={20} />
              <span className="text-purple-800 font-medium">Có mặt: {appointments.filter((a) => a.status === 'arrived').length}</span>
            </div>
          </div>
        </div>
      )}

      {/* Appointments List */}
      <div className="space-y-4">
        {appointments.length === 0 && (
          <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow-sm border border-gray-200">
            <Calendar className="mx-auto mb-2 text-gray-400" size={48} />
            <p>Không có cuộc hẹn phù hợp</p>
          </div>
        )}
        {appointments.map((appointment) => (
          <div key={appointment.appointmentId} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{appointment.patient.fullName}</h3>
                  <p className="text-sm text-gray-500">ID: #{appointment.appointmentId}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                  {getStatusText(appointment.status)}
                </span>
                {appointment.status === 'scheduled' && (
                  <button
                    onClick={() => handleMarkArrived(appointment.appointmentId, appointment.appointmentDate)}
                    className="px-3 py-1 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700 transition-colors flex items-center gap-1"
                  >
                    <UserCheck size={16} />
                    Đánh dấu có mặt
                  </button>
                )}
                {(appointment.status === 'scheduled' || appointment.status === 'arrived') && (
                  <button
                    onClick={() => setShowCompleteModal(appointment.appointmentId)}
                    className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                  >
                    Hoàn thành
                  </button>
                )}
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6 mb-4">
              <div className="space-y-2">
                <h4 className="font-medium text-gray-800">Thông tin bệnh nhân</h4>
                <div className="space-y-1 text-sm">
                  {appointment.patient.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-gray-400" />
                      <span>{appointment.patient.phone}</span>
                    </div>
                  )}
                  {appointment.patient.email && (
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-gray-400" />
                      <span>{appointment.patient.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-400" />
                    <span>Sinh: {formatDate(appointment.patient.dateOfBirth)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-gray-400" />
                    <span>Giới tính: {appointment.patient.gender}</span>
                  </div>
                  {appointment.patient.address && (
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-gray-400" />
                      <span>{appointment.patient.address}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-gray-800">Thông tin cuộc hẹn</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-400" />
                    <span>Ngày: {formatDate(appointment.appointmentDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-gray-400" />
                    <span>Giờ: {formatTime(appointment.appointmentTime)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText size={14} className="text-gray-400" />
                    <span>Lý do khám: {appointment.reasonForVisit}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Phí tư vấn: {formatCurrency(appointment.consultationFee)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Tổng phí: {formatCurrency(appointment.totalFee)}</span>
                  </div>
                  {appointment.servicePackage && (
                    <div className="flex items-center gap-2">
                      <span>Gói dịch vụ: {appointment.servicePackage.packageName}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => handleFilterChange('page', (filterRequest.page || 1) - 1)}
            disabled={pagination.currentPages === 1}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition-colors"
          >
            Trang trước
          </button>
          <span className="text-gray-700">
            Trang {pagination.currentPages} / {pagination.totalPages}
          </span>
          <button
            onClick={() => handleFilterChange('page', (filterRequest.page || 1) + 1)}
            disabled={pagination.currentPages === pagination.totalPages}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition-colors"
          >
            Trang sau
          </button>
        </div>
      )}

      {/* Complete Appointment Modal */}
      {showCompleteModal && (
       <div className="fixed inset-0 z-50 backdrop-blur-sm bg-white/10 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Hoàn thành cuộc hẹn</h3>
              <button
                onClick={() => {
                  setShowCompleteModal(null);
                  setCompletionNotes('');
                }}
                className="text-gray-600 hover:text-gray-800"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú (không bắt buộc)</label>
                <textarea
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập ghi chú cho cuộc hẹn..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowCompleteModal(null);
                    setCompletionNotes('');
                  }}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={() => handleCompleteAppointment(showCompleteModal)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Xác nhận hoàn thành
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentRequests;