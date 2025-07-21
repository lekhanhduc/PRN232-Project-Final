"use client";

import React, { useState, useMemo, useEffect } from 'react';
import ScheduleManagement from '@/components/doctor/ScheduleManagement/ScheduleManagement';
import AppointmentRequests from '@/components/doctor/AppointmentRequests/AppointmentRequests';
import LeaveRequests from '@/components/doctor/LeaveRequests/LeaveRequests';
import Profile from '@/components/doctor/Profile/Profile';
import DashboardStatsComponent from '@/components/doctor/DashboardStats/DashboardStats'; 
import Sidebar from '@/components/doctor/Sidebar/Sidebar';
import Header from '@/components/doctor/Header/Header';
import { 
  Calendar, 
  Users, 
  Clock, 
  User, 
} from 'lucide-react'; // Removed unused 'Search' import
import { doctorService } from '@/services/doctorService';


type StatusType = 'confirmed' | 'pending' | 'completed' | 'approved' | 'rejected' | 'cancelled';

interface ScheduleItem {
  id: number;
  patientName: string;
  phone: string;
  time: string;
  department: string;
  symptoms: string;
  status: StatusType;
  duration?: number;
  patientAge?: number;
  priority?: 'low' | 'medium' | 'high';
}

interface AppointmentRequest {
  id: number;
  patientName: string;
  phone: string;
  requestedTime: string;
  department: string;
  symptoms: string;
  status: StatusType;
  requestDate: string;
  patientAge?: number;
  urgency?: 'low' | 'medium' | 'high';
}

interface LeaveRequest {
  id: number;
  startDate: string;
  endDate: string;
  reason: string;
  status: StatusType;
  requestDate: string;
  type: 'vacation' | 'sick' | 'conference' | 'emergency';
}

interface DoctorProfile {
  name: string;
  specialization: string;
  experience: string;
  email: string;
  phone: string;
  address: string;
  education: string;
  certifications: string[];
  avatar?: string;
  workingHours: string;
  languages: string[];
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: number;
}

interface DashboardStats {
  todayAppointments: number;
  completedToday: number;
  pendingRequests: number;
  upcomingAppointments: number;
}

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('schedule');
  const [selectedDate, setSelectedDate] = useState('2025-06-11');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<StatusType | 'all'>('all');
  const [showNotifications, setShowNotifications] = useState(false);

  const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);
  const [loadingSchedule, setLoadingSchedule] = useState(true);

  useEffect(() => {
  const fetchSchedule = async () => {
    try {
      const doctorId = 1; // TODO: Replace with real logged-in doctor ID
      const response = await doctorService.getDoctorSchedule(doctorId);
      const mappedData: ScheduleItem[] = response.data.map(item => ({
        id: item.id,
        patientName: item.patientName,
        phone: item.phone,
        time: item.time,
        department: item.department,
        symptoms: item.symptoms,
        status: item.status as StatusType,
        duration: item.duration,
        patientAge: item.patientAge,
        priority: item.priority,
      }));
      setScheduleData(mappedData);
    } catch (error) {
      console.error('Lỗi khi lấy lịch làm việc:', error);
    } finally {
      setLoadingSchedule(false);
    }
  };

  fetchSchedule();
}, []);

  const appointmentRequests: AppointmentRequest[] = [
    { id: 1, patientName: 'Trần Văn Hòa', phone: '0938475629', requestedTime: '15:30', department: 'Tim mạch', symptoms: 'Đau tim, khó thở khi gắng sức', status: 'pending', requestDate: '2025-06-12', patientAge: 62, urgency: 'high' },
    { id: 2, patientName: 'Vũ Thị Mai', phone: '0967834521', requestedTime: '16:00', department: 'Nội khoa', symptoms: 'Sốt cao, đau họng, ho', status: 'pending', requestDate: '2025-06-12', patientAge: 28, urgency: 'medium' },
    { id: 3, patientName: 'Đặng Minh Quân', phone: '0923456789', requestedTime: '09:00', department: 'Ngoại khoa', symptoms: 'Đau lưng, tê chân, khó đi lại', status: 'pending', requestDate: '2025-06-13', patientAge: 41, urgency: 'high' },
  ];

  const leaveRequests: LeaveRequest[] = [
    { id: 1, startDate: '2025-06-15', endDate: '2025-06-17', reason: 'Nghỉ phép cá nhân', status: 'approved', requestDate: '2025-06-05', type: 'vacation' },
    { id: 2, startDate: '2025-07-01', endDate: '2025-07-05', reason: 'Tham gia hội nghị y khoa', status: 'pending', requestDate: '2025-06-10', type: 'conference' },
    { id: 3, startDate: '2025-06-20', endDate: '2025-06-20', reason: 'Khám sức khỏe định kỳ', status: 'approved', requestDate: '2025-06-08', type: 'sick' },
  ];

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

  const dashboardStats: DashboardStats = useMemo(() => {
    const todayAppointments = scheduleData.length;
    const completedToday = scheduleData.filter(item => item.status === 'completed').length;
    const pendingRequests = appointmentRequests.filter(req => req.status === 'pending').length;
    const upcomingAppointments = scheduleData.filter(item => 
      item.status === 'confirmed' || item.status === 'pending'
    ).length;

    return { todayAppointments, completedToday, pendingRequests, upcomingAppointments };
  }, [scheduleData, appointmentRequests]);

  const menuItems: MenuItem[] = [
    { id: 'schedule', label: 'Quản lý Lịch hẹn', icon: Calendar, badge: dashboardStats.upcomingAppointments },
    { id: 'appointments', label: 'Yêu cầu Khám bệnh', icon: Users, badge: dashboardStats.pendingRequests },
    { id: 'leave', label: 'Đơn xin Nghỉ', icon: Clock },
    { id: 'profile', label: 'Hồ sơ Cá nhân', icon: User },
  ];

  const getStatusColor = (status: StatusType): string => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'cancelled': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: StatusType): string => {
    switch (status) {
      case 'confirmed': return 'Đã xác nhận';
      case 'pending': return 'Chờ xử lý';
      case 'completed': return 'Hoàn thành';
      case 'approved': return 'Đã duyệt';
      case 'rejected': return 'Từ chối';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityText = (priority: string): string => {
    switch (priority) {
      case 'high': return 'Cao';
      case 'medium': return 'Trung bình';
      case 'low': return 'Thấp';
      default: return priority;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'schedule':
        return <ScheduleManagement
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
        />;
      case 'appointments':
        return <AppointmentRequests
          appointmentRequests={appointmentRequests}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
          getPriorityColor={getPriorityColor}
          getPriorityText={getPriorityText}
        />;
      case 'leave':
        return <LeaveRequests
          leaveRequests={leaveRequests}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
        />;
      case 'profile':
        return <Profile doctorProfile={doctorProfile} />;
      default:
        return <ScheduleManagement
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
        />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar menuItems={menuItems} activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1 min-h-screen">
          <Header
            dashboardStats={dashboardStats}
            doctorName={doctorProfile.name}
            showNotifications={showNotifications}
            onToggleNotifications={() => setShowNotifications(!showNotifications)}
          />
          <main className="p-6">
            {loadingSchedule ? (
              <div className="text-center text-gray-500 py-8">Đang tải lịch làm việc...</div>
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