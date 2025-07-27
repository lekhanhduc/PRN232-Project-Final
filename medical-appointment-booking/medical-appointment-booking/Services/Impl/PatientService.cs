using medical_appointment_booking.Dtos.Request;
using medical_appointment_booking.Dtos.Response;
using medical_appointment_booking.Middlewares;
using medical_appointment_booking.Models;
using medical_appointment_booking.Repositories;
using Microsoft.AspNetCore.Identity;

namespace medical_appointment_booking.Services.Impl
{
    public class PatientService: IPatientService
    {
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly PatientRepository patientRepository;
        private readonly UserRepository userRepository;
        private readonly CloudinaryService _cloudinaryService;
        private readonly PasswordHasher<User> passwordHasher;

        public PatientService(PatientRepository patientRepository, 
            IHttpContextAccessor httpContextAccessor, UserRepository userRepository, 
            CloudinaryService cloudinaryService)
        {
            this.patientRepository = patientRepository;
            this.httpContextAccessor = httpContextAccessor;
            this.userRepository = userRepository;
            _cloudinaryService = cloudinaryService;
            passwordHasher = new PasswordHasher<User>();
        }

        public async Task ChangePassword(ChangePasswordRequest request)
        {
            var accountIdClaim = httpContextAccessor.HttpContext?.User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(accountIdClaim))
            {
                throw new AppException(ErrorCode.UNAUTHORIZED);
            }

            var accountId = int.Parse(accountIdClaim);
            var existingUser = await userRepository.FindUserById(accountId);
            if (existingUser == null)
            {
                throw new AppException(ErrorCode.USER_NOT_EXISTED);
            }

            var passwordVerificationResult = passwordHasher.VerifyHashedPassword(existingUser, existingUser.Password, request.OldPassword);
            if (passwordVerificationResult == PasswordVerificationResult.Failed)
            {
                throw new AppException(ErrorCode.UNAUTHORIZED);
            }
            
            existingUser.Password = passwordHasher.HashPassword(existingUser, request.NewPassword);
            await userRepository.UpdateUser(existingUser);
        }

        public async Task<PatientDetailResponse> GetInfoPatient()
        {
            var accountIdClaim = httpContextAccessor.HttpContext?.User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(accountIdClaim))
            {
                throw new AppException(ErrorCode.UNAUTHORIZED);
            }

            var accountId = int.Parse(accountIdClaim);

            var existingUser = await userRepository.FindUserById(accountId);

            var user = await patientRepository.GetPatientByUserIdAsync(accountId);
            if (user == null)
            {
                throw new AppException(ErrorCode.USER_NOT_EXISTED);
            }

            return new PatientDetailResponse
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = existingUser.Email,
                Enable2FA = existingUser.Enable2FA,
                Dob = user.Dob,
                Gender = user.Gender,
                Phone = user.Phone,
                Avatar = user.Avatar,
                Address = user.Address
            };
        }

        public async Task<PatientDetailResponse> UpdateProfile(PatientDetailRequest request)
        {
            var accountIdClaim = httpContextAccessor.HttpContext?.User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(accountIdClaim))
            {
                throw new AppException(ErrorCode.UNAUTHORIZED);
            }

            var accountId = int.Parse(accountIdClaim);

            var existingPatient = await patientRepository.GetPatientByUserIdAsync(accountId);
            if (existingPatient == null)
            {
                throw new AppException(ErrorCode.USER_NOT_EXISTED);
            }

            if (!string.IsNullOrWhiteSpace(request.FirstName))
            {
                existingPatient.FirstName = request.FirstName.Trim();
            }

            if (!string.IsNullOrWhiteSpace(request.LastName))
            {
                existingPatient.LastName = request.LastName.Trim();
            }

            if (!string.IsNullOrWhiteSpace(request.Phone))
            {
                existingPatient.Phone = request.Phone.Trim();
            }

            if (request.Dob != default)
            {
                if (request.Dob > DateOnly.FromDateTime(DateTime.Now))
                {
                    throw new AppException(ErrorCode.INVALID_DATE_OF_BIRTH);
                }
                existingPatient.Dob = request.Dob;
            }

            if (request.Gender.HasValue)
            {
                existingPatient.Gender = request.Gender.Value;
            }

            if (!string.IsNullOrWhiteSpace(request.Address))
            {
                existingPatient.Address = request.Address.Trim();
            }

            await patientRepository.UpdatePatientAsync(existingPatient);

            return new PatientDetailResponse
            {
                FirstName = existingPatient.FirstName,
                LastName = existingPatient.LastName,
                Dob = existingPatient.Dob,
                Gender = existingPatient.Gender,
                Phone = existingPatient.Phone,
                Avatar = existingPatient.Avatar,
                Address = existingPatient.Address
            };
        }

        public async Task<string> UploadAvatar(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                throw new AppException(ErrorCode.FILE_INVALID);
            }

            var accountIdClaim = httpContextAccessor.HttpContext?.User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(accountIdClaim))
            {
                throw new AppException(ErrorCode.UNAUTHORIZED);
            }

            var accountId = int.Parse(accountIdClaim);
            var existingPatient = await patientRepository.GetPatientByUserIdAsync(accountId);
            if (existingPatient == null)
            {
                throw new AppException(ErrorCode.USER_NOT_EXISTED);
            }

            using var stream = file.OpenReadStream();
            var imageUrl = await _cloudinaryService.UploadImageAsync(stream, file.FileName);

            existingPatient.Avatar = imageUrl;
            await patientRepository.UpdatePatientAsync(existingPatient);

            return imageUrl;

        }
    }

}
