using medical_appointment_booking.Models;
using Microsoft.EntityFrameworkCore;

namespace medical_appointment_booking.Repositories
{
    public class DoctorRepository
    {
        private readonly AppDbContext context;

        public DoctorRepository(AppDbContext context)
        {
            this.context = context;
        }

        public async Task CreateDoctorAsync(Doctor doctor)
        {
            context.Doctors.Add(doctor);
            await context.SaveChangesAsync();
        }

        public async Task<Doctor?> GetDoctorByIdAsync(long id)
        {
            return await context.Doctors
                .Include(d => d.User)
                .Include(d => d.Specialty)
                .FirstOrDefaultAsync(d => d.Id == id);
        }

        public async Task<long> ToTalDoctorsBySpecialty(int specialty)
        {
            return await context.Doctors .Include(d => d.Specialty)
                .Include(u => u.User)
                .Where(d => d.SpecialtyId == specialty)
                .CountAsync();
        }

        public async Task<Doctor?> GetDoctorByLicenseNumber(string licenseNumber)
        {
            return await context.Doctors.Include(d => d.User)
                .Include (d => d.Specialty)
                .FirstOrDefaultAsync (d => d.LicenseNumber == licenseNumber);
        }

        public async Task<bool> DeleteDoctorAsync(long id)
        {
            var doctor = await context.Doctors.FindAsync(id);
            if (doctor == null)
                return false;

            context.Doctors.Remove(doctor);
            await context.SaveChangesAsync();
            return true;
        }

    }
}
