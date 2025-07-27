using medical_appointment_booking.Dtos.Response;

namespace medical_appointment_booking.Services
{
    public interface IServicePackageService
    {
        Task<IEnumerable<ServicePackageResponse>> GetServicePackagesAsync();
    }
}
