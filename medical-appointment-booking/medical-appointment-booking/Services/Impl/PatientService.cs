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
        private readonly DoctorRepository doctorRepository;
        private readonly SpecialtyRepository specialtyRepository;

        public PatientService(PatientRepository patientRepository,
            IHttpContextAccessor httpContextAccessor, UserRepository userRepository,
            CloudinaryService cloudinaryService, DoctorRepository doctorRepository,
            SpecialtyRepository specialtyRepository)
        {
            this.patientRepository = patientRepository;
            this.httpContextAccessor = httpContextAccessor;
            this.userRepository = userRepository;
            _cloudinaryService = cloudinaryService;
            passwordHasher = new PasswordHasher<User>();
            this.doctorRepository = doctorRepository;
            this.specialtyRepository = specialtyRepository;
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

        public async Task<object> GetInfoPatient()
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

            var userRole = httpContextAccessor.HttpContext?.User.FindFirst("Authorities")?.Value;

            switch (userRole?.ToUpper())
            {
                case "PATIENT":
                    return await GetPatientProfile(accountId, existingUser);

                case "DOCTOR":
                    return await GetDoctorProfile(accountId, existingUser);

                default:
                    throw new AppException(ErrorCode.INVALID_ROLE);
            }
        }

        private async Task<PatientDetailResponse> GetPatientProfile(int accountId, User existingUser)
        {
            var patient = await patientRepository.GetPatientByUserIdAsync(accountId);
            if (patient == null)
            {
                throw new AppException(ErrorCode.USER_NOT_EXISTED);
            }

            return new PatientDetailResponse
            {
                FirstName = patient.FirstName,
                LastName = patient.LastName,
                Email = existingUser.Email,
                Enable2FA = existingUser.Enable2FA,
                Dob = patient.Dob,
                Gender = patient.Gender,
                Phone = patient.Phone,
                Avatar = patient.Avatar,
                Address = patient.Address,
                UserType = patient.User.Role.Name
            };
        }

        private async Task<DoctorDetailResponse> GetDoctorProfile(int accountId, User existingUser)
        {
            var doctor = await doctorRepository.GetDoctorByUserIdAsync(accountId);
            if (doctor == null)
            {
                throw new AppException(ErrorCode.DOCTOR_NOT_FOUND);
            }

            var specialty = doctor.SpecialtyId.HasValue ?
                await specialtyRepository.GetSpecialty(doctor.SpecialtyId.Value) : null;

            return new DoctorDetailResponse
            {
                DoctorId = doctor.Id,
                FullName = $"{doctor.FirstName} {doctor.LastName}".Trim(),
                Email = existingUser.Email ?? string.Empty,
                Phone = existingUser.Phone ?? string.Empty,
                Specialty = doctor.Specialty != null ? new SpecialtyDto
                {
                    SpecialtyId = doctor.Specialty.Id,
                    SpecialtyName = doctor.Specialty.SpecialtyName ?? string.Empty,
                    Description = doctor.Specialty.Description ?? string.Empty
                } : new SpecialtyDto { SpecialtyId = 0, SpecialtyName = string.Empty, Description = string.Empty },
                LicenseNumber = doctor.LicenseNumber ?? string.Empty,
                Degree = doctor.Degree ?? string.Empty,
                YearsOfExperience = doctor.YearsOfExperience,
                ConsultationFee = doctor.ConsultationFee,
                Bio = doctor.Bio ?? string.Empty,
                Gender = doctor.Gender,
                IsAvailable = doctor.IsAvailable,
                UserType = doctor.User.Role.Name,
                Enable2FA = doctor.User.Enable2FA,
                Avatar = doctor.Avatar ?? string.Empty,
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

            var user = await userRepository.FindUserById(accountId);
            if (user == null)
            {
                throw new AppException(ErrorCode.USER_NOT_EXISTED);
            }

            var userRole = httpContextAccessor.HttpContext?.User.FindFirst("Authorities")?.Value;

            using var stream = file.OpenReadStream();
            var imageUrl = await _cloudinaryService.UploadImageAsync(stream, file.FileName);

            if (userRole == "DOCTOR")
            {
                var doctor = await doctorRepository.GetDoctorByUserIdAsync(accountId);
                if (doctor == null)
                {
                    throw new AppException(ErrorCode.DOCTOR_NOT_FOUND);
                }
                doctor.Avatar = imageUrl;
                await doctorRepository.UpdateDoctorAsync(doctor);
            }
            else
            {
                var existingPatient = await patientRepository.GetPatientByUserIdAsync(accountId);
                if (existingPatient == null)
                {
                    throw new AppException(ErrorCode.USER_NOT_EXISTED);
                }
                existingPatient.Avatar = imageUrl;
                await patientRepository.UpdatePatientAsync(existingPatient);

                return imageUrl;
            }

            return imageUrl;

        }

    }

}
