using medical_appointment_booking.Common;
using medical_appointment_booking.Dtos.Request;
using medical_appointment_booking.Dtos.Response;

namespace medical_appointment_booking.Services
{
    public interface IDoctorService
    {
        Task<DoctorCreationResponse> CreateDoctorAsync(DoctorCreationRequest request);
        Task<DoctorDetailResponse> GetDoctorByIdAsync(long id);
        Task<PageResponse<DoctorSearchResponse>> SearchDoctorsAsync(string? doctorName, string? specialtyName, 
            Gender? gender, bool? isAvailable, string? orderBy, int page, int pageSize);
        Task<PageResponse<DoctorDetailResponse>> GetAllWithSearch(int page, int size, string? keyword = null);
        Task DeleteDoctor(long id);
        Task<DoctorDetailResponse> UpdateDoctor(DoctorUpdateRequest request);
        Task<DoctorAppointmentScheduleResponse> GetDoctorAppointmentScheduleAsync(long doctorId, DateOnly? fromDate = null, DateOnly? toDate = null);
        Task<DoctorWorkingScheduleResponse> GetDoctorWorkingScheduleAsync(long doctorId, int daysAhead = 14);
    }
}
