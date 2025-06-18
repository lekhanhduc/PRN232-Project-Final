using medical_appointment_booking.Dtos.Request;
using medical_appointment_booking.Models;

namespace medical_appointment_booking.Services
{
    public interface ISpecialtyService
    {
        Task<Specialty> Creation(SpecialtyCreationRequest request);
    }
}
