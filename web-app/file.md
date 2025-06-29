            [Route("api/v1/doctors")]
    [ApiController]
    public class DoctorController : ControllerBase
    {
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
        namespace medical_appointment_booking.Dtos.Response
{
    public class DoctorDetailResponse
    {
        public long DoctorId { get; set; }
        public string FullName { get; set; }
        public SpecialtyDto Specialty { get; set; }
        public string LicenseNumber { get; set; }
        public string Degree { get; set; }
        public int YearsOfExperience { get; set; }
        public decimal ConsultationFee { get; set; }
        public string Bio { get; set; }
        public Gender? Gender { get; set; }
        public bool IsAvailable { get; set; }
    }

    public class SpecialtyDto
    {
        public long SpecialtyId { get; set; }
        public string SpecialtyName { get; set; }
        public string Description { get; set; }
    }
}

namespace medical_appointment_booking.Dtos.Response
{
    public class ApiResponse<T>
    {
        public int code { get; set; }
        public string? message { get; set; }
        public T? result { get; set; }

        public ApiResponse()
        {
        }

        public ApiResponse(int code, string message)
        {
            this.code = code;
            this.message = message;
        }

        public ApiResponse(int code, string message, T result)
        {
            this.code = code;
            this.message = message;
            this.result = result;
        }
    }
    
}
        [HttpGet]
        [Authorize]
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
        [Authorize]
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
        [Authorize]
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

            public class AppointmentResponse
    {
        public long AppointmentId { get; set; }
        public string AppointmentNumber { get; set; }
        public DoctorInfoDto Doctor { get; set; }
        public string AppointmentDate { get; set; }
        public string AppointmentTime { get; set; }
        public string Status { get; set; }
        public decimal TotalFee { get; set; }
        public string ReasonForVisit { get; set; }
        public bool CanCancel { get; set; }
        public bool CanReschedule { get; set; }
    }
        public class CancelAppointmentRequest
    {
        public string CancelReason { get; set; }
    }

        public class RescheduleAppointmentRequest
    {
        public int NewSlotId { get; set; }
        public string NewAppointmentDate { get; set; }
        public string Reason { get; set; }
    }

        public class RescheduleAppointmentResponse
    {
        public long AppointmentId { get; set; }
        public string NewAppointmentDate { get; set; }
        public string NewAppointmentTime { get; set; }
    }

    