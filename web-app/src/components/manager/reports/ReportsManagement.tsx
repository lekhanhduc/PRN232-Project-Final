'use client'
import { useState } from 'react';
import { Download, Calendar, BarChart3, TrendingUp, Users, UserCheck, Building2 } from 'lucide-react';

interface ReportsManagementProps {
    stats: {
        totalDoctors: number;
        totalPatients: number;
        totalAppointments: number;
        totalDepartments: number;
        appointmentsToday: number;
        newPatientsThisMonth: number;
    };
}

export const ReportsManagement = ({ stats }: ReportsManagementProps) => {
    const [selectedReport, setSelectedReport] = useState('overview');
    const [dateRange, setDateRange] = useState('month');

    const reports = [
        {
            id: 'overview',
            title: 'Tổng quan',
            description: 'Báo cáo tổng quan về hoạt động của bệnh viện',
            icon: BarChart3,
            color: 'bg-blue-500'
        },
        {
            id: 'appointments',
            title: 'Lịch hẹn',
            description: 'Thống kê lịch hẹn theo thời gian',
            icon: Calendar,
            color: 'bg-green-500'
        },
        {
            id: 'doctors',
            title: 'Bác sĩ',
            description: 'Báo cáo hiệu suất và lịch làm việc của bác sĩ',
            icon: UserCheck,
            color: 'bg-purple-500'
        },
        {
            id: 'patients',
            title: 'Bệnh nhân',
            description: 'Thống kê bệnh nhân và phân tích dân số',
            icon: Users,
            color: 'bg-orange-500'
        },
        {
            id: 'departments',
            title: 'Khoa/Phòng ban',
            description: 'Báo cáo hoạt động của các khoa',
            icon: Building2,
            color: 'bg-red-500'
        },
        {
            id: 'financial',
            title: 'Tài chính',
            description: 'Báo cáo doanh thu và chi phí',
            icon: TrendingUp,
            color: 'bg-indigo-500'
        }
    ];

    const dateRanges = [
        { value: 'week', label: 'Tuần này' },
        { value: 'month', label: 'Tháng này' },
        { value: 'quarter', label: 'Quý này' },
        { value: 'year', label: 'Năm nay' }
    ];

    const mockChartData = {
        appointments: [
            { month: 'T1', count: 120 },
            { month: 'T2', count: 150 },
            { month: 'T3', count: 180 },
            { month: 'T4', count: 200 },
            { month: 'T5', count: 220 },
            { month: 'T6', count: 250 }
        ],
        patients: [
            { age: '0-12', count: 45 },
            { age: '13-19', count: 78 },
            { age: '20-59', count: 234 },
            { age: '60+', count: 89 }
        ],
        departments: [
            { name: 'Khoa Nội', appointments: 156, patients: 89 },
            { name: 'Khoa Ngoại', appointments: 134, patients: 67 },
            { name: 'Khoa Nhi', appointments: 98, patients: 45 },
            { name: 'Khoa Tim mạch', appointments: 87, patients: 34 },
            { name: 'Khoa Thần kinh', appointments: 76, patients: 28 }
        ]
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Báo cáo & Thống kê</h2>
                <div className="flex items-center space-x-4">
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        {dateRanges.map((range) => (
                            <option key={range.value} value={range.value}>
                                {range.label}
                            </option>
                        ))}
                    </select>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                        <Download className="w-4 h-4" />
                        <span>Xuất báo cáo</span>
                    </button>
                </div>
            </div>

            {/* Report Types */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports.map((report) => (
                    <div
                        key={report.id}
                        onClick={() => setSelectedReport(report.id)}
                        className={`bg-white rounded-lg shadow-sm border p-6 cursor-pointer transition-all hover:shadow-md ${
                            selectedReport === report.id ? 'ring-2 ring-blue-500' : ''
                        }`}
                    >
                        <div className="flex items-center space-x-4">
                            <div className={`p-3 rounded-full ${report.color}`}>
                                <report.icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                                <p className="text-sm text-gray-500">{report.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Report Content */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
                {selectedReport === 'overview' && (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-900">Tổng quan hoạt động</h3>
                        
                        {/* Key Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-blue-50 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-blue-600">Tổng bác sĩ</p>
                                        <p className="text-2xl font-bold text-blue-900">{stats.totalDoctors}</p>
                                    </div>
                                    <UserCheck className="w-8 h-8 text-blue-600" />
                                </div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-green-600">Tổng bệnh nhân</p>
                                        <p className="text-2xl font-bold text-green-900">{stats.totalPatients}</p>
                                    </div>
                                    <Users className="w-8 h-8 text-green-600" />
                                </div>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-purple-600">Lịch hẹn hôm nay</p>
                                        <p className="text-2xl font-bold text-purple-900">{stats.appointmentsToday}</p>
                                    </div>
                                    <Calendar className="w-8 h-8 text-purple-600" />
                                </div>
                            </div>
                            <div className="bg-orange-50 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-orange-600">Khoa/Phòng ban</p>
                                        <p className="text-2xl font-bold text-orange-900">{stats.totalDepartments}</p>
                                    </div>
                                    <Building2 className="w-8 h-8 text-orange-600" />
                                </div>
                            </div>
                        </div>

                        {/* Chart Placeholder */}
                        <div className="bg-gray-50 rounded-lg p-8 text-center">
                            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">Biểu đồ thống kê sẽ được hiển thị ở đây</p>
                        </div>
                    </div>
                )}

                {selectedReport === 'appointments' && (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-900">Thống kê lịch hẹn</h3>
                        
                        {/* Appointment Trends */}
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h4 className="text-lg font-medium text-gray-900 mb-4">Xu hướng lịch hẹn theo tháng</h4>
                            <div className="space-y-2">
                                {mockChartData.appointments.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">{item.month}</span>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-32 bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className="bg-blue-600 h-2 rounded-full" 
                                                    style={{ width: `${(item.count / 250) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-medium text-gray-900">{item.count}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {selectedReport === 'patients' && (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-900">Thống kê bệnh nhân</h3>
                        
                        {/* Patient Demographics */}
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h4 className="text-lg font-medium text-gray-900 mb-4">Phân bố độ tuổi</h4>
                            <div className="space-y-3">
                                {mockChartData.patients.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">{item.age} tuổi</span>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-32 bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className="bg-green-600 h-2 rounded-full" 
                                                    style={{ width: `${(item.count / 234) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-medium text-gray-900">{item.count}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {selectedReport === 'departments' && (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-900">Báo cáo khoa/phòng ban</h3>
                        
                        {/* Department Performance */}
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h4 className="text-lg font-medium text-gray-900 mb-4">Hiệu suất các khoa</h4>
                            <div className="space-y-4">
                                {mockChartData.departments.map((dept, index) => (
                                    <div key={index} className="bg-white rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <h5 className="font-medium text-gray-900">{dept.name}</h5>
                                            <span className="text-sm text-gray-500">
                                                {dept.appointments} lịch hẹn
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Bệnh nhân: {dept.patients}</span>
                                            <span className="text-gray-600">
                                                Tỷ lệ: {((dept.patients / dept.appointments) * 100).toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {selectedReport === 'doctors' && (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-900">Báo cáo bác sĩ</h3>
                        <div className="bg-gray-50 rounded-lg p-8 text-center">
                            <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">Thống kê hiệu suất bác sĩ sẽ được hiển thị ở đây</p>
                        </div>
                    </div>
                )}

                {selectedReport === 'financial' && (
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-900">Báo cáo tài chính</h3>
                        <div className="bg-gray-50 rounded-lg p-8 text-center">
                            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">Báo cáo tài chính sẽ được hiển thị ở đây</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}; 