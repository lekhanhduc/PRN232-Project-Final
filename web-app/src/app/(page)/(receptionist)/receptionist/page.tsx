"use client";

import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Appointment {
    id: number;
    patientName: string;
    time: string;
    doctor: string;
    status: "confirmed" | "completed" | "canceled";
    notes?: string;
}

interface Notification {
    id: number;
    message: string;
    timestamp: string;
}

export default function Dashboard() {
    const [appointments, setAppointments] = useState<Appointment[]>([
        { id: 1, patientName: "Nguyen Van A", time: "10:00", doctor: "BS Lan", status: "confirmed", notes: "Đã thanh toán" },
        { id: 2, patientName: "Tran Thi B", time: "14:00", doctor: "BS Minh", status: "canceled", notes: "Hủy do bận" },
        { id: 3, patientName: "Le Van C", time: "15:30", doctor: "BS Hoa", status: "completed", notes: "Kết quả OK" },
    ]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
    const [notifications, setNotifications] = useState<Notification[]>([
        { id: 1, message: "Hẹn lúc 14:00 bị hủy bởi bệnh nhân.", timestamp: "2025-06-09 14:05" },
        { id: 2, message: "Bệnh nhân Nguyen Van A đã đến.", timestamp: "2025-06-09 09:50" },
    ]);
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState<string>("");

    useEffect(() => {
        console.log("Fetching appointments for", selectedDate, "with status", selectedStatus);
    }, [selectedDate, selectedStatus]);

    const filteredAppointments = appointments.filter((apt) => {
        const matchesDate = apt.time.split(":")[0] >= selectedDate.split("-")[2];
        const matchesStatus = selectedStatus === "all" || apt.status === selectedStatus;
        const matchesSearch = apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || apt.doctor.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesDate && matchesStatus && matchesSearch;
    });

    const updateAppointmentStatus = (id: number, newStatus: "confirmed" | "completed" | "canceled") => {
        setAppointments(appointments.map(apt => apt.id === id ? { ...apt, status: newStatus } : apt));
    };

    const chartData = {
        labels: ["Xác nhận", "Hoàn thành", "Hủy"],
        datasets: [
            {
                label: "Số lượng",
                data: [
                    appointments.filter(a => a.status === "confirmed").length,
                    appointments.filter(a => a.status === "completed").length,
                    appointments.filter(a => a.status === "canceled").length,
                ],
                backgroundColor: ["#34D399", "#60A5FA", "#F87171"],
            },
        ],
    };

    return (
        <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
                <h2 className="text-2xl font-bold mb-8 text-blue-700">MediCare</h2>
                <ul className="space-y-4">
                    <li><a href="#" className="block p-3 text-gray-700 hover:bg-blue-50 rounded-lg transition">Dashboard</a></li>
                    <li>
                        <a href="#" className="block p-3 text-gray-700 hover:bg-blue-50 rounded-lg transition">Lịch hẹn</a>
                        <ul className="ml-4 mt-2 space-y-2">
                            <li><a href="#" className="block p-2 text-sm text-gray-600 hover:bg-blue-50 rounded">Tất cả</a></li>
                            <li><a href="#" className="block p-2 text-sm text-gray-600 hover:bg-blue-50 rounded">Hôm nay</a></li>
                            <li><a href="#" className="block p-2 text-sm text-gray-600 hover:bg-blue-50 rounded">Tuần này</a></li>
                        </ul>
                    </li>
                    <li><a href="#" className="block p-3 text-gray-700 hover:bg-blue-50 rounded-lg transition">Bệnh nhân</a></li>
                    <li><a href="#" className="block p-3 text-gray-700 hover:bg-blue-50 rounded-lg transition">Báo cáo</a></li>
                    <li><a href="#" className="block p-3 text-gray-700 hover:bg-blue-50 rounded-lg transition">Cài đặt</a></li>
                </ul>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <h1 className="text-4xl font-extrabold mb-6 text-gray-800">Dashboard Receptionist</h1>

                {/* Filters and Search */}
                <div className="mb-6 flex space-x-4 items-center">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="confirmed">Xác nhận</option>
                        <option value="completed">Hoàn thành</option>
                        <option value="canceled">Hủy</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Tìm kiếm bệnh nhân hoặc bác sĩ..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border border-gray-300 p-2 rounded-lg w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition">Lọc</button>
                </div>

                {/* Stats and Chart */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700">Tổng hẹn</h3>
                        <p className="text-2xl font-bold text-blue-600">{appointments.length}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700">Hẹn hôm nay</h3>
                        <p className="text-2xl font-bold text-green-600">3</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700">Hủy</h3>
                        <p className="text-2xl font-bold text-red-600">1</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Thống kê trạng thái</h2>
                    <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
                </div>

                {/* Appointments Table */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Danh sách lịch hẹn</h2>
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-3 text-left text-gray-600">Thời gian</th>
                                <th className="border p-3 text-left text-gray-600">Tên bệnh nhân</th>
                                <th className="border p-3 text-left text-gray-600">Bác sĩ</th>
                                <th className="border p-3 text-left text-gray-600">Ghi chú</th>
                                <th className="border p-3 text-left text-gray-600">Trạng thái</th>
                                <th className="border p-3 text-left text-gray-600">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAppointments.map((apt) => (
                                <tr key={apt.id} className="hover:bg-gray-50 transition">
                                    <td className="border p-3">{apt.time}</td>
                                    <td className="border p-3">{apt.patientName}</td>
                                    <td className="border p-3">{apt.doctor}</td>
                                    <td className="border p-3">{apt.notes}</td>
                                    <td className={`border p-3 ${apt.status === "confirmed" ? "text-green-600" : apt.status === "canceled" ? "text-red-600" : "text-blue-600"}`}>
                                        {apt.status === "confirmed" ? "Xác nhận" : apt.status === "canceled" ? "Hủy" : "Hoàn thành"}
                                    </td>
                                    <td className="border p-3">
                                        <select
                                            value={apt.status}
                                            onChange={(e) => updateAppointmentStatus(apt.id, e.target.value as any)}
                                            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="confirmed">Xác nhận</option>
                                            <option value="completed">Hoàn thành</option>
                                            <option value="canceled">Hủy</option>
                                        </select>
                                        <button className="ml-2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition">Chi tiết</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Notifications */}
                <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Thông báo</h2>
                    <ul className="space-y-3">
                        {notifications.map((notif) => (
                            <li key={notif.id} className="bg-yellow-50 p-3 rounded-lg flex justify-between items-center">
                                <span className="font-medium text-gray-800">{notif.message}</span>
                                <span className="text-gray-500 text-sm">{notif.timestamp}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </main>
        </div>
    );
}