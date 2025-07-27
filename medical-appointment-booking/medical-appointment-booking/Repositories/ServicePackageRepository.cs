using medical_appointment_booking.Models;
using Microsoft.EntityFrameworkCore;

namespace medical_appointment_booking.Repositories
{
    public class ServicePackageRepository
    {
        private readonly AppDbContext _context;

        public ServicePackageRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ServicePackage>> GetActiveAsync()
        {
            return await _context.ServicePackages
                .Where(sp => sp.IsActive)
                .OrderBy(sp => sp.PackageName)
                .ToListAsync();
        }
    }
}
