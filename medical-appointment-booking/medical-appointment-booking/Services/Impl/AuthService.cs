using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using medical_appointment_booking.Common;
using medical_appointment_booking.Dtos.Request;
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
        private readonly UserRepository userRepository;
        private readonly RoleRepository roleRepository;
        private readonly GoogleAuthClient googleAuthClient;
        private readonly GoogleUserInfoClient googleUserInfoClient;
        private readonly PatientRepository patientRepository;
        private readonly FacebookAuthClient facebookAuthClient;
        private readonly FacebookUserInfoClient facebookUserInfoClient;

        public AuthService(
            ILogger<AuthenticationService> logger,
            IJwtService jwtService,
            UserRepository userRepository,
            RoleRepository roleRepository,
            GoogleAuthClient googleAuthClient,
            GoogleUserInfoClient googleUserInfoClient,
            PatientRepository patientRepository,
            FacebookAuthClient facebookAuthClient,
            FacebookUserInfoClient facebookUserInfoClient)
        {
            this.logger = logger;
            this.jwtService = jwtService;
            passwordHasher = new PasswordHasher<User>();
            this.userRepository = userRepository;
            this.roleRepository = roleRepository;
            this.googleAuthClient = googleAuthClient;
            this.googleUserInfoClient = googleUserInfoClient;
            this.patientRepository = patientRepository;
            this.facebookAuthClient = facebookAuthClient;
            this.facebookUserInfoClient = facebookUserInfoClient;
        }

        public async Task<SignInResponse> SignIn(SignInRequest request)
        {
            logger.LogInformation("SignIn start ...");

            var user = await userRepository.FindUserByEmailOrPhone(request.PhoneOrEmail);

            if (user == null)
            {
                logger.LogError("SignIn Failed: User not found.");
                throw new AppException(ErrorCode.USER_NOT_EXISTED);
            }


            var passwordVerificationResult = passwordHasher.VerifyHashedPassword(user, user.Password, request.Password);

            if (passwordVerificationResult != PasswordVerificationResult.Success)
            {
                logger.LogError("SignIn Failed: Invalid password.");
                throw new AppException(ErrorCode.UNAUTHORIZED);
            }

            if (user.UserStatus == UserStatus.INACTIVE)
            {
                throw new AppException(ErrorCode.ACCOUNT_LOCKED);
            }

            if (user.UserStatus == UserStatus.PENDING_VERIFICATION)
            {

                return new SignInResponse(TwoFaStep.SETUP_REQUIRED);
            }

            if (user.Role?.Name == DefinitionRole.DOCTOR && user.UserStatus == UserStatus.ACTIVE && user.Enable2FA)
            {
                // xác minh OTP
                return new SignInResponse(TwoFaStep.VERIFICATION_REQUIRED);
            }
            
            if (user.Enable2FA)
            {
            
                return new SignInResponse(TwoFaStep.VERIFICATION_REQUIRED);
            }

            var claims = new[]
            {
                new Claim("userId", user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("Authorities", user.Role.Name)
            };

            var accessToken = jwtService.GenerateAccessToken(claims);
            var refreshToken = jwtService.GenerateRefreshToken(claims);

            logger.LogInformation("SignIn success for userId: {UserId}", user.Id);

            return new SignInResponse(accessToken, refreshToken, user.Role.Name, "Bearer", TwoFaStep.NONE);
        }

        public async Task<SignInResponse> SignInWithGoogle(string code)
        {

            var token = await googleAuthClient.ExchangeTokenAsync(code);
            var userInfo = await googleUserInfoClient.GetUserInfoAsync(token.AccessToken);

            var user = await userRepository.FindUserByEmail(userInfo.Email);

            if (user == null)
            {
                var role = await roleRepository.FindByRoleName(DefinitionRole.USER);
                if (role == null)
                {
                    role = new Role();
                    role.Name = DefinitionRole.USER;
                    await roleRepository.CreateRole(role);
                }
                user = new User
                {
                    Email = userInfo.Email,
                    Role = role
                };
                await userRepository.CreateUserAsync(user);

                Patient patient = new Patient
                {
                    UserId = user.Id,
                    FirstName = userInfo.GivenName,
                    LastName = userInfo.FamilyName,
                    Avatar = userInfo.Picture,
                };
                await patientRepository.CreatePatientAsync(patient);
            }

            var claims = new[]
            {
                new Claim("userId", user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("Authorities", user.Role.Name)
            };

            var accessToken = jwtService.GenerateAccessToken(claims);
            var refreshToken = jwtService.GenerateRefreshToken(claims);

            logger.LogInformation("SignIn Google success for userId: {UserId}", user.Id);

            return new SignInResponse(accessToken, refreshToken, user.Role.Name, "Bearer", TwoFaStep.NONE);
        }


        public async Task<SignInResponse> SignInWithFacebook(string code)
        {
            var exchangeToken = await facebookAuthClient.ExchangeTokenAsync(code);
            if (exchangeToken == null)
            {
                throw new ArgumentException("Exchange token is null");
            }
            var userInfo = await facebookUserInfoClient.GetUserProfileAsync(exchangeToken.AccessToken);

            if (userInfo == null)
            {
                throw new ArgumentException("Profile is null");
            }

            var email = userInfo.Email;
            if (string.IsNullOrEmpty(email))
            {
                email = GenerateUniqueEmail("facebook");
                logger.LogWarning("Email không có sẵn, đã sinh email tạm: {Email}", email);
            }

            var user = await userRepository.FindUserByEmail(email);

            if (user == null)
            {
                var role = await roleRepository.FindByRoleName(DefinitionRole.USER);
                if (role == null)
                {
                    role = new Role();
                    role.Name = DefinitionRole.USER;
                    await roleRepository.CreateRole(role);
                }
                user = new User
                {
                    Email = email,
                    Role = role
                };

                await userRepository.CreateUserAsync(user);

                Patient patient = new Patient
                {
                    UserId = user.Id,
                    Avatar = userInfo.Picture.Data.Url,
                };
                await patientRepository.CreatePatientAsync(patient);
            }

            var claims = new[]
            {
            new Claim("userId", user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim("Authorities", user.Role.Name)
        };

            var accessToken = jwtService.GenerateAccessToken(claims);
            var refreshToken = jwtService.GenerateRefreshToken(claims);

            logger.LogInformation("Đăng nhập bằng Facebook thành công cho userId: {UserId}", user.Id);

            return new SignInResponse(accessToken, refreshToken, user.Role.Name, "Bearer", TwoFaStep.NONE);
        }

        public Task<SignInResponse> RefreshToken()
        {
            throw new NotImplementedException();
        }

        public Task SignOut()
        {
            throw new NotImplementedException();
        }


        private string GenerateUniqueEmail(string login)
        {
            var uniqueId = Guid.NewGuid().ToString("N"); // "N" để tạo chuỗi không có dấu gạch nối
            return $"{login}-{uniqueId}@generated.com";
        }
    }
}
