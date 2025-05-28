using medical_appointment_booking.Dtos.Request;
using medical_appointment_booking.Dtos.Response;

namespace medical_appointment_booking.Services
{
    public interface IAuthService
    {
        Task<SignInResponse> SignIn(SignInRequest request);
        Task<SignInResponse> RefreshToken();
        Task SignOut();
    }
}
