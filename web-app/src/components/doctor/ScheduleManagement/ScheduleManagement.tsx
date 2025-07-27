"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Search, Clock, User, Calendar } from 'lucide-react';
import { WorkScheduleResponse, CompleteAppointmentRequest } from '@/types/doctorSchedule';
import { doctorScheduleService, DoctorScheduleFilterRequest } from '@/services/doctorScheduleService';
import { toast } from 'react-hot-toast';

interface ScheduleManagementProps {
  scheduleData: WorkScheduleResponse[];
  selectedDate: string;
  searchTerm: string;
  filterStatus: string | undefined;
  onDateChange: (date: string) => void;
  onSearchChange: (term: string) => void;
  onFilterChange: (status: string | undefined) => void;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
  getPriorityColor: (priority: string | undefined) => string;
  getPriorityText: (priority: string | undefined) => string;
}

const ScheduleManagement = ({
  scheduleData: initialScheduleData,
  selectedDate: initialSelectedDate,
  searchTerm: initialSearchTerm,
  filterStatus: initialFilterStatus,
  onDateChange,
  onSearchChange,
  onFilterChange,
  getStatusColor,
  getStatusText,
  getPriorityColor,
  getPriorityText,
}: ScheduleManagementProps) => {
  const [scheduleData, setScheduleData] = useState<WorkScheduleResponse[]>(initialScheduleData);
  const [selectedDate, setSelectedDate] = useState<string>(initialSelectedDate);
  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
  const [loading, setLoading] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null); // Track loading for specific actions
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [dateRange, setDateRange] = useState<DoctorScheduleFilterRequest>({
    fromDate: '',
    toDate: '',
    includeTimeSlots: true,
  });

  // Update local state when props change
  useEffect(() => {
    setScheduleData(initialScheduleData);
  }, [initialScheduleData]);

  useEffect(() => {
    setSelectedDate(initialSelectedDate);
  }, [initialSelectedDate]);

  useEffect(() => {
    setSearchTerm(initialSearchTerm);
  }, [initialSearchTerm]);

  // Fetch schedule data
  const fetchScheduleData = async () => {
    setLoading(true);
    try {
      const response = await doctorScheduleService.getMyWorkSchedule({
        fromDate: dateRange.fromDate || undefined,
        toDate: dateRange.toDate || undefined,
        includeTimeSlots: true
      });
      if (response.code === 200 && response.result) {
        setScheduleData(response.result);
      } else {
        toast.error(response.message || 'Không thể tải lịch làm việc');
      }
    } catch (error: any) {
      console.error('Error fetching schedule:', error);
      toast.error(error.message || 'Lỗi khi tải lịch làm việc');
    } finally {
      setLoading(false);
    }
  };

  // Load data when dateRange changes
  useEffect(() => {
    if (dateRange.fromDate || dateRange.toDate) {
      fetchScheduleData();
    }
  }, [dateRange]);

  // Handle marking patient as arrived
  const handleMarkPatientArrived = async (appointmentId: number) => {
    setActionLoading(appointmentId);
    try {
      const response = await doctorScheduleService.markPatientArrived(appointmentId);
      if (response.code === 200) {
        toast.success(response.message || 'Đã đánh dấu bệnh nhân đã đến');
        await fetchScheduleData(); // Refresh schedule data
      } else {
        toast.error(response.message || 'Không thể đánh dấu bệnh nhân đã đến');
      }
    } catch (error: any) {
      console.error('Error marking patient arrived:', error);
      toast.error(error.message || 'Lỗi khi đánh dấu bệnh nhân có mặt');
    } finally {
      setActionLoading(null);
    }
  };

  // Handle completing an appointment
  const handleCompleteAppointment = async (appointmentId: number) => {
    setActionLoading(appointmentId);
    try {
      const request: CompleteAppointmentRequest = {};
      const response = await doctorScheduleService.completeAppointment(appointmentId, request);
      if (response.code === 200) {
        toast.success(response.message || 'Hoàn thành ca khám thành công');
        await fetchScheduleData(); // Refresh schedule data
      } else {
        toast.error(response.message || 'Không thể hoàn thành ca khám');
      }
    } catch (error: any) {
      console.error('Error completing appointment:', error);
      toast.error(error.message || 'Lỗi khi hoàn thành ca khám');
    } finally {
      setActionLoading(null);
    }
  };

  // Filter data by date, search term, and status
  const filteredScheduleData = scheduleData.filter((item) => {
    // First check the date filter as it's the simplest
    if (selectedDate && item.workDate !== selectedDate) {
      return false;
    }

    // If there's no search or status filter, we can return true early
    if (!searchTerm && (!initialFilterStatus || initialFilterStatus === 'all')) {
      return true;
    }

    // Check if any time slot matches our search and status criteria
    return item.timeSlots.some((slot) => {
      // Status check
      const statusMatches = 
        !initialFilterStatus || 
        initialFilterStatus === 'all' || 
        slot.appointment?.status === initialFilterStatus;

      // If we're not searching, we only care about status
      if (!searchTerm) {
        return statusMatches;
      }

      // Search check - only if we have an appointment
      if (!slot.appointment) {
        return false;
      }

      const searchLower = searchTerm.toLowerCase();
      const nameMatches = slot.appointment.patient.fullName.toLowerCase().includes(searchLower);
      const phoneMatches = slot.appointment.patient.phone.includes(searchTerm);

      // Both search and status must match
      return (nameMatches || phoneMatches) && statusMatches;
    });
  });

  const handleDateRangeChange = (field: keyof DoctorScheduleFilterRequest, value: string | boolean) => {
    setDateRange((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSelectedDateChange = (date: string) => {
    setSelectedDate(date);
    onDateChange(date);
  };

  const handleSearchTermChange = (term: string) => {
    setSearchTerm(term);
    onSearchChange(term);
  };

  const handleStatusFilterChange = (status: string) => {
    onFilterChange(status === 'all' ? undefined : status);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      return dateString;
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    return timeString.substring(0, 5); // Lấy HH:MM từ HH:MM:SS
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
        <h2 className="text-2xl font-bold text-gray-800">Thời khóa biểu lịch hẹn</h2>
        <button
          onClick={fetchScheduleData}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
          disabled={loading}
          aria-label="Làm mới lịch làm việc"
        >
          <Plus size={20} />
          Làm mới
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
            <input
              type="date"
              value={dateRange.fromDate || ''}
              onChange={(e) => handleDateRangeChange('fromDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-describedby="from-date-help"
            />
            <span id="from-date-help" className="sr-only">Chọn ngày bắt đầu để lọc lịch làm việc</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
            <input
              type="date"
              value={dateRange.toDate || ''}
              onChange={(e) => handleDateRangeChange('toDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-describedby="to-date-help"
            />
            <span id="to-date-help" className="sr-only">Chọn ngày kết thúc để lọc lịch làm việc</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lọc ngày cụ thể</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleSelectedDateChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-describedby="selected-date-help"
            />
            <span id="selected-date-help" className="sr-only">Chọn ngày cụ thể để lọc lịch làm việc</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
            <select
              value={initialFilterStatus || 'all'}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-describedby="status-filter-help"
            >
              <option value="all">Tất cả</option>
              <option value="scheduled">Đã xếp lịch</option>
              <option value="arrived">Đã đến</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
            <span id="status-filter-help" className="sr-only">Lọc lịch hẹn theo trạng thái</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Tìm bệnh nhân..."
                value={searchTerm}
                onChange={(e) => handleSearchTermChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                aria-label="Tìm kiếm bệnh nhân theo tên hoặc số điện thoại"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2">
            <Calendar className="text-blue-600" size={20} />
            <span className="text-blue-800 font-medium">
              Tổng ngày làm việc: {scheduleData.length || 0}
            </span>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2">
            <User className="text-green-600" size={20} />
            <span className="text-green-800 font-medium">
              Tổng lịch hẹn: {scheduleData.reduce((total, schedule) => 
                total + schedule.timeSlots.filter(slot => !slot.isAvailable).length, 0
              )}
            </span>
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-2">
            <Clock className="text-yellow-600" size={20} />
            <span className="text-yellow-800 font-medium">
              Slot trống: {scheduleData.reduce((total, schedule) => 
                total + schedule.timeSlots.filter(slot => slot.isAvailable).length, 0
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Schedule Display */}
      <div className="space-y-4">
        {scheduleData.length === 0 && (
          <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow-sm border border-gray-200">
            <Calendar className="mx-auto mb-2 text-gray-400" size={48} />
            <p>Không có lịch làm việc phù hợp</p>
          </div>
        )}
        {scheduleData.map((schedule) => (
          <div key={schedule.scheduleId} className="border border-gray-200 rounded-xl shadow-sm p-6 bg-white">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <Calendar className="text-blue-600" size={20} />
                  {formatDate(schedule.workDate)}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Ca làm việc: {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)} | Tối đa: {schedule.maxPatients} bệnh nhân
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    schedule.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {schedule.isAvailable ? 'Có sẵn' : 'Không sẵn sàng'}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {schedule.timeSlots.map((slot) => (
                <div
                  key={slot.slotId}
                  className={`p-4 rounded-lg border cursor-pointer transition hover:shadow-md ${
                    slot.isAvailable ? 'border-gray-200 bg-gray-50' : 'border-blue-200 bg-blue-50'
                  }`}
                  onClick={() => {
                    if (!slot.isAvailable && slot.appointment) {
                      setSelectedAppointment(slot);
                      setShowDetailModal(true);
                    }
                  }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">{slot.slotTimeFormatted || formatTime(slot.slotTime)}</p>
                      {slot.appointment && (
                        <>
                          <p className="text-sm text-gray-600">Bệnh nhân: {slot.appointment.patient.fullName}</p>
                          <p className="text-sm text-gray-600">SĐT: {slot.appointment.patient.phone}</p>
                          <span
                            className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${getStatusColor(
                              slot.appointment.status || 'pending'
                            )}`}
                          >
                            {getStatusText(slot.appointment.status || 'pending')}
                          </span>
                          {/* {slot.appointment.priority && (
                            <span
                              className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ml-2 ${getPriorityColor(
                                slot.appointment.priority
                              )}`}
                            >
                              {getPriorityText(slot.appointment.priority)}
                            </span>
                          )} */}
                        </>
                      )}
                    </div>
                    {!slot.isAvailable && slot.appointment && (
                      <div className="flex gap-2">
                        {slot.appointment.status === 'scheduled' && (
                          <button
                            onClick={() => slot.appointment && handleMarkPatientArrived(slot.appointment.appointmentId)}
                            className="px-3 py-1 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700 disabled:opacity-50"
                            disabled={actionLoading === slot.appointment.appointmentId}
                            aria-label={`Đánh dấu bệnh nhân đã đến cho lịch hẹn ${slot.appointment.appointmentId}`}
                          >
                            {actionLoading === slot.appointment.appointmentId ? 'Đang xử lý...' : 'Đánh dấu đã đến'}
                          </button>
                        )}
                        {(slot.appointment.status === 'scheduled' || slot.appointment.status === 'arrived') && (
                          <button
                            onClick={() => slot.appointment && handleCompleteAppointment(slot.appointment.appointmentId)}
                            className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-50"
                            disabled={actionLoading === slot.appointment.appointmentId}
                            aria-label={`Hoàn thành lịch hẹn ${slot.appointment.appointmentId}`}
                          >
                            {actionLoading === slot.appointment.appointmentId ? 'Đang xử lý...' : 'Hoàn thành'}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleManagement;