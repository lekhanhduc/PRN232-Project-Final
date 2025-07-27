using medical_appointment_booking.Common;
using medical_appointment_booking.Dtos.Request;
using medical_appointment_booking.Dtos.Response;
using medical_appointment_booking.Models;
using medical_appointment_booking.Repositories;

namespace medical_appointment_booking.Services.Impl
{
    public class ManagerService : IManagerService
    {
        private readonly ManagerRepository managerRepository;
        private readonly ILogger<ReceptionistService> logger;
        private readonly RoleRepository roleRepository;


        public ManagerService(ManagerRepository managerRepository, ILogger<ReceptionistService> logger, RoleRepository roleRepository)
        {
            this.managerRepository = managerRepository;
            this.logger = logger;
            this.roleRepository = roleRepository;
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
                var created = await managerRepository.AddReceptionist(receptionist);
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
    }
}
