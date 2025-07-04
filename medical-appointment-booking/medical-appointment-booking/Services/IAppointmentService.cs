using medical_appointment_booking.Dtos.Request;
using medical_appointment_booking.Dtos.Response;

namespace medical_appointment_booking.Services
{
    public interface IAppointmentService
    {
        Task<CreateAppointmentResponse> CreateAppointmentAsync(
            CreateAppointmentRequest request, int currentUserId);
        Task<IQueryable<AppointmentResponse>> GetMyAppointmentsAsync(int currentUserId);
        Task CancelAppointmentAsync(long appointmentId, CancelAppointmentRequest request, int currentUserId);
        Task<RescheduleAppointmentResponse> RescheduleAppointmentAsync(long appointmentId, RescheduleAppointmentRequest request, int currentUserId);
    }
}
