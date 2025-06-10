import { Appointment } from '@/types/appointment';
import { useState, useCallback } from 'react';

const initialAppointments: Appointment[] = [
    {
        id: '1',
        patientId: 'P1',
        patientName: 'Nguyễn Văn An',
        phone: '0901234567',
        doctorName: 'BS. Trần Thị Mai',
        department: 'Nội khoa',
        date: '2025-06-10',
        time: '09:00',
        status: 'confirmed',
        symptoms: 'Đau đầu, chóng mặt, mệt mỏi',
        notes: 'Bệnh nhân có tiền sử tăng huyết áp. Cần kiểm tra huyết áp định kỳ.'
    },
    {
        id: '2',
        patientId: 'P2',
        patientName: 'Lê Thị Bình',
        phone: '0987654321',
        doctorName: 'BS. Phạm Văn Đức',
        department: 'Tim mạch',
        date: '2025-06-10',
        time: '10:30',
        status: 'pending',
        symptoms: 'Đau ngực, khó thở, tim đập nhanh',
        notes: 'Bệnh nhân lo lắng về triệu chứng tim mạch'
    },
    {
        id: '3',
        patientId: 'P3',
        patientName: 'Hoàng Minh Tuấn',
        phone: '0912345678',
        doctorName: 'BS. Nguyễn Thị Lan',
        department: 'Ngoại khoa',
        date: '2025-06-10',
        time: '11:00',
        status: 'confirmed',
        symptoms: 'Đau bụng dưới bên phải, buồn nôn',
        notes: 'Nghi ngờ viêm ruột thừa, cần khám cấp cứu'
    },
    {
        id: '4',
        patientId: 'P4',
        patientName: 'Phạm Thị Lan',
        phone: '0945678901',
        doctorName: 'BS. Trần Thị Mai',
        department: 'Nội khoa',
        date: '2025-06-10',
        time: '14:00',
        status: 'completed',
        symptoms: 'Ho khan, khó thở, đau ngực',
        notes: 'Bệnh nhân có tiền sử hen suyễn. Đã khám xong, kê đơn thuốc.'
    },
    {
        id: '5',
        patientId: 'P5',
        patientName: 'Trần Văn Hùng',
        phone: '0923456789',
        doctorName: 'BS. Lê Thị Hoa',
        department: 'Da liễu',
        date: '2025-06-10',
        time: '15:30',
        status: 'pending',
        symptoms: 'Nổi mẩn đỏ, ngứa, sưng tấy',
        notes: 'Bệnh nhân có dấu hiệu dị ứng da'
    },
    {
        id: '6',
        patientId: 'P6',
        patientName: 'Nguyễn Thị Hương',
        phone: '0934567890',
        doctorName: 'BS. Phạm Văn Đức',
        department: 'Tim mạch',
        date: '2025-06-10',
        time: '16:00',
        status: 'cancelled',
        symptoms: 'Đau tim, hồi hộp',
        notes: 'Bệnh nhân hủy lịch hẹn vì có việc đột xuất'
    },

    // Tomorrow's appointments
    {
        id: '7',
        patientId: 'P7',
        patientName: 'Vũ Minh Quang',
        phone: '0956789012',
        doctorName: 'BS. Nguyễn Thị Lan',
        department: 'Ngoại khoa',
        date: '2025-06-11',
        time: '08:30',
        status: 'confirmed',
        symptoms: 'Đau vai, cứng khớp, khó cử động',
        notes: 'Bệnh nhân làm việc văn phòng, nghi ngờ hội chứng vai gáy'
    },
    {
        id: '8',
        patientId: 'P8',
        patientName: 'Đỗ Thị Mai',
        phone: '0967890123',
        doctorName: 'BS. Trần Thị Mai',
        department: 'Nội khoa',
        date: '2025-06-11',
        time: '09:15',
        status: 'pending',
        symptoms: 'Đau dạ dày, ợ hơi, khó tiêu',
        notes: 'Bệnh nhân có thói quen ăn uống không đều'
    },
    {
        id: '9',
        patientId: 'P9',
        patientName: 'Lý Văn Thành',
        phone: '0978901234',
        doctorName: 'BS. Lê Thị Hoa',
        department: 'Da liễu',
        date: '2025-06-11',
        time: '10:00',
        status: 'confirmed',
        symptoms: 'Mụn trứng cá, da nhờn, sẹo thâm',
        notes: 'Bệnh nhân tuổi teen, cần tư vấn chăm sóc da'
    },
    {
        id: '10',
        patientId: 'P10',
        patientName: 'Hoàng Thị Linh',
        phone: '0989012345',
        doctorName: 'BS. Phạm Văn Đức',
        department: 'Tim mạch',
        date: '2025-06-11',
        time: '11:30',
        status: 'pending',
        symptoms: 'Huyết áp cao, đau đầu, choáng váng',
        notes: 'Bệnh nhân cần theo dõi huyết áp thường xuyên'
    },

    // Next week appointments
    {
        id: '11',
        patientId: 'P11',
        patientName: 'Ngô Văn Đạt',
        phone: '0901122334',
        doctorName: 'BS. Trần Thị Mai',
        department: 'Nội khoa',
        date: '2025-06-12',
        time: '09:00',
        status: 'confirmed',
        symptoms: 'Tiểu đường, khát nước nhiều, mệt mỏi',
        notes: 'Bệnh nhân cần kiểm tra đường huyết định kỳ'
    },
    {
        id: '12',
        patientId: 'P12',
        patientName: 'Phan Thị Ngọc',
        phone: '0912233445',
        doctorName: 'BS. Nguyễn Thị Lan',
        department: 'Ngoại khoa',
        date: '2025-06-12',
        time: '14:30',
        status: 'pending',
        symptoms: 'Sỏi thận, đau lưng, tiểu máu',
        notes: 'Bệnh nhân cần siêu âm thận để xác định kích thước sỏi'
    },
    {
        id: '13',
        patientId: 'P13',
        patientName: 'Trịnh Văn Bình',
        phone: '0923344556',
        doctorName: 'BS. Lê Thị Hoa',
        department: 'Da liễu',
        date: '2025-06-13',
        time: '08:00',
        status: 'confirmed',
        symptoms: 'Vẩy nến, da khô, ngứa',
        notes: 'Bệnh nhân có tiền sử bệnh da di truyền'
    },
    {
        id: '14',
        patientId: 'P14',
        patientName: 'Bùi Thị Lan Anh',
        phone: '0934455667',
        doctorName: 'BS. Phạm Văn Đức',
        department: 'Tim mạch',
        date: '2025-06-13',
        time: '10:15',
        status: 'pending',
        symptoms: 'Rối loạn nhịp tim, hồi hộp, choáng váng',
        notes: 'Bệnh nhân cần làm điện tâm đồ để kiểm tra'
    },
    {
        id: '15',
        patientId: 'P15',
        patientName: 'Võ Minh Tâm',
        phone: '0945566778',
        doctorName: 'BS. Trần Thị Mai',
        department: 'Nội khoa',
        date: '2025-06-14',
        time: '16:45',
        status: 'confirmed',
        symptoms: 'Viêm gan, vàng da, mệt mỏi',
        notes: 'Bệnh nhân cần xét nghiệm chức năng gan'
    }
];

export const useAppointments = () => {
    const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Generate unique ID for new appointment
    const generateId = useCallback(() => {
        const maxId = appointments.reduce((max, apt) => {
            const numId = parseInt(apt.id);
            return numId > max ? numId : max;
        }, 0);
        return (maxId + 1).toString();
    }, [appointments]);

    const updateAppointmentStatus = useCallback((id: string, status: Appointment['status']) => {
        try {
            setError(null);
            setAppointments(prev =>
                prev.map(apt => apt.id === id ? { ...apt, status } : apt)
            );
        } catch (err) {
            setError('Có lỗi xảy ra khi cập nhật trạng thái lịch hẹn');
        }
    }, []);

    const deleteAppointment = useCallback((id: string) => {
        try {
            setError(null);
            setAppointments(prev => prev.filter(apt => apt.id !== id));
        } catch (err) {
            setError('Có lỗi xảy ra khi xóa lịch hẹn');
        }
    }, []);

    const addAppointment = useCallback((appointment: Omit<Appointment, 'id'>) => {
        try {
            setLoading(true);
            setError(null);

            // Validate required fields
            if (!appointment.patientName.trim()) {
                throw new Error('Tên bệnh nhân là bắt buộc');
            }
            if (!appointment.phone.trim()) {
                throw new Error('Số điện thoại là bắt buộc');
            }
            if (!appointment.date) {
                throw new Error('Ngày khám là bắt buộc');
            }
            if (!appointment.time) {
                throw new Error('Giờ khám là bắt buộc');
            }

            // Check for time conflicts
            const timeConflict = appointments.find(apt =>
                apt.date === appointment.date &&
                apt.time === appointment.time &&
                apt.doctorName === appointment.doctorName &&
                apt.status !== 'cancelled'
            );

            if (timeConflict) {
                throw new Error('Bác sĩ đã có lịch hẹn vào thời gian này');
            }

            const newAppointment: Appointment = {
                ...appointment,
                id: generateId(),
                status: appointment.status || 'pending'
            };

            setAppointments(prev => [...prev, newAppointment]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi thêm lịch hẹn');
        } finally {
            setLoading(false);
        }
    }, [appointments, generateId]);

    const updateAppointment = useCallback((id: string, updates: Partial<Appointment>) => {
        try {
            setError(null);
            setAppointments(prev =>
                prev.map(apt => apt.id === id ? { ...apt, ...updates } : apt)
            );
        } catch (err) {
            setError('Có lỗi xảy ra khi cập nhật lịch hẹn');
        }
    }, []);

    const getAppointmentById = useCallback((id: string) => {
        return appointments.find(apt => apt.id === id);
    }, [appointments]);

    const getAppointmentsByDate = useCallback((date: string) => {
        return appointments.filter(apt => apt.date === date);
    }, [appointments]);

    const getAppointmentsByPatient = useCallback((patientId: string) => {
        return appointments.filter(apt => apt.patientId === patientId);
    }, [appointments]);

    const getAppointmentsByDoctor = useCallback((doctorName: string) => {
        return appointments.filter(apt => apt.doctorName === doctorName);
    }, [appointments]);

    const getAppointmentsByStatus = useCallback((status: Appointment['status']) => {
        return appointments.filter(apt => apt.status === status);
    }, [appointments]);

    // Statistics
    const getAppointmentStats = useCallback((date?: string) => {
        const filteredAppointments = date
            ? appointments.filter(apt => apt.date === date)
            : appointments;

        return {
            total: filteredAppointments.length,
            confirmed: filteredAppointments.filter(apt => apt.status === 'confirmed').length,
            pending: filteredAppointments.filter(apt => apt.status === 'pending').length,
            completed: filteredAppointments.filter(apt => apt.status === 'completed').length,
            cancelled: filteredAppointments.filter(apt => apt.status === 'cancelled').length,
        };
    }, [appointments]);

    return {
        appointments,
        loading,
        error,
        updateAppointmentStatus,
        deleteAppointment,
        addAppointment,
        updateAppointment,
        getAppointmentById,
        getAppointmentsByDate,
        getAppointmentsByPatient,
        getAppointmentsByDoctor,
        getAppointmentsByStatus,
        getAppointmentStats
    };
};