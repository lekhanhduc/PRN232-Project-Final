using medical_appointment_booking.Common;
using medical_appointment_booking.Dtos.Request;
using medical_appointment_booking.Dtos.Response;

namespace medical_appointment_booking.Services
{
    public interface IDoctorService
    {
        Task<DoctorCreationResponse> CreateDoctorAsync(DoctorCreationRequest request);
        Task<DoctorDetailResponse> GetDoctorByIdAsync(long id);
        Task<PageResponse<DoctorSearchResponse>> SearchDoctorsAsync(string? specialtyName, 
            Gender? gender, bool? isAvailable, string? orderBy, int page, int pageSize);
    }
}
