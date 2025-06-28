using medical_appointment_booking.Dtos.Request;
using medical_appointment_booking.Dtos.Response;
using medical_appointment_booking.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace medical_appointment_booking.Controllers
{
    [Route("api/v1/patients")]
    [ApiController]
    public class PatientController : ControllerBase
    {

        private readonly IPatientService patientService;

        public PatientController(IPatientService patientService)
        {
            this.patientService = patientService;
        }

        [HttpGet]
        [Authorize]
        public async Task<ApiResponse<PatientDetailResponse>> GetInfoDetailPatient()
        {
            return new ApiResponse<PatientDetailResponse>
            {
                code = 200,
                result = await patientService.GetInfoPatient()
            };
        }

        [HttpPut]
        [Authorize]
        public async Task<ApiResponse<PatientDetailResponse>> UpdateProfile([FromBody] PatientDetailRequest request)
        {
            return new ApiResponse<PatientDetailResponse>
            {
                code = 200,
                result = await patientService.UpdateProfile(request)
            };
        }
    }
}
