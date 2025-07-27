using medical_appointment_booking.Common;
using medical_appointment_booking.Models;
using Microsoft.EntityFrameworkCore;
using SendGrid.Helpers.Mail;

namespace medical_appointment_booking.Repositories
{
    public class ManagerRepository
    {
        private readonly AppDbContext context;
        public ManagerRepository(AppDbContext context)
        {
            this.context = context;
        }

        // manager receptionists 
        public async Task<IEnumerable<User>> GetAllReceptionist()
        {
            var role = await context.Roles.FirstOrDefaultAsync(x => x.Name == DefinitionRole.RECEPTIONIST);

           

            return await context.Users
                .Include(u => u.Role)
                .Where(r => r.RoleId == role.Id)
                .ToListAsync();
        }

        public async Task<User?> GetReceptionistById(long id)
        {
            var role = await context.Roles.FirstOrDefaultAsync(x => x.Name == DefinitionRole.RECEPTIONIST);
            return await context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Id == id && u.RoleId == role.Id);
        }

        public async Task<User> AddReceptionist(User receptionist)
        {
            var create = await context.Users.AddAsync(receptionist);
            await context.SaveChangesAsync();
            return await context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Id == create.Entity.Id);
        }

        public async Task<User> UpdateReceptionist(User receptionist)
        {
            context.Users.Update(receptionist);
            await context.SaveChangesAsync();
            return await context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Id == receptionist.Id);
        }
        public async Task DeleteReceptionist(long id)
        {
            var receptionist = await GetReceptionistById(id);
            if (receptionist != null)
            {
                context.Users.Remove(receptionist);
                await context.SaveChangesAsync();
            }
        }
    }
}
