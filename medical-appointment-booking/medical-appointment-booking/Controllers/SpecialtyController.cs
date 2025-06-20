using medical_appointment_booking.Dtos.Request;
using medical_appointment_booking.Dtos.Response;
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
        public async Task<ApiResponse<SpecialtyCreationResponse>> Creation([FromBody] SpecialtyCreationRequest request)
        {
            return new ApiResponse<SpecialtyCreationResponse>
            {
                code = 200,
                result = await specialtyService.Creation(request)
            };
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ApiResponse<PageResponse<SpecialtyDetailResponse>>> GetAllWithSearch(
            [FromQuery] int page = 1, 
            [FromQuery] int size = 10,
            [FromQuery] string? keyword = "")
        {
            return new ApiResponse<PageResponse<SpecialtyDetailResponse>>
            {
                code = 200,
                result = await specialtyService.GetAllWithSearch(page, size, keyword)
            };
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<ApiResponse<object>> DeleteById(int id) 
        { 
            await specialtyService.DeleteSpecialty(id);
            return new ApiResponse<object>
            {
                code = 200,
                message = "Delete Specialty Sucess"
            };
        }

    }
}
