    [Route("api/[controller]")]
    [ApiController]
    public class ReceptionistController : ControllerBase
    {
                [HttpPost]
        [Route("appointments")]
        [Authorize]
        public async Task<ApiResponse<CreateAppointmentResponse>> AddAppointment([FromBody] AppointmentCreationRequest appointmentRequest)
        {
            int currentUserId = GetCurrentUserId();
            var response = await _receptionistService.AddAppointmentAsync(appointmentRequest, currentUserId);
            return new ApiResponse<CreateAppointmentResponse>
            {
                code = 200,
                result = response
            };
        }

        public class AppointmentCreationRequest
{

    public long PatientId { get; set; }

    public long DoctorId { get; set; }

    public int SlotId { get; set; }

    public string AppointmentDate { get; set; } // Format: "2024-06-10"

    public string? ReasonForVisit { get; set; }
    public int PackageId { get; set; }

}

public class CreateAppointmentResponse
{
    public long AppointmentId { get; set; }
    public string AppointmentNumber { get; set; }
    public DoctorInfoDto Doctor { get; set; }
    public string AppointmentDate { get; set; }
    public string AppointmentTime { get; set; }
    public decimal TotalFee { get; set; }
    public string Status { get; set; }
}

public class DoctorInfoDto
{
    public long DoctorId { get; set; }
    public string FullName { get; set; }
    public string Specialty { get; set; }
}