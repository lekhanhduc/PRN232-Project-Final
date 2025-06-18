using System.Text;
using medical_appointment_booking.Common;
using medical_appointment_booking.Dtos.Request;
using medical_appointment_booking.Dtos.Response;
using medical_appointment_booking.Middlewares;
using medical_appointment_booking.Models;
using medical_appointment_booking.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace medical_appointment_booking.Services.Impl
{
    public class DoctorService : IDoctorService
    {

        private readonly DoctorRepository doctorRepository;
        private readonly UserRepository userRepository;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly PasswordHasher<User> passwordHasher;
        private readonly RoleRepository roleRepository;
        private readonly IMailService mailService;
        private readonly SpecialtyRepository specialtyRepository;
        private readonly ILogger<DoctorService> logger;

        public DoctorService(
            DoctorRepository doctorRepository,
            UserRepository userRepository,
            IHttpContextAccessor httpContextAccessor,
            RoleRepository roleRepository,
            IMailService mailService,
            SpecialtyRepository specialtyRepository,
            ILogger<DoctorService> logger)
        {
            this.doctorRepository = doctorRepository;
            this.userRepository = userRepository;
            passwordHasher = new PasswordHasher<User>();
            this.httpContextAccessor = httpContextAccessor;
            this.roleRepository = roleRepository;
            this.mailService = mailService;
            this.specialtyRepository = specialtyRepository;
            this.logger = logger;
        }

        public async Task<DoctorCreationResponse> CreateDoctorAsync(DoctorCreationRequest request)
        {
            var user = await userRepository.FindUserByEmail(request.Email);
            if (user != null)
            {
                throw new AppException(ErrorCode.USER_EXISTED);
            }

            var existingDoctor = await doctorRepository.GetDoctorByLicenseNumber(request.LicenseNumber);
            if (existingDoctor != null)
            {
                throw new AppException(ErrorCode.LICENSENUMBER_EXISTED);
            }

            var specialty = await specialtyRepository.GetSpecialty(request.SpecialtyId);
            if (specialty == null)
            {
                throw new AppException(ErrorCode.SPECIALTY_NOT_FOUND);
            }

            var role = await roleRepository.FindByRoleName(DefinitionRole.USER);
            if (role == null)
            {
                role = new Role();
                role.Name = DefinitionRole.USER;
                await roleRepository.CreateRole(role);
            }

            string password = GenerateRandomPassword();
            logger.LogInformation("Mật khẩu {}", password);

            User newUser = new User();
            newUser.Email = request.Email;
            newUser.Password = passwordHasher.HashPassword(newUser, password);
            newUser.Role = role;
            newUser.Phone = request.Phone;
            newUser.UserStatus = UserStatus.PENDING_VERIFICATION;

            await userRepository.CreateUserAsync(newUser);

            var newDoctor = new Doctor
            {
                UserId = newUser.Id,
                FirstName = request.FirstName,
                LastName = request.LastName,
                SpecialtyId = request.SpecialtyId,
                LicenseNumber = request.LicenseNumber,
                Degree = request.Degree,
                ConsultationFee = request.ConsultationFee,
                Gender = request.Gender,
                YearsOfExperience = request.YearsOfExperience,
                Bio = request.Bio,
                Avatar = request.Avatar,
                IsAvailable = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await doctorRepository.CreateDoctorAsync(newDoctor);

            await mailService.SendEmailWelcome(newUser.Email, newDoctor.FirstName + " " + newDoctor.LastName, newUser.Phone, newDoctor.CreatedAt);

            return new DoctorCreationResponse
            {
                Id = newDoctor.Id,
                UserId = newDoctor.UserId,
                UserName = newDoctor.FirstName + " " + newDoctor.LastName,
                UserEmail = newUser.Email,
                SpecialtyId = specialty.Id,
                SpecialtyName = specialty.SpecialtyName,
                LicenseNumber = newDoctor.LicenseNumber,
                Degree = newDoctor.Degree,
                ConsultationFee = newDoctor.ConsultationFee,
                IsAvailable = newDoctor.IsAvailable,
                Gender = newDoctor.Gender,
                YearsOfExperience = newDoctor.YearsOfExperience,
                Bio = newDoctor.Bio,
                CreatedAt = newDoctor.CreatedAt
            };
        }


        public Task<DoctorDetailResponse> GetDoctorByIdAsync(long id)
        {
            throw new NotImplementedException();
        }

        private string GenerateRandomPassword(int length = 12)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
            var random = new Random();
            var password = new StringBuilder();

            // Đảm bảo có ít nhất 1 chữ hoa, 1 chữ thường, 1 số, 1 ký tự đặc biệt
            password.Append(chars[random.Next(0, 26)]); // Chữ hoa
            password.Append(chars[random.Next(26, 52)]); // Chữ thường  
            password.Append(chars[random.Next(52, 62)]); // Số
            password.Append(chars[random.Next(62, chars.Length)]); // Ký tự đặc biệt

            // Điền các ký tự còn lại
            for (int i = 4; i < length; i++)
            {
                password.Append(chars[random.Next(chars.Length)]);
            }

            // Shuffle để không có pattern cố định
            return new string(password.ToString().ToCharArray().OrderBy(x => random.Next()).ToArray());
        }
    }
}
