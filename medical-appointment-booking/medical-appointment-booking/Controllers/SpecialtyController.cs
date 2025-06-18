using medical_appointment_booking.Dtos.Request;
using medical_appointment_booking.Dtos.Response;
using medical_appointment_booking.Models;
using medical_appointment_booking.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace medical_appointment_booking.Controllers
{
    [Route("api/v1/specialty")]
    [ApiController]
    public class SpecialtyController : ControllerBase
    {

        private readonly ISpecialtyService specialtyService;

        public SpecialtyController(ISpecialtyService specialtyService)
        {
            this.specialtyService = specialtyService;
        }

        [HttpPost]
        [Authorize(Roles = "ADMIN")]
        public async Task<ApiResponse<Specialty>> Creation([FromBody] SpecialtyCreationRequest request)
        {
            return new ApiResponse<Specialty>
            {
                code = 200,
                result = await specialtyService.Creation(request)
            };
        }

    }
}
