using medical_appointment_booking.Middlewares;
using medical_appointment_booking.Models;
using Microsoft.EntityFrameworkCore;

namespace medical_appointment_booking.Repositories
{
    public class RoleRepository
    {
        private readonly AppDbContext _context;

        public RoleRepository(AppDbContext context)
        {
            this._context = context;
        }

        public async Task<Role> CreateRole(Role role)
        {
            var existingRole = await _context.Roles
                .FirstOrDefaultAsync(x => x.Name == role.Name);

            if (existingRole != null)
            {
                throw new AppException(ErrorCode.ROLE_EXISTED);
            }

            _context.Roles.Add(role);
            await _context.SaveChangesAsync();

            return role;
        }

        public async Task<Role?> FindByRoleName(string RoleName)
        {
            return await _context.Roles
                .FirstOrDefaultAsync(x => x.Name == RoleName);

        }

    }
}
