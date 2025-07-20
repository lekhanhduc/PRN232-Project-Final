using medical_appointment_booking.Common;
using medical_appointment_booking.Dtos.Request;
using medical_appointment_booking.Dtos.Response;
using medical_appointment_booking.Middlewares;
using medical_appointment_booking.Services;
using medical_appointment_booking.Services.Impl;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace medical_appointment_booking.Controllers
{
    [Route("api/v1/doctors")]
    [ApiController]
    public class DoctorController : ControllerBase
    {

        private readonly IDoctorService doctorService;
        private readonly IExcelService excelService;

        public DoctorController(IDoctorService doctorService, IExcelService excelService)
        {
            this.doctorService = doctorService;
            this.excelService = excelService;
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

        [HttpGet]
        [Authorize(Roles = "ADMIN")]
        public async Task<ApiResponse<PageResponse<DoctorDetailResponse>>> GetAllWithSearch(
           [FromQuery] string? specialtyName = null,
           [FromQuery] Gender? gender = null,
           [FromQuery] bool? isAvailable = null,
           [FromQuery] string? orderBy = null,
           [FromQuery] int page = 1,
           [FromQuery] int pageSize = 10,
           [FromQuery] string? keyword = "")
        {
            return new ApiResponse<PageResponse<DoctorDetailResponse>>
            {
                code = 200,
                result = await doctorService.GetAllWithSearch(page, pageSize, keyword, specialtyName, gender, isAvailable, orderBy)
            };
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<ApiResponse<object>> DeleteById(long id)
        {
            await doctorService.DeleteDoctor(id);
            return new ApiResponse<object>
            {
                code = 200,
                message = "Delete Doctor Sucess"
            };
        }

        [HttpPut]
        //[Authorize(Roles = "ADMIN")]
        public async Task<ApiResponse<DoctorDetailResponse>> UpdateDoctor([FromBody] DoctorUpdateRequest request)
        {
            return new ApiResponse<DoctorDetailResponse>
            {
                code = 200,
                result = await doctorService.UpdateDoctor(request)
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

        [HttpPost("import-excel")]
        public async Task<ApiResponse<object>> ImportSchedules(IFormFile file)
        {         
            using var stream = file.OpenReadStream();
            var result = await excelService.ImportSchedulesWithSlotsFromExcel(stream);

            return new ApiResponse<object>
            {
                code = 200,
                message = "Create Schedule Doctor Sucess"
            };
        }

        [HttpGet("{doctorId}/schedule")]
        public async Task<ApiResponse<DoctorAppointmentScheduleResponse>> GetDoctorAppointmentSchedule(
                        long doctorId,
                        [FromQuery] DateOnly? fromDate = null,
                        [FromQuery] DateOnly? toDate = null)
        {
            var schedule = await doctorService.GetDoctorAppointmentScheduleAsync(doctorId, fromDate, toDate);
            return new ApiResponse<DoctorAppointmentScheduleResponse>
            {
                code = 200,
                result = schedule
            };
        }

        [HttpGet("{doctorId}/working-schedule")]
        public async Task<ApiResponse<DoctorWorkingScheduleResponse>> GetDoctorSchedule(
                        long doctorId,
                        [FromQuery] int daysAhead = 14)
        {
            var schedule = await doctorService.GetDoctorWorkingScheduleAsync(doctorId, daysAhead);
            return new ApiResponse<DoctorWorkingScheduleResponse>
            {
                code = 200,
                result = schedule
            };
        }

        [HttpGet("{doctorId}/slot-day")]
        public async Task<ApiResponse<DoctorWorkingScheduleResponse>> GetDoctorScheduleSpecificDay(
                       long doctorId,
                       [FromQuery] DateOnly fromDate)
        {
            var schedule = await doctorService.GetDoctorWorkingScheduleSpecialDayAsync(doctorId, fromDate);
            return new ApiResponse<DoctorWorkingScheduleResponse>
            {
                code = 200,
                result = schedule
            };
        }

    }
}
