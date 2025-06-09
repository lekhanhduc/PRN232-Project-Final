using medical_appointment_booking.Common;
using medical_appointment_booking.Dtos.Request;
using medical_appointment_booking.Dtos.Response;
using medical_appointment_booking.Middlewares;
using medical_appointment_booking.Models;
using medical_appointment_booking.Repositories;
using Microsoft.AspNetCore.Identity;

namespace medical_appointment_booking.Services.Impl
{
    public class UserService : IUserService
    {
        private readonly UserRepository userRepository;
        private readonly PatientRepository patientRepository;
        private readonly RoleRepository roleRepository;
        private readonly PasswordHasher<User> passwordHasher;
        private readonly IMailService mailService;
        private readonly ILogger<UserService> logger;

        public UserService(UserRepository userRepository, RoleRepository roleRepository, ILogger<UserService> logger,
            PatientRepository patientRepository, IMailService mailService)
        {
            this.userRepository = userRepository;
            this.roleRepository = roleRepository;
            this.passwordHasher = new PasswordHasher<User>();
            this.logger = logger;
            this.patientRepository = patientRepository;
            this.mailService = mailService;
        }

        public async Task<UserCreationResponse> CreateUser(UserCreationRequest request)
        {
            var userOptinal = await userRepository.FindUserByPhone(request.Phone);
            if (userOptinal != null)
            {
                logger.LogError("User Existed");
                throw new AppException(ErrorCode.USER_EXISTED);
            }

            User user = new User();
            user.Phone = request.Phone;
            user.Email = request.Email.Trim();
            user.Password = passwordHasher.HashPassword(user, request.Password.Trim());
             
            var role = await roleRepository.FindByRoleName(DefinitionRole.USER);
            if (role == null)
            {
                role = new Role();
                role.Name = DefinitionRole.USER;
                await roleRepository.CreateRole(role);
            }
            user.Role = role;
            await userRepository.CreateUserAsync(user);

            var patient = new Patient
            {
                UserId = user.Id,
                FirstName = request.FirstName,
                LastName = request.LastName,
                Dob = request.Dob
            };

            await patientRepository.CreatePatientAsync(patient);

            logger.LogInformation("User created successfully with email: {Email}", request.Phone);

            await mailService.SendEmailWelcome(user.Email, patient.FirstName + " " + patient.LastName, user.Phone, user.CreatedAt);

            return new UserCreationResponse
                (
                    user.Phone,
                    user.Email,
                    patient.FirstName,
                    patient.LastName,
                    patient.Dob,
                    user.Role.Name
                );
        }

    }
}
