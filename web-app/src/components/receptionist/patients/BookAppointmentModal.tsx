import React, { useState, useEffect, FormEvent } from 'react';
import DoctorSearchBar from '@/components/doctors/DoctorSearchBar';
import { useDoctors } from '@/hooks/useDoctors';
import { receptionistService } from '@/services/receptionistService';
import { doctorService } from '@/services/doctorService';
import { appointmentService, ServicePackageResponse } from '@/services/appointmentService';
import { WorkScheduleDto, TimeSlotDto, DoctorSearchResponse } from '@/types/doctor';
import { PatientDTOResponse } from '@/types/user';
import { AppointmentCreationRequest, CreateAppointmentResponse } from '@/types/appointment';

interface BookAppointmentModalProps {
    open: boolean;
    patient: PatientDTOResponse | null;
    onClose: () => void;
    onSuccess: (res?: CreateAppointmentResponse) => void;
}

const BookAppointmentModal: React.FC<BookAppointmentModalProps> = ({ open, patient, onClose, onSuccess }) => {
    const [doctorSearchTerm, setDoctorSearchTerm] = useState<string>('');
    const { doctors, searchDoctors, loading: loadingDoctors } = useDoctors();
    const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
    const [schedule, setSchedule] = useState<WorkScheduleDto[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedSlot, setSelectedSlot] = useState<TimeSlotDto | null>(null);
    const [reason, setReason] = useState<string>('');
    const [packageId, setPackageId] = useState<number | undefined>(undefined);
    const [servicePackages, setServicePackages] = useState<ServicePackageResponse[]>([]);
    const [servicePackagesLoading, setServicePackagesLoading] = useState<boolean>(false);
    const [servicePackagesError, setServicePackagesError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open) {
            setDoctorSearchTerm('');
            setSelectedDoctorId(null);
            setSchedule([]);
            setSelectedDate('');
            setSelectedSlot(null);
            setReason('');
            setPackageId(undefined);
            setServicePackages([]);
            setServicePackagesError(null);
            setError(null);
        }
    }, [open]);

    useEffect(() => {
        if (doctorSearchTerm !== '') {
            searchDoctors({ doctorName: doctorSearchTerm });
        } else {
            searchDoctors();
        }
    }, [doctorSearchTerm]);

    useEffect(() => {
        if (selectedDoctorId) {
            doctorService.getDoctorAppointmentSchedule(selectedDoctorId).then(res => {
                setSchedule(res.result?.workSchedules || []);
            }).catch(() => setSchedule([]));
            setServicePackagesLoading(true);
            appointmentService.getActiveServicePackages().then(res => {
                setServicePackages(res.result || []);
                setServicePackagesLoading(false);
            }).catch(() => {
                setServicePackagesError('Không thể tải gói dịch vụ');
                setServicePackagesLoading(false);
            });
        }
    }, [selectedDoctorId]);

    const availableDays = schedule.filter((day) => day.timeSlots.some((slot: TimeSlotDto) => slot.isAvailable));
    const availableSlots = schedule.find((d) => d.workDate.split('T')[0] === selectedDate)?.timeSlots.filter((slot: TimeSlotDto) => slot.isAvailable) || [];

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!patient || !selectedDoctorId || !selectedDate || !selectedSlot || !packageId) {
            setError('Vui lòng điền đầy đủ thông tin');
            return;
        }
        setLoading(true);
        setError(null);
        const payload: AppointmentCreationRequest = {
            patientId: patient.id,
            doctorId: selectedDoctorId,
            slotId: selectedSlot.slotId,
            appointmentDate: selectedDate,
            reasonForVisit: reason,
            packageId: packageId,
        };
        try {
            const res = await receptionistService.createAppointmentForReceptionist(payload);
            onSuccess(res.result);
            onClose();
        } catch (err) {
            setError('Có lỗi khi tạo lịch hẹn');
        } finally {
            setLoading(false);
        }
    };

    if (!open || !patient) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-lg w-full p-6">
                <h3 className="text-lg font-semibold mb-4">Đặt lịch khám cho {patient.firstName}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Doctor search and select */}
                    <div>
                        <label className="block font-medium mb-1">Chọn bác sĩ</label>
                        <DoctorSearchBar searchTerm={doctorSearchTerm} setSearchTerm={setDoctorSearchTerm} />
                        <div className="max-h-32 overflow-y-auto mt-2 border rounded">
                            {loadingDoctors ? <div className="p-2">Đang tải...</div> : (
                                doctors.map((doc: DoctorSearchResponse) => (
                                    <div
                                        key={doc.doctorId}
                                        className={`p-2 cursor-pointer hover:bg-blue-100 ${selectedDoctorId === doc.doctorId ? 'bg-blue-200' : ''}`}
                                        onClick={() => setSelectedDoctorId(doc.doctorId)}
                                    >
                                        {doc.fullName} - {typeof doc.specialty === 'object' ? doc.specialty.specialtyName : String(doc.specialty)}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    {/* Date selection */}
                    {selectedDoctorId && (
                        <div>
                            <label className="block font-medium mb-1">Chọn ngày</label>
                            <div className="flex flex-wrap gap-2">
                                {availableDays.length === 0 && <span className="text-gray-500">Không có ngày nào khả dụng</span>}
                                {availableDays.map(day => (
                                    <button
                                        type="button"
                                        key={day.workDate}
                                        className={`px-3 py-1 rounded ${selectedDate === day.workDate.split('T')[0] ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                                        onClick={() => { setSelectedDate(day.workDate.split('T')[0]); setSelectedSlot(null); }}
                                    >
                                        {new Date(day.workDate).toLocaleDateString()}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {/* Slot selection */}
                    {selectedDate && (
                        <div>
                            <label className="block font-medium mb-1">Chọn giờ</label>
                            <div className="flex flex-wrap gap-2">
                                {availableSlots.length === 0 && <span className="text-gray-500">Không có ca nào khả dụng</span>}
                                {availableSlots.map((slot: TimeSlotDto) => (
                                    <button
                                        type="button"
                                        key={slot.slotId}
                                        className={`px-3 py-1 rounded ${selectedSlot?.slotId === slot.slotId ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
                                        onClick={() => setSelectedSlot(slot)}
                                    >
                                        {slot.slotTime}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {/* Service package selection */}
                    {selectedDoctorId && (
                        <div>
                            <label className="block font-medium mb-1">Chọn gói dịch vụ</label>
                            {servicePackagesLoading ? <div>Đang tải gói...</div> : servicePackagesError ? <div className="text-red-500">{servicePackagesError}</div> : (
                                <select
                                    className="w-full border rounded p-2"
                                    value={packageId || ''}
                                    onChange={e => setPackageId(e.target.value ? Number(e.target.value) : undefined)}
                                    required
                                >
                                    <option value="">Chọn gói dịch vụ</option>
                                    {servicePackages.map((pkg: ServicePackageResponse) => (
                                        <option key={pkg.packageId} value={pkg.packageId}>
                                            {pkg.packageName} - {pkg.fee?.toLocaleString()}₫
                                            {pkg.durationMinutes ? ` (${pkg.durationMinutes} phút)` : ''}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    )}
                    {/* Reason for visit */}
                    <div>
                        <label className="block font-medium mb-1">Lý do khám</label>
                        <textarea
                            className="w-full border rounded p-2"
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                            placeholder="Nhập lý do khám..."
                        />
                    </div>
                    {error && <div className="text-red-500 text-sm">{error}</div>}
                    <div className="flex gap-2 justify-end">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Hủy</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>{loading ? 'Đang tạo...' : 'Đặt lịch'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookAppointmentModal; 