using medical_appointment_booking.Common;
using medical_appointment_booking.Dtos.Request;
using medical_appointment_booking.Dtos.Response;
using medical_appointment_booking.Models;
using medical_appointment_booking.Repositories;
using Microsoft.AspNetCore.Identity;
using System.Text;

namespace medical_appointment_booking.Services.Impl
{
    public class ManagerService : IManagerService
    {
        private readonly ManagerRepository managerRepository;
        private readonly ILogger<ReceptionistService> logger;
        private readonly RoleRepository roleRepository;
        private readonly IMailService mailService;
        private readonly PasswordHasher<User> passwordHasher;


        public ManagerService(ManagerRepository managerRepository, ILogger<ReceptionistService> logger, RoleRepository roleRepository, IMailService mailService)
        {
            this.managerRepository = managerRepository;
            this.logger = logger;
            this.roleRepository = roleRepository;
            this.mailService = mailService;
            passwordHasher = new PasswordHasher<User>();
        }

        public async Task<IEnumerable<ReceptionistResponse>> GetAllReceptionist()
        {
            try
            {
                var receptionistList = await managerRepository.GetAllReceptionist();

                return receptionistList.Select(r => new ReceptionistResponse
                {
                    Id = r.Id,
                    Phone = r.Phone,
                    Email = r.Email,
                    UserStatus = r.UserStatus,
                    CreatedAt = r.CreatedAt
                }).ToList();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error retrieving receptionists");
                throw;
            }
        }

        public async Task<ReceptionistResponse?> GetReceptionistById(long id)
        {
            try
            {
                var receptionist = await managerRepository.GetReceptionistById(id);
                if (receptionist == null)
                {
                    return null;
                }
                return new ReceptionistResponse
                {
                    Id = receptionist.Id,
                    Phone = receptionist.Phone,
                    Email = receptionist.Email,
                    UserStatus = receptionist.UserStatus,
                    CreatedAt = receptionist.CreatedAt
                };
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error retrieving receptionist by ID");
                throw;
            }
        }

        public async Task<ReceptionistResponse> AddReceptionist(ReceptionistRequest request)
        {
            try
            {
                var receptionist = new User
                {
                    Phone = request.Phone,
                    Email = request.Email,
                    UserStatus = request.UserStatus                 
                };

                var role = await roleRepository.FindByRoleName(DefinitionRole.RECEPTIONIST);
                if (role == null)
                {
                    role = new Role();
                    role.Name = DefinitionRole.RECEPTIONIST;
                    await roleRepository.CreateRole(role);
                }
                receptionist.Role = role;

                string password = GenerateRandomPassword();
                logger.LogInformation("Mật khẩu {}", password);

                receptionist.Password = passwordHasher.HashPassword(receptionist, password);
                var created = await managerRepository.AddReceptionist(receptionist);

                await mailService.SendReceptionistWelcomeEmail(
                    to: receptionist.Email,                 
                    email: receptionist.Email,
                    temporaryPassword: password,                  
                    registrationDate: receptionist.CreatedAt
                );

                return new ReceptionistResponse
                {
                    Id = created.Id,
                    Phone = created.Phone,
                    Email = created.Email,
                    UserStatus = created.UserStatus,
                    CreatedAt = created.CreatedAt
                };
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error adding receptionist");
                throw;
            }
        }

        public async Task<ReceptionistResponse> UpdateReceptionist(long id, ReceptionistRequest request)
        {
            try
            {
                var existing = await managerRepository.GetReceptionistById(id);
                if (existing == null)
                {
                    throw new KeyNotFoundException("Receptionist not found");
                }
                existing.Phone = request.Phone;
                existing.Email = request.Email;
                existing.UserStatus = request.UserStatus;
                await managerRepository.UpdateReceptionist(existing);
                return new ReceptionistResponse
                {
                    Id = existing.Id,
                    Phone = existing.Phone,
                    Email = existing.Email,
                    UserStatus = existing.UserStatus,
                    CreatedAt = existing.CreatedAt
                };
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error updating receptionist");
                throw;
            }
        }

        public async Task DeleteReceptionist(long id)
        {
            try
            {
                await managerRepository.DeleteReceptionist(id);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error deleting receptionist");
                throw;
            }

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
