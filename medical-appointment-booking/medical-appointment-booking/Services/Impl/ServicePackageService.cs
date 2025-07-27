using Azure.Core;
using medical_appointment_booking.Dtos.Response;
using medical_appointment_booking.Repositories;

namespace medical_appointment_booking.Services.Impl
{
    public class ServicePackageService : IServicePackageService
    {
        private readonly ServicePackageRepository _servicePackageRepository;
        public ServicePackageService(ServicePackageRepository servicePackageRepository)
        {
            _servicePackageRepository = servicePackageRepository;
        }
        public async Task<IEnumerable<ServicePackageResponse>> GetServicePackagesAsync()
        {
            var servicePackages = await _servicePackageRepository.GetActiveAsync();

            return servicePackages.Select(sp => new ServicePackageResponse
            {
                PackageId = sp.Id,
                PackageName = sp.PackageName,
                Description = sp.Description,
                Fee = sp.Fee,
                DurationMinutes = sp.DurationMinutes
            });
        }
    }
}
