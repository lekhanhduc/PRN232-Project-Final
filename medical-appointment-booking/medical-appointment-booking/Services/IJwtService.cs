using System.Security.Claims;

namespace medical_appointment_booking.Services
{
    public interface IJwtService
    {
        string GenerateAccessToken(Claim[] claims);
        string GenerateRefreshToken(Claim[] claims);
    }
}
