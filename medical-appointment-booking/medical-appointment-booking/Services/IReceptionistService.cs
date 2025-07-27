using medical_appointment_booking.Dtos.Request;
using medical_appointment_booking.Dtos.Response;
using medical_appointment_booking.Models;

namespace medical_appointment_booking.Services
{
    public interface IReceptionistService
    {

        Task<PageResponse<PatientDto>> SearchPatientsAsync(string? keyword, int page, int pageSize);
        Task<AppointmentCreationResponse> AddAppointmentAsync(AppointmentCreationRequest appointmentRequest);
        Task<IEnumerable<AppointmentListDto>> GetAppointmentsByDateAndQueryAsync(DateOnly? date, string? query);
        Task<bool> CancelAppointmentAsync(long appointmentId, string cancelReason, long? cancelledByUserId = null);
        Task<Patient?> GetPatientByPatientIdAsync(long id);
    }
}
