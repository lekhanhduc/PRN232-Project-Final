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

        public async Task<List<Specialty>> GetAll(int page, int size, string? keyword = null)
        {
            if(page < 1)
            {
                page = 1;
            }
            if (size > 100) size = 100;

            var query = context.Specialties.AsQueryable();

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                query = query.Where(s => s.SpecialtyName.Contains(keyword));
            }

            return await query
                .OrderBy(s => s.SpecialtyName)
                .Skip((page - 1) * size)
                .Take(size)
                .ToListAsync();
        }

        public async Task<long> GetTotalCount(string? keyword = null)
        {
            var query = context.Specialties.AsQueryable();

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                query = query.Where(s => s.SpecialtyName.Contains(keyword));
            }

            return await query.LongCountAsync();
        }

        public async Task DeleteById(int id)
        {
            var specialty = await context.Specialties.FirstOrDefaultAsync(g => g.Id == id);
            if (specialty != null)
            {
                var relatedDoctors = await context.Doctors.Where(d => d.SpecialtyId == id).ToListAsync();
                if (relatedDoctors.Any())
                {
                    foreach (var doctor in relatedDoctors)
                    {
                        doctor.SpecialtyId = null;
                    }
                    await context.SaveChangesAsync(); 
                }

                context.Specialties.Remove(specialty);
                await context.SaveChangesAsync();
            }
        }

    }
}
