using medical_appointment_booking.Models;
using Microsoft.EntityFrameworkCore;
using SendGrid.Helpers.Mail;

namespace medical_appointment_booking.Repositories
{
    public class PatientRepository
    {
        private readonly AppDbContext dbContext;

        public PatientRepository(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<Patient> CreatePatientAsync(Patient patient)
        {
            dbContext.Patients.Add(patient);
            await dbContext.SaveChangesAsync();
            return patient;
        }

        public async Task<Patient?> GetPatientByIdAsync(long id)
        {
            return await dbContext.Patients.FindAsync(id);
        }
        public async Task<IEnumerable<Patient>> GetAllPatientsAsync()
        {
            return await dbContext.Patients.ToListAsync();
        }

        public async Task UpdatePatientAsync(Patient patient)
        {
            dbContext.Patients.Update(patient);
            await dbContext.SaveChangesAsync();
        }

        public async Task DeletePatientAsync(long id)
        {
            var patient = await GetPatientByIdAsync(id);
            if (patient != null)
            {
                dbContext.Patients.Remove(patient);
                await dbContext.SaveChangesAsync();
            }
        }

        public async Task<long> ToTalPatientsBySpecialty(int specialtyId)
        {
            var patientCount = await dbContext.Appointments
                .Where(a => a.Doctor.SpecialtyId == specialtyId)
                .Select(a => a.PatientId)
                .Distinct()
                .CountAsync();

            return patientCount;
        }

    }
}
