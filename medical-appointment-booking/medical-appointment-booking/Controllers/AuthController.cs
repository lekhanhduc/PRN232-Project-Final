using System.Net;
using medical_appointment_booking.Dtos.Request;
using medical_appointment_booking.Dtos.Response;
using medical_appointment_booking.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace medical_appointment_booking.Controllers
{
    [Route("/api/v1/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService authService;

        public AuthController(IAuthService authService)
        {
            this.authService = authService;
        }

        [HttpPost("sign-in")]
        public async Task<ApiResponse<SignInResponse>> SignIn([FromBody] SignInRequest request)
        {
            var result = await authService.SignIn(request);
            return new ApiResponse<SignInResponse>
            {
                code = ((int)HttpStatusCode.OK),
                message = "Sign-in successful",
                result = result
            };
        }

    }
}
