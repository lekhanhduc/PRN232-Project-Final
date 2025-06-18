using medical_appointment_booking.Models;
using Microsoft.EntityFrameworkCore;

namespace medical_appointment_booking.Repositories
{
    public class SpecialtyRepository
    {
        private readonly AppDbContext context;

        public SpecialtyRepository(AppDbContext context)
        {
            this.context = context;
        }

        public async Task CreateSpecialty(Specialty specialty)
        {
            await context.AddAsync(specialty);
            await context.SaveChangesAsync();
        }

        public async Task<Specialty?> GetSpecialty (int id)
        {
            return await context.Specialties.FirstOrDefaultAsync(g => g.Id == id);
        }

        public async Task<Specialty?> GetSpecialtyByName(string name)
        {
            return await context.Specialties.FirstOrDefaultAsync(g => g.SpecialtyName == name);
        }

    }
}
