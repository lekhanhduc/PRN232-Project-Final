using medical_appointment_booking.Dtos.Request;
using medical_appointment_booking.Dtos.Response;
using medical_appointment_booking.Middlewares;
using medical_appointment_booking.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace medical_appointment_booking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReceptionistController : ControllerBase
    {
        private readonly IReceptionistService _receptionistService;
        private readonly IAppointmentService _appointmentService;

        public ReceptionistController(IAppointmentService appointmentService, IReceptionistService receptionistService)
        {
            _appointmentService = appointmentService;
            _receptionistService = receptionistService;
        }

        [HttpGet("patients/search")]
        public async Task<ApiResponse<PageResponse<PatientDto>>> SearchPatients(
        [FromQuery] string? query,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
        {
            try
            {
                // Validate pagination parameters
                if (page < 1) page = 1;
                if (pageSize < 1 || pageSize > 100) pageSize = 10;

                var result = await _receptionistService.SearchPatientsAsync(query, page, pageSize);

                return new ApiResponse<PageResponse<PatientDto>>
                {
                    code = 200,
                    message = "Success",
                    result = result
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse<PageResponse<PatientDto>>
                {
                    code = 500,
                    message = "Internal server error"
                };
            }
        }

        [HttpPost]
        [Route("appointments")]
        public async Task<ApiResponse<AppointmentCreationResponse>> AddAppointment([FromBody] AppointmentCreationRequest appointmentRequest)
        {
            var response = await _receptionistService.AddAppointmentAsync(appointmentRequest);
            return new ApiResponse<AppointmentCreationResponse>
            {
                code = 200,
                result = response
            };
        }

        [HttpGet]
        [Route("appointments")]
        public async Task<ApiResponse<IEnumerable<AppointmentListDto>>> GetAppointmentsByDateAndQueryAsync(
                                        [FromQuery] DateOnly? date,
                                        [FromQuery] string? query)
        {
            // Nếu không truyền date thì mặc định lấy ngày hôm nay
            var targetDate = date ?? DateOnly.FromDateTime(DateTime.Now);

            var appointments = await _receptionistService.GetAppointmentsByDateAndQueryAsync(targetDate, query);
            return new ApiResponse<IEnumerable<AppointmentListDto>>
            {
                code = 200,
                result = appointments
            };
        }

        [HttpPut("appointments/{appointmentId}/cancel")]
        //[Authorize]
        public async Task<ActionResult<ApiResponse<object>>> CancelAppointment(
                                       long appointmentId,
                                       long patientId,
                                       [FromBody] CancelAppointmentRequest request)
        {
            try
            {
                var currentUser = await _receptionistService.GetPatientByPatientIdAsync(patientId);
                await _appointmentService.CancelAppointmentAsync(appointmentId, request, (int)currentUser.UserId);

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


    }
}
