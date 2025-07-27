using medical_appointment_booking.Dtos.Request;
using medical_appointment_booking.Dtos.Response;

namespace medical_appointment_booking.Services
{
    public interface IPatientService
    {
        Task<object> GetInfoPatient();
        Task<PatientDetailResponse> UpdateProfile(PatientDetailRequest request);

        Task<string> UploadAvatar(IFormFile file);

        Task ChangePassword(ChangePasswordRequest request);
    }
}
