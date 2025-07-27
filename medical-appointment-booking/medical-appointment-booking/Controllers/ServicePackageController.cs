using medical_appointment_booking.Dtos.Response;
using medical_appointment_booking.Models;
using medical_appointment_booking.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace medical_appointment_booking.Controllers
{
    [Route("api/v1/service-packages")]
    [ApiController]
    public class ServicePackageController : ControllerBase
    {
        private readonly IServicePackageService _servicePackageService;
        public ServicePackageController(IServicePackageService servicePackageService)
        {
            _servicePackageService = servicePackageService;
        }

        [HttpGet("active")]
        public async Task<ApiResponse<IEnumerable<ServicePackageResponse>>> GetActiveServicePackages()
        {
            var servicePackages = await _servicePackageService.GetServicePackagesAsync();
            return new ApiResponse<IEnumerable<ServicePackageResponse>>
            {
                code = 200,
                message = "Active service packages retrieved successfully",
                result = servicePackages
            };
        }
    }
}
