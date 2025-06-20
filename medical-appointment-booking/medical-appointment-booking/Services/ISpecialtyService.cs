using medical_appointment_booking.Dtos.Request;
using medical_appointment_booking.Dtos.Response;
using medical_appointment_booking.Models;

namespace medical_appointment_booking.Services
{
    public interface ISpecialtyService
    {
        Task<SpecialtyCreationResponse> Creation(SpecialtyCreationRequest request);
        Task<PageResponse<SpecialtyDetailResponse>> GetAllWithSearch(int page, int size, string? keyword = null);
        Task DeleteSpecialty(int specialtyId);
    }
}
