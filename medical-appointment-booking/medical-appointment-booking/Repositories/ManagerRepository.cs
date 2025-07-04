using medical_appointment_booking.Models;
using Microsoft.EntityFrameworkCore;

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
            return await context.Users
                .Include(u => u.Role)
                .Where(r => r.RoleId == 4)
                .ToListAsync();
        }

        public async Task<User?> GetReceptionistById(long id)
        {
            return await context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Id == id && u.RoleId == 4);
        }

        public async Task<User> AddReceptionist(User receptionist)
        {
            var create = await context.Users.AddAsync(receptionist);
            await context.SaveChangesAsync();
            return await context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Id == create.Entity.Id && u.RoleId == 4);
        }

        public async Task<User> UpdateReceptionist(User receptionist)
        {
            context.Users.Update(receptionist);
            await context.SaveChangesAsync();
            return await context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Id == receptionist.Id && u.RoleId == 4);
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
