using medical_appointment_booking.Dtos.Request;
using medical_appointment_booking.Dtos.Response;
using medical_appointment_booking.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace medical_appointment_booking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReceptionistController : ControllerBase
    {
        private readonly IReceptionistService _receptionistService; 

        public ReceptionistController(IReceptionistService receptionistService)
        {
            _receptionistService = receptionistService;
        }

        [HttpGet]
        [Route("patients/search")]
        public async Task<ApiResponse<IEnumerable<PatientDto>>> SearchPatients([FromQuery] string query)
        {
            var patients = await _receptionistService.SearchPatientsAsync(query);
            return new ApiResponse<IEnumerable<PatientDto>>
            {
                code = 200,
                result = patients
            };
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
        [Route("appointments/today")]
        public async Task<ApiResponse<IEnumerable<AppointmentTodayResponse>>> GetTodayAppointments()
        {
            var appointments = await _receptionistService.GetTodayAppointmentsAsync();

            return new ApiResponse<IEnumerable<AppointmentTodayResponse>>
            {
                code = 200,
                result = appointments
            };
        }

        [HttpPut("appointments/{appointmentId}/cancel")]
        public async Task<ApiResponse<bool>> CancelAppointment(long appointmentId, [FromBody] CancelAppointmentRequest request)
        {
            var success = await _receptionistService.CancelAppointmentAsync(appointmentId, request.CancelReason);

            return new ApiResponse<bool>
            {
                code = success ? 200 : 404,
                result = success
            };
        }


    }
}
