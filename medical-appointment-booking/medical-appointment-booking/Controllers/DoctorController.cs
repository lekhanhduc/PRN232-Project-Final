using medical_appointment_booking.Common;
using medical_appointment_booking.Dtos.Request;
using medical_appointment_booking.Dtos.Response;
using medical_appointment_booking.Middlewares;
using medical_appointment_booking.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace medical_appointment_booking.Controllers
{
    [Route("api/v1/doctors")]
    [ApiController]
    public class DoctorController : ControllerBase
    {

        private readonly IDoctorService doctorService;

        public DoctorController(IDoctorService doctorService)
        {
            this.doctorService = doctorService;
        }

        [HttpPost]
        [Authorize(Roles = "ADMIN")]
        public async Task<ApiResponse<DoctorCreationResponse>> CreateDoctor([FromBody] DoctorCreationRequest request)
        {
            return new ApiResponse<DoctorCreationResponse> 
            {
                code = 200,
                result = await doctorService.CreateDoctorAsync(request)
            };
        }

        [HttpGet("{doctorId}")]
        public async Task<ApiResponse<DoctorDetailResponse>> GetDoctorDetails(long doctorId)
        {
            var doctor = await doctorService.GetDoctorByIdAsync(doctorId);
            return new ApiResponse<DoctorDetailResponse>
            {
                code = 200,
                result = doctor
            };
        }

        [HttpGet("search")]
        public async Task<ApiResponse<PageResponse<DoctorSearchResponse>>> SearchDoctors(
                           [FromQuery] string? doctorName = null,
                           [FromQuery] string? specialtyName = null,
                           [FromQuery] Gender? gender = null,
                           [FromQuery] bool? isAvailable = null,
                           [FromQuery] string? orderBy = null,
                           [FromQuery] int page = 1,
                           [FromQuery] int pageSize = 10)
        {
            var result = await doctorService.SearchDoctorsAsync(doctorName, specialtyName, gender, isAvailable, orderBy, page, pageSize);
            return new ApiResponse<PageResponse<DoctorSearchResponse>>
            {
                code = 200,
                result = result
            };
        }

    }
}
