using medical_appointment_booking.Common;
using medical_appointment_booking.Dtos.Request;
using medical_appointment_booking.Dtos.Response;
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


        [HttpGet("{id}")]
        //[Authorize(Roles = "ADMIN,DOCTOR")]
        public async Task<ApiResponse<DoctorDetailResponse>> GetDoctorById(long id)
        {
            var result = await doctorService.GetDoctorByIdAsync(id);
            return new ApiResponse<DoctorDetailResponse> { code = 200, result = result };
        }

        [HttpPut("{id}")]
        [HttpGet("schedule")]
        //[Authorize(Roles = "DOCTOR")]
        public async Task<ApiResponse<List<WorkScheduleResponse>>> GetMyWorkSchedule([FromQuery] long doctorId)
        {
            var result = await doctorService.GetMyWorkScheduleAsync(doctorId);
            return new ApiResponse<List<WorkScheduleResponse>> { code = 200, result = result };
        }


        [HttpGet("appointments")]
        //[Authorize(Roles = "DOCTOR")]  
        public async Task<ApiResponse<List<AppointmentResponse>>> GetMyAppointments([FromQuery] long doctorId)
        {
            var result = await doctorService.GetMyAppointmentsAsync(doctorId);
            return new ApiResponse<List<AppointmentResponse>> { code = 200, result = result };
        }

        //[HttpPut("appointments/{appointmentId}/arrived")]
        //// [Authorize(Roles = "DOCTOR")] // nếu cần bảo vệ quyền
        //public async Task<ApiResponse<string>> MarkPatientArrived(long appointmentId, [FromQuery] long doctorId)
        //{
        //    var success = await doctorService.MarkPatientArrivedAsync(appointmentId, doctorId);

        //    if (!success)
        //    {
        //        return new ApiResponse<string>
        //        {
        //            code = 400,
        //            success = false,
        //            message = "Bệnh nhân đã được đánh dấu có mặt trước đó"
        //        };
        //    }

        //    return new ApiResponse<string>
        //    {
        //        code = 200,
        //        success = true,
        //        message = "Đã đánh dấu bệnh nhân có mặt"
        //    };
        //}

        [HttpPost("leaves")]
        // [Authorize(Roles = "DOCTOR")]
        public async Task<ApiResponse<string>> RequestLeave([FromQuery] long doctorId, [FromBody] LeaveRequest request)
        {
            var response = await doctorService.RequestLeaveAsync(doctorId, request);

            return new ApiResponse<string>
            {
                code = 200,
                success = true,
                message = "Đã gửi yêu cầu nghỉ"
            };
        }

    }
}
