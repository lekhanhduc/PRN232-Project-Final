"use client";

import React, { useState, useMemo, useEffect } from 'react';
import ScheduleManagement from '@/components/doctor/ScheduleManagement/ScheduleManagement';
import AppointmentRequests from '@/components/doctor/AppointmentRequests/AppointmentRequests';
import LeaveRequests from '@/components/doctor/LeaveRequests/LeaveRequests';
import Profile from '@/components/doctor/Profile/Profile';
import Sidebar from '@/components/doctor/Sidebar/Sidebar';
import { Calendar, Users, Clock, User } from 'lucide-react';
import { doctorScheduleService, DoctorScheduleFilterRequest, DoctorAppointmentFilterRequest } from '@/services/doctorScheduleService';
import {
  WorkScheduleResponse,
  DoctorAppointmentResponse,
  LeaveResponse,
} from '@/types/doctorSchedule';
import { toast } from 'react-hot-toast';

// Component types
interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

interface ScheduleManagementProps {
  scheduleData: WorkScheduleResponse[];
  selectedDate: string;
  searchTerm: string;
  filterStatus: string;
  onDateChange: (date: string) => void;
  onSearchChange: (term: string) => void;
  onFilterChange: (status: string | undefined) => void;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
  getPriorityColor: (priority: string | undefined) => string;
  getPriorityText: (priority: string | undefined) => string;
}

interface AppointmentRequestsProps {
  appointmentRequests: DoctorAppointmentResponse[];
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
  getPriorityColor: (priority: string | undefined) => string;
  getPriorityText: (priority: string | undefined) => string;
}

interface LeaveRequestsProps {
  onSuccess: () => void;
}

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('schedule');
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // "YYYY-MM-DD"
  });
  const [searchTerm, setSearchTerm] = useState('');
  type StatusFilter = 'all' | 'confirmed' | 'pending' | 'completed' | 'approved' | 'rejected' | 'cancelled';
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('all');

  const [scheduleData, setScheduleData] = useState<WorkScheduleResponse[]>([]);
  const [appointmentRequests, setAppointmentRequests] = useState<DoctorAppointmentResponse[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Handle filter status change
  const handleFilterStatusChange = (status: string | undefined) => {
    setFilterStatus(status as StatusFilter || 'all');
  };

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch schedule
        const scheduleFilter: DoctorScheduleFilterRequest = {
          fromDate: selectedDate,
          toDate: selectedDate,
          includeTimeSlots: true,
        };
        const scheduleResponse = await doctorScheduleService.getMyWorkSchedule(scheduleFilter);
        if (scheduleResponse.code === 200 && scheduleResponse.result) {
          setScheduleData(scheduleResponse.result);
        } else {
          toast.error(scheduleResponse.message || 'Không thể tải lịch làm việc');
        }

        // Fetch appointments
        const appointmentFilter: DoctorAppointmentFilterRequest = {
          appointmentDate: selectedDate,
          status: filterStatus === 'all' ? undefined : filterStatus,
          page: 1,
          pageSize: 100,
        };
        const appointmentResponse = await doctorScheduleService.getMyAppointments(appointmentFilter);
        if (appointmentResponse.code === 200 && appointmentResponse.result) {
          setAppointmentRequests(appointmentResponse.result.items);
        } else {
          toast.error(appointmentResponse.message || 'Không thể tải yêu cầu khám bệnh');
        }

        // TODO: Implement leave requests API
        setLeaveRequests([]);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
        toast.error('Đã xảy ra lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDate, filterStatus]);

  // Component props types
  interface AppointmentRequestsProps {
    appointmentRequests: DoctorAppointmentResponse[];
    getStatusColor: (status: string) => string;
    getStatusText: (status: string) => string;
    getPriorityColor: (priority: string | undefined) => string;
    getPriorityText: (priority: string | undefined) => string;
  }

  interface LeaveRequestsProps {
    onSuccess: () => void;
  }

  const menuItems: MenuItem[] = [
    { id: 'schedule', label: 'Quản lý Lịch hẹn', icon: Calendar },
    { id: 'appointments', label: 'Yêu cầu Khám bệnh', icon: Users },
    { id: 'leave', label: 'Đơn xin Nghỉ', icon: Clock },
    { id: 'profile', label: 'Hồ sơ Cá nhân', icon: User },
  ];

  const getStatusColor = (status: string): string => {
    const statusMap: Record<string, string> = {
      confirmed: 'text-green-600 bg-green-100',
      pending: 'text-yellow-600 bg-yellow-100',
      completed: 'text-blue-600 bg-blue-100',
      approved: 'text-green-600 bg-green-100',
      rejected: 'text-red-600 bg-red-100',
      cancelled: 'text-gray-600 bg-gray-100'
    };
    return statusMap[status.toLowerCase()] || 'text-gray-600 bg-gray-100';
  };

  const getStatusText = (status: string): string => {
    const statusTextMap: Record<string, string> = {
      confirmed: 'Đã xác nhận',
      pending: 'Chờ xử lý',
      completed: 'Hoàn thành',
      approved: 'Đã duyệt',
      rejected: 'Từ chối',
      cancelled: 'Đã hủy'
    };
    return statusTextMap[status.toLowerCase()] || status;
  };

  const getPriorityColor = (priority: string | undefined): string => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityText = (priority: string | undefined): string => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'Cao';
      case 'medium':
        return 'Trung bình';
      case 'low':
        return 'Thấp';
      default:
        return 'Không xác định';
    }
  };

  const renderContent = () => {
    const scheduleManagementProps = {
      scheduleData,
      selectedDate,
      searchTerm,
      filterStatus,
      onDateChange: setSelectedDate,
      onSearchChange: setSearchTerm,
      onFilterChange: handleFilterStatusChange,
      getStatusColor,
      getStatusText,
      getPriorityColor,
      getPriorityText
    };

    switch (activeTab) {
      case 'schedule':
        return <ScheduleManagement {...scheduleManagementProps} />;
      case 'appointments':
        return (
          <AppointmentRequests
            appointmentRequests={appointmentRequests}
            getStatusColor={getStatusColor}
            getStatusText={getStatusText}
            getPriorityColor={getPriorityColor}
            getPriorityText={getPriorityText}
          />
        );
      case 'leave':
        return (
          <LeaveRequests
            onSuccess={() => {
              const fetchData = async () => {
                try {
                  const appointmentFilter: DoctorAppointmentFilterRequest = {
                    appointmentDate: selectedDate,
                    status: filterStatus === 'all' ? undefined : filterStatus,
                    page: 1,
                    pageSize: 100,
                  };
                  const appointmentResponse = await doctorScheduleService.getMyAppointments(appointmentFilter);
                  if (appointmentResponse.code === 200 && appointmentResponse.result) {
                    setAppointmentRequests(appointmentResponse.result.items);
                  }
                } catch (error) {
                  console.error('Error refreshing appointments:', error);
                }
              };
              fetchData();
            }}
          />
        );
      case 'profile':
        return <Profile />;
      default:
        return <ScheduleManagement {...scheduleManagementProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar menuItems={menuItems} activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1 min-h-screen">
          <main className="p-6">
            {loading ? (
              <div className="text-center text-gray-500 py-8">Đang tải dữ liệu...</div>
            ) : renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;