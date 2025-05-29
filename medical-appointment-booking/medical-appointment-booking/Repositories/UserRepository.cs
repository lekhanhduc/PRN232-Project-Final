using medical_appointment_booking.Models;
using Microsoft.EntityFrameworkCore;

namespace medical_appointment_booking.Repositories
{
    public class UserRepository
    {
        private readonly AppDbContext _context;
        private readonly ILogger<UserRepository> _logger;

        public UserRepository(AppDbContext context, ILogger<UserRepository> _logger)
        {
            _context = context;
            this._logger = _logger;
        }

        public async Task<User?> FindUserByEmail(string email)
        {
            return await _context.Users
                                 .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User?> FindUserByPhone(string phone)
        {
            return await _context.Users
                .Include(u => u.Role)
                                 .FirstOrDefaultAsync(u => u.Phone == phone);
        }


        public async Task<List<User>> GetAllUsers(int page, int size)
        {
            return await _context.Users
                .Skip((page - 1) * size)
                .Take(size)
                .ToListAsync();
        }

        public async Task<int> GetTotalUsersCount()
        {
            return await _context.Users.CountAsync();
        }

        public async Task CreateUserAsync(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
        }

        public async Task<User?> FindUserById(long id)
        {
            return await _context.Users
                .Include(u => u.Role)
                                 .FirstOrDefaultAsync(u => u.Id == id);
        }
    }
}
