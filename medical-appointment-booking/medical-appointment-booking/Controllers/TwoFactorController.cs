using medical_appointment_booking.Dtos.Request;
using medical_appointment_booking.Dtos.Response;
using medical_appointment_booking.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace medical_appointment_booking.Controllers
{
    [Route("api/v1/2fa")]
    [ApiController]
    [AllowAnonymous]
    public class TwoFactorController: ControllerBase
    {

        private readonly TwoFactorService twoFactorService;

        public TwoFactorController(TwoFactorService twoFactorService)
        {
            this.twoFactorService = twoFactorService;
        }

        [HttpPost]
        public async Task<ApiResponse<string>> EnableMFT ([FromBody] Enable2FARequest request)
        {
            return new ApiResponse<string>
            {
                code = 200,
                result = await twoFactorService.Enable2FA(request)
            };
        }

        [HttpPost("verify")]
        public async Task<ApiResponse<SignInResponse>> VerifyCode([FromBody] Verify2FARequest request)
        {
            return new ApiResponse<SignInResponse>
            {
                code = 200,
                result = await twoFactorService.VerifyCode(request)

            };
        }
            
    }
}
