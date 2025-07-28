'use client'
import React, { useEffect, useState } from 'react';
import { doctorService } from '@/services/doctorService';
import { User } from 'lucide-react';

function ScheduleModal({ open, onClose, doctor }: { open: boolean, onClose: () => void, doctor: any }) {
    if (!open || !doctor) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6 relative">
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                    onClick={onClose}
                    aria-label="Đóng"
                >
                    ×
                </button>
                <h3 className="text-lg font-semibold mb-2 text-blue-700">Lịch làm việc của {doctor.fullName}</h3>
                {Array.isArray(doctor.workSchedules) && doctor.workSchedules.length > 0 ? (
                    <ul className="divide-y divide-gray-100">
                        {doctor.workSchedules.map((day: any) => (
                            <li key={day.scheduleId || day.workDate || Math.random()} className="flex justify-between py-2 text-sm text-gray-800">
                                <span>{day.workDate ? (day.workDate.split ? day.workDate.split('T')[0] : day.workDate) : 'N/A'}</span>
                                <span>{day.startTime && day.endTime ? `${day.startTime} - ${day.endTime}` : 'N/A'}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-gray-400 text-xs">Không có lịch làm việc</div>
                )}
            </div>
        </div>
    );
}

export const DoctorSchedule = () => {
    const [doctors, setDoctors] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [modalDoctor, setModalDoctor] = useState<any | null>(null);

    useEffect(() => {
        const fetchDoctors = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await doctorService.searchDoctors({ doctorName: searchTerm, page, pageSize });
                const items = res.result?.items || [];
                setDoctors(items);
                setTotalPages(res.result?.totalPages || 1);
                setTotalElements(res.result?.totalElements || 0);
            } catch (err: any) {
                setError('Không thể tải danh sách bác sĩ. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, [searchTerm, page, pageSize]);

    return (
        <div>
            <ScheduleModal open={!!modalDoctor} onClose={() => setModalDoctor(null)} doctor={modalDoctor} />
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Lịch làm việc Bác sĩ</h2>
                <input
                    type="text"
                    placeholder="Tìm kiếm bác sĩ theo tên..."
                    value={searchTerm}
                    onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
                    className="mb-4 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(pageSize)].map((_, i) => (
                            <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm animate-pulse">
                                <div className="h-6 w-1/2 bg-gray-200 rounded mb-2" />
                                <div className="h-4 w-1/3 bg-gray-200 rounded mb-4" />
                                <div className="h-4 w-2/3 bg-gray-200 rounded mb-2" />
                                <div className="h-4 w-1/2 bg-gray-200 rounded mb-2" />
                                <div className="h-4 w-1/4 bg-gray-200 rounded" />
                            </div>
                        ))}
                    </div>
                )}
                {error && <div className="text-red-600 mt-2">{error}</div>}
                {!loading && !error && doctors.length === 0 && (
                    <div className="text-gray-500 mt-2">Không có bác sĩ nào.</div>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-200 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        <div className="text-lg font-medium">Không tìm thấy bác sĩ nào.</div>
                        <div className="text-sm">Hãy thử lại từ khóa khác hoặc kiểm tra bộ lọc!</div>
                    </div>
                ) : (
                    doctors.map((doctor) => (
                        <div key={doctor.doctorId} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                                    {doctor.avatar ? (
                                        <img
                                            src={doctor.avatar}
                                            alt={doctor.fullName}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <User className="w-6 h-6 text-white" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">{doctor.fullName}</h3>
                                    <p className="text-sm text-gray-600">{doctor.specialty?.specialtyName || ''}</p>
                                    <p className="text-xs text-gray-400">{doctor.email}</p>
                                </div>
                            </div>
                            <div className="mb-2 text-sm text-gray-700">
                                <span className="font-medium">Bằng cấp:</span> {doctor.academicTitle || 'N/A'}
                            </div>
                            <div className="mb-2 text-sm text-gray-700">
                                <span className="font-medium">Kinh nghiệm:</span> {doctor.yearsOfExperience || 0} năm
                            </div>
                            <div className="mb-2 text-sm text-gray-700">
                                <span className="font-medium">Giá khám:</span> {doctor.consultationFee?.toLocaleString()} VNĐ
                            </div>
                            <div className="mb-2 text-sm text-gray-700">
                                <span className="font-medium">Trạng thái:</span> {doctor.isAvailable ? 'Đang làm việc' : 'Nghỉ'}
                            </div>
                            <div className="mt-4">
                                <h4 className="font-semibold text-blue-700 mb-2">Lịch làm việc</h4>
                                {Array.isArray(doctor.workSchedules) && doctor.workSchedules.length > 0 ? (
                                    <>
                                        <ul className="space-y-1">
                                            {doctor.workSchedules.slice(0, 3).map((day: any) => (
                                                <li key={day.scheduleId || day.workDate || Math.random()} className="flex justify-between text-xs text-gray-800">
                                                    <span>{day.workDate ? (day.workDate.split ? day.workDate.split('T')[0] : day.workDate) : 'N/A'}</span>
                                                    <span>{day.startTime && day.endTime ? `${day.startTime} - ${day.endTime}` : 'N/A'}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        {doctor.workSchedules.length > 3 && (
                                            <button
                                                className="mt-2 w-full bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                                                onClick={() => setModalDoctor(doctor)}
                                            >
                                                Xem tất cả lịch làm việc
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center gap-1 text-gray-400 text-xs py-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                        Không có lịch làm việc cho bác sĩ này.
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
            {/* Pagination controls */}
            <div className="flex items-center justify-between mt-8">
                <div>
                    <button
                        className="px-3 py-1 border rounded mr-2 disabled:opacity-50"
                        onClick={() => setPage(page - 1)}
                        disabled={page <= 1}
                    >
                        Trang trước
                    </button>
                    <span>Trang {page} / {totalPages}</span>
                    <button
                        className="px-3 py-1 border rounded ml-2 disabled:opacity-50"
                        onClick={() => setPage(page + 1)}
                        disabled={page >= totalPages}
                    >
                        Trang sau
                    </button>
                </div>
                <div>
                    <span className="mr-2">Kích thước trang:</span>
                    <select
                        value={pageSize}
                        onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
                        className="border rounded px-2 py-1"
                    >
                        <option value={3}>3</option>
                        <option value={6}>6</option>
                        <option value={12}>12</option>
                        <option value={24}>24</option>
                    </select>
                </div>
                <div className="ml-4 text-gray-500 text-sm">
                    Tổng số: {totalElements}
                </div>
            </div>
        </div>
    );
};