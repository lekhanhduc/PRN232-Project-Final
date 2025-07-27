"use client";

import React, { useState, useMemo, useEffect } from 'react';
import ScheduleManagement from '@/components/doctor/ScheduleManagement/ScheduleManagement';
import AppointmentRequests from '@/components/doctor/AppointmentRequests/AppointmentRequests';
import LeaveRequests from '@/components/doctor/LeaveRequests/LeaveRequests';
import Profile from '@/components/doctor/Profile/Profile';
import DashboardStatsComponent from '@/components/doctor/DashboardStats/DashboardStats';
import Sidebar from '@/components/doctor/Sidebar/Sidebar';
import { Calendar, Users, Clock, User } from 'lucide-react';
import { doctorScheduleService, DoctorScheduleFilterRequest, DoctorAppointmentFilterRequest } from '@/services/doctorScheduleService';
import {
  WorkScheduleResponse,
  DoctorAppointmentResponse,
  LeaveResponse,
  DoctorProfile,
  DashboardStats,
} from '@/types/doctorSchedule';
import { toast } from 'react-hot-toast';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: number;
}

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('schedule');
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // "YYYY-MM-DD"
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | 'all'>('all');

  const [scheduleData, setScheduleData] = useState<WorkScheduleResponse[]>([]);
  const [appointmentRequests, setAppointmentRequests] = useState<DoctorAppointmentResponse[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveResponse[]>([]);
  const [loading, setLoading] = useState(true);

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

        // Fetch leave requests
        const leaveResponse = await doctorScheduleService.getMyLeaves();
        if (leaveResponse.code === 200 && leaveResponse.result) {
          setLeaveRequests(leaveResponse.result);
        } else {
          toast.error(leaveResponse.message || 'Không thể tải đơn xin nghỉ');
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
        toast.error('Đã xảy ra lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDate, filterStatus]);

  // Mock doctor profile (replace with actual API call if available)
  const doctorProfile: DoctorProfile = {
    name: 'BS. Trần Thị Mai',
    specialization: 'Bác sĩ chuyên khoa Tim mạch',
    experience: '10 năm kinh nghiệm',
    email: 'bs.tranthibmai@hospital.com',
    phone: '0912345678',
    address: 'Bệnh viện Đa khoa Trung ương',
    education: 'Tiến sĩ Y học - Đại học Y Hà Nội',
    certifications: ['Chứng chỉ Tim mạch can thiệp', 'Chứng chỉ Siêu âm tim', 'Chứng chỉ Cấp cứu tim mạch'],
    workingHours: '7:00 - 17:00',
    languages: ['Tiếng Việt', 'English', '中文'],
  };

  // Calculate dashboard stats
  const dashboardStats: DashboardStats = useMemo(() => {
    const todayAppointments = scheduleData.reduce(
      (total, schedule) => total + schedule.timeSlots.filter((slot) => !slot.isAvailable).length,
      0
    );
    const completedToday = appointmentRequests.filter((req) => req.status.toLowerCase() === 'completed').length;
    const pendingRequests = appointmentRequests.filter((req) => req.status.toLowerCase() === 'pending').length;
    const upcomingAppointments = scheduleData.reduce(
      (total, schedule) =>
        total +
        schedule.timeSlots.filter(
          (slot) => !slot.isAvailable && (slot.appointment?.status === 'confirmed' || slot.appointment?.status === 'pending')
        ).length,
      0
    );

    return { todayAppointments, completedToday, pendingRequests, upcomingAppointments };
  }, [scheduleData, appointmentRequests]);

  const menuItems: MenuItem[] = [
    { id: 'schedule', label: 'Quản lý Lịch hẹn', icon: Calendar, badge: dashboardStats.upcomingAppointments },
    { id: 'appointments', label: 'Yêu cầu Khám bệnh', icon: Users, badge: dashboardStats.pendingRequests },
    { id: 'leave', label: 'Đơn xin Nghỉ', icon: Clock },
    { id: 'profile', label: 'Hồ sơ Cá nhân', icon: User },
  ];

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'completed':
        return 'text-blue-600 bg-blue-100';
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      case 'cancelled':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'Đã xác nhận';
      case 'pending':
        return 'Chờ xử lý';
      case 'completed':
        return 'Hoàn thành';
      case 'approved':
        return 'Đã duyệt';
      case 'rejected':
        return 'Từ chối';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
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
    switch (activeTab) {
      case 'schedule':
        return (
          <ScheduleManagement
            scheduleData={scheduleData}
            selectedDate={selectedDate}
            searchTerm={searchTerm}
            filterStatus={filterStatus}
            onDateChange={setSelectedDate}
            onSearchChange={setSearchTerm}
            onFilterChange={setFilterStatus}
            getStatusColor={getStatusColor}
            getStatusText={getStatusText}
            getPriorityColor={getPriorityColor}
            getPriorityText={getPriorityText}
          />
        );
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
            leaveRequests={leaveRequests}
            getStatusColor={getStatusColor}
            getStatusText={getStatusText}
          />
        );
      case 'profile':
        return <Profile doctorProfile={doctorProfile} />;
      default:
        return (
          <ScheduleManagement
            scheduleData={scheduleData}
            selectedDate={selectedDate}
            searchTerm={searchTerm}
            filterStatus={filterStatus}
            onDateChange={setSelectedDate}
            onSearchChange={setSearchTerm}
            onFilterChange={setFilterStatus}
            getStatusColor={getStatusColor}
            getStatusText={getStatusText}
            getPriorityColor={getPriorityColor}
            getPriorityText={getPriorityText}
          />
        );
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
            ) : (
              <>
                {activeTab === 'schedule' && <DashboardStatsComponent dashboardStats={dashboardStats} />}
                {renderContent()}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;