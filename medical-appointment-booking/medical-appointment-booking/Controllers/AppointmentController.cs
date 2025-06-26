using medical_appointment_booking.Dtos.Request;
using medical_appointment_booking.Dtos.Response;
using medical_appointment_booking.Middlewares;
using medical_appointment_booking.Services;
using Microsoft.AspNetCore.Mvc;

namespace medical_appointment_booking.Controllers
{
    [Route("api/v1/appointments")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly IAppointmentService appointmentService;
        private readonly IHttpContextAccessor httpContextAccessor;

        public AppointmentController(IAppointmentService appointmentService, IHttpContextAccessor httpContextAccessor)
        {
            this.appointmentService = appointmentService;
            this.httpContextAccessor = httpContextAccessor;
        }

        [HttpPost("create")]
        public async Task<ApiResponse<CreateAppointmentResponse>> CreateAppointment([FromBody] CreateAppointmentRequest request)
        {
            var currentUserId = GetCurrentUserId();
            return new ApiResponse<CreateAppointmentResponse>
            {
                code = 201,
                result = await appointmentService.CreateAppointmentAsync(request, currentUserId)
            };
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<IEnumerable<AppointmentResponse>>>> GetMyAppointments()
        {
            try
            {
                var currentUserId = GetCurrentUserId();

                var appointmentsQuery = await appointmentService.GetMyAppointmentsAsync(currentUserId);

                return Ok(new ApiResponse<IQueryable<AppointmentResponse>>
                {
                    code = 200,
                    result = appointmentsQuery
                });
            }
            catch (AppException ex)
            {
                return StatusCode((int)ex.ErrorCode.StatusCode, new ApiResponse<object>
                {
                    code = ex.ErrorCode.Code,
                    message = ex.ErrorCode.Message
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<object>
                {
                    code = 500,
                    message = "An error occurred while retrieving appointments"
                });
            }
        }

        [HttpPut("{appointmentId}/cancel")]
        public async Task<ActionResult<ApiResponse<object>>> CancelAppointment(
                                       long appointmentId,
                                       [FromBody] CancelAppointmentRequest request)
        {
            try
            {
                var currentUserId = GetCurrentUserId();
                await appointmentService.CancelAppointmentAsync(appointmentId, request, currentUserId);

                return Ok(new ApiResponse<object>
                {
                    code = 200,
                    message = "Hủy lịch hẹn thành công"
                });
            }
            catch (AppException ex)
            {
                return StatusCode((int)ex.ErrorCode.StatusCode, new ApiResponse<object>
                {
                    code = ex.ErrorCode.Code,
                    message = ex.ErrorCode.Message
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<object>
                {
                    code = 500,
                    message = "An error occurred while canceling appointment"
                });
            }
        }

        [HttpPut("{appointmentId}/reschedule")]
        public async Task<ActionResult<ApiResponse<RescheduleAppointmentResponse>>> RescheduleAppointment(
            long appointmentId,
            [FromBody] RescheduleAppointmentRequest request)
        {
            try
            {
                var currentUserId = GetCurrentUserId();
                var result = await appointmentService.RescheduleAppointmentAsync(appointmentId, request, currentUserId);

                return Ok(new ApiResponse<RescheduleAppointmentResponse>
                {
                    code = 200,
                    message = "Thay đổi lịch hẹn thành công"
                });
            }
            catch (AppException ex)
            {
                return StatusCode((int)ex.ErrorCode.StatusCode, new ApiResponse<RescheduleAppointmentResponse>
                {
                    code = ex.ErrorCode.Code,
                    message = ex.ErrorCode.Message
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ApiResponse<RescheduleAppointmentResponse>
                {
                    code = 500,
                    message = "An error occurred while rescheduling appointment"
                });
            }
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = httpContextAccessor.HttpContext?.User.Claims
                .FirstOrDefault(c => c.Type == "userId");

            if (userIdClaim == null)
            {
                throw new AppException(ErrorCode.USER_NOT_EXISTED);
            }

            return int.Parse(userIdClaim.Value);
        }
    }
}
