using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using medical_appointment_booking.Dtos.Request;
using medical_appointment_booking.Dtos.Response;
using medical_appointment_booking.Middlewares;
using medical_appointment_booking.Models;
using medical_appointment_booking.Repositories;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;

namespace medical_appointment_booking.Services.Impl
{
    public class AuthService : IAuthService
    {

        private readonly ILogger<AuthenticationService> logger;
        private readonly IJwtService jwtService;
        private readonly PasswordHasher<User> passwordHasher;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly UserRepository userRepository;

        public AuthService(
            ILogger<AuthenticationService> logger,
            IJwtService jwtService,
            IHttpContextAccessor _httpContextAccessor,
            UserRepository userRepository)
        {
            this.logger = logger;
            this.jwtService = jwtService;
            this._httpContextAccessor = _httpContextAccessor;
            this.passwordHasher = new PasswordHasher<User>();
            this.userRepository = userRepository;
        }


        public async Task<SignInResponse> SignIn(SignInRequest request)
        {
            logger.LogInformation("SignIn start ...");

            var user = await userRepository.FindUserByPhone(request.Phone);

            if (user == null)
            {
                logger.LogError("SignIn Failed: User not found.");
                throw new AppException(ErrorCode.USER_NOT_EXISTED);
            }

            if (!user.Enabled)
            {
                throw new AppException(ErrorCode.ACCOUNT_LOCKED);
            }

            var passwordVerificationResult = passwordHasher.VerifyHashedPassword(user, user.Password, request.Password);

            if (passwordVerificationResult != PasswordVerificationResult.Success)
            {
                logger.LogError("SignIn Failed: Invalid password.");
                throw new AppException(ErrorCode.UNAUTHORIZED);
            }

            var claims = new[]
            {
                new Claim("userId", user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("Authorities", user.Role.Name)
            };

            var accessToken = jwtService.GenerateAccessToken(claims);
            var refreshToken = jwtService.GenerateRefreshToken(claims);

            // Kiểm tra HttpContext trước khi đặt cookie
            var httpContext = _httpContextAccessor?.HttpContext;
            if (httpContext != null)
            {
                httpContext.Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = false,
                    SameSite = SameSiteMode.Lax,
                    Expires = DateTimeOffset.UtcNow.AddDays(14)
                });
            }


            logger.LogInformation("SignIn success for userId: {UserId}", user.Id);

            return new SignInResponse(accessToken, refreshToken, "Bearer");
        }

        public Task<SignInResponse> RefreshToken()
        {
            throw new NotImplementedException();
        }

        public Task SignOut()
        {
            throw new NotImplementedException();
        }
    }
}
