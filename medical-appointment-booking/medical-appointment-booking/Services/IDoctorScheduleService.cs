using medical_appointment_booking.Dtos.Request;
using medical_appointment_booking.Dtos.Response;

namespace medical_appointment_booking.Services
{
    public interface IDoctorScheduleService
    {
        // Work Schedule
        Task<List<WorkScheduleResponse>> GetMyWorkScheduleAsync(long doctorId, DateOnly? fromDate = null, DateOnly? toDate = null);

        // Appointments
        Task<PageResponse<AppointmentDoctorResponse>> GetMyAppointmentsAsync(long doctorId, DoctorAppointmentFilterRequest request);
        Task<bool> MarkPatientArrivedAsync(long appointmentId, long doctorId);
        Task<bool> CompleteAppointmentAsync(long appointmentId, long doctorId, CompleteAppointmentRequest request);

        // Leave Management
        Task<LeaveResponse> RequestLeaveAsync(long doctorId, LeaveRequest request);
    }
}
