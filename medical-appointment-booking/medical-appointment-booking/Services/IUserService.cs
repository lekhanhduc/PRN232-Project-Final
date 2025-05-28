using medical_appointment_booking.Dtos.Request;
using medical_appointment_booking.Dtos.Response;

namespace medical_appointment_booking.Services
{
    public interface IUserService
    {
        Task<UserCreationResponse> CreateUser(UserCreationRequest request);
    }
}
