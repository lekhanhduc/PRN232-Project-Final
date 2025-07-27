using medical_appointment_booking.Dtos.Request;
using medical_appointment_booking.Dtos.Response;
using medical_appointment_booking.Middlewares;
using medical_appointment_booking.Services;
using medical_appointment_booking.Services.Impl;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace medical_appointment_booking.Controllers
{
    [Route("api/v1/doctor-schedules")]
    [ApiController]
    public class DoctorScheduleController : ControllerBase
    {
        private readonly IDoctorScheduleService _doctorScheduleService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public DoctorScheduleController(IDoctorScheduleService doctorScheduleService, IHttpContextAccessor httpContextAccessor)
        {
            _doctorScheduleService = doctorScheduleService;
            _httpContextAccessor = httpContextAccessor;
        }

        // DOC001: Get My Work Schedule
        [HttpGet("schedule")]
        //[Authorize(Roles = "DOCTOR")]
        public async Task<ApiResponse<List<WorkScheduleResponse>>> GetDoctorWorkSchedule(
            [FromQuery] DateOnly? fromDate = null,
            [FromQuery] DateOnly? toDate = null)
        {
            var doctorId = GetCurrentUserId();
            var result = await _doctorScheduleService.GetMyWorkScheduleAsync(doctorId, fromDate, toDate);
            return new ApiResponse<List<WorkScheduleResponse>>
            {
                code = 200,
                result = result
            };
        }

        // DOC002: Get My Appointments
        [HttpGet("appointments")]
        //[Authorize(Roles = "DOCTOR")]
        public async Task<ApiResponse<PageResponse<AppointmentDoctorResponse>>> GetDoctorAppointments(
            [FromQuery] DateOnly? appointmentDate = null,
            [FromQuery] string? status = null,
            [FromQuery] string? orderBy = "appointmentTime",
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            var doctorId = GetCurrentUserId();
            var request = new DoctorAppointmentFilterRequest
            {
                AppointmentDate = appointmentDate,
                Status = status,
                OrderBy = orderBy,
                Page = page,
                PageSize = pageSize
            };

            var result = await _doctorScheduleService.GetMyAppointmentsAsync(doctorId, request);
            return new ApiResponse<PageResponse<AppointmentDoctorResponse>>
            {
                code = 200,
                result = result
            };
        }

        // DOC003: Mark Patient Arrived
        [HttpPut("appointments/{appointmentId}/arrived")]
        //[Authorize(Roles = "DOCTOR")]
        public async Task<ApiResponse<string>> MarkPatientArrived(long appointmentId)
        {
            var doctorId = GetCurrentUserId();
            var success = await _doctorScheduleService.MarkPatientArrivedAsync(appointmentId, doctorId);

            if (!success)
            {
                return new ApiResponse<string>
                {
                    code = 400,
                    message = "Bệnh nhân đã được đánh dấu có mặt trước đó hoặc trạng thái không hợp lệ"
                };
            }

            return new ApiResponse<string>
            {
                code = 200,
                message = "Đã đánh dấu bệnh nhân có mặt"
            };
        }

        // DOC004: Complete Appointment
        [HttpPut("appointments/{appointmentId}/complete")]
        //[Authorize(Roles = "DOCTOR")]
        public async Task<ApiResponse<string>> CompleteAppointment(
            long appointmentId,
            [FromBody] CompleteAppointmentRequest request)
        {
            var doctorId = GetCurrentUserId();
            var success = await _doctorScheduleService.CompleteAppointmentAsync(appointmentId, doctorId, request);

            if (!success)
            {
                return new ApiResponse<string>
                {
                    code = 400,
                    message = "Không thể hoàn thành ca khám. Trạng thái không hợp lệ."
                };
            }

            return new ApiResponse<string>
            {
                code = 200,
                message = "Hoàn thành ca khám thành công"
            };
        }

        // DOC005: Request Leave
        [HttpPost("leaves")]
        //[Authorize(Roles = "DOCTOR")]
        public async Task<ApiResponse<LeaveResponse>> RequestLeave(
            [FromBody] LeaveRequest request)
        {
            var doctorId = GetCurrentUserId();
            var response = await _doctorScheduleService.RequestLeaveAsync(doctorId, request);

            return new ApiResponse<LeaveResponse>
            {
                code = 200,
                message = "Đã gửi yêu cầu nghỉ thành công",
                result = response
            };
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = _httpContextAccessor.HttpContext?.User.Claims
                .FirstOrDefault(c => c.Type == "userId");

            if (userIdClaim == null)
            {
                throw new AppException(ErrorCode.USER_NOT_EXISTED);
            }

            return int.Parse(userIdClaim.Value);
        }
    }
}
