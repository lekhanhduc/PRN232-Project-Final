using medical_appointment_booking.Dtos.Request;
using medical_appointment_booking.Dtos.Response;
using medical_appointment_booking.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace medical_appointment_booking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ManagerController : ControllerBase
    {
        private readonly IManagerService managerService;
        public ManagerController(IManagerService managerService)
        {
            this.managerService = managerService;
        }

        [HttpGet]
        [Route("receptionists")]  
        public async Task<ApiResponse<IEnumerable<ReceptionistResponse>>> GetAllReceptionist()
        {
            var receptionists = await managerService.GetAllReceptionist();
            return new ApiResponse<IEnumerable<ReceptionistResponse>>
            {
                code = 200,
                result = receptionists
            };

        }

        [HttpGet("receptionists/{id}")]
        public async Task<ApiResponse<ReceptionistResponse>> GetReceptionistById(int id)
        {
            var receptionist = await managerService.GetReceptionistById(id);
            if (receptionist == null)
            {
                return new ApiResponse<ReceptionistResponse>
                {
                    code = 404,
                    message = "Receptionist not found"
                };
            }
            return new ApiResponse<ReceptionistResponse>
            {
                code = 200,
                result = receptionist
            };
        }

        [HttpPost]
        [Route("receptionists")]
        public async Task<ApiResponse<ReceptionistResponse>> AddReceptionist([FromBody] ReceptionistRequest request)
        {
            var receptionist = await managerService.AddReceptionist(request);
            return new ApiResponse<ReceptionistResponse>
            {
                code = 201,
                result = receptionist
            };
        }

        [HttpPut("receptionists/{id}")]
        public async Task<ApiResponse<ReceptionistResponse>> UpdateReceptionist(int id, [FromBody] ReceptionistRequest request)
        {
            var receptionist = await managerService.UpdateReceptionist(id, request);
            if (receptionist == null)
            {
                return new ApiResponse<ReceptionistResponse>
                {
                    code = 404,
                    message = "Receptionist not found"
                };
            }
            return new ApiResponse<ReceptionistResponse>
            {
                code = 200,
                result = receptionist
            };
        }

        [HttpDelete("receptionists/{id}")]
        public async Task<IActionResult> DeleteReceptionist(long id)
        {
            var receptionist = await managerService.GetReceptionistById(id);
            if (receptionist == null)
            {
                return NotFound(new ApiResponse<string>
                {
                    code = 404,
                    message = "Receptionist not found"
                });
            }
            await managerService.DeleteReceptionist(id);
            return Ok(new ApiResponse<string>
            {
                code = 200,
                message = "Receptionist deleted successfully"
            });
        }
    }
}
