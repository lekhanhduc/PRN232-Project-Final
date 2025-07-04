using medical_appointment_booking.Dtos.Request;
using medical_appointment_booking.Dtos.Response;

namespace medical_appointment_booking.Services
{
    public interface IReceptionistService
    {

        Task<IEnumerable<PatientDto>> SearchPatientsAsync(string? keyword);
        Task<AppointmentCreationResponse> AddAppointmentAsync(AppointmentCreationRequest appointmentRequest);
        Task<IEnumerable<AppointmentTodayResponse>> GetTodayAppointmentsAsync();
        Task<bool> CancelAppointmentAsync(long appointmentId, string cancelReason, long? cancelledByUserId = null);
    }
}
