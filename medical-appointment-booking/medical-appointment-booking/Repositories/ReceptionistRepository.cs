using medical_appointment_booking.Models;
using Microsoft.EntityFrameworkCore;
using SendGrid.Helpers.Mail;

namespace medical_appointment_booking.Repositories
{
    public class ReceptionistRepository
    {
        private readonly AppDbContext context;
        public ReceptionistRepository(AppDbContext context)
        {
            this.context = context;
        }


        // receptionists 

        public async Task<(IEnumerable<Patient> patients, long totalCount)> SearchPatientsAsync(string? keyword, int page, int pageSize)
        {
            var query = context.Patients
                .Include(p => p.User)
                .Include(p => p.Appointments.OrderByDescending(a => a.AppointmentDate).Take(3))
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                keyword = keyword.ToLower();
                query = query.Where(p =>
                    EF.Functions.Like(p.FirstName.ToLower(), $"%{keyword}%") ||
                    EF.Functions.Like(p.LastName.ToLower(), $"%{keyword}%") ||
                    EF.Functions.Like(p.Phone, $"%{keyword}%") ||
                    (p.User != null && EF.Functions.Like(p.User.Email.ToLower(), $"%{keyword}%")));
            }

            var totalCount = await query.CountAsync();

            var patients = await query
                .OrderBy(p => p.LastName)
                .ThenBy(p => p.FirstName)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (patients, totalCount);
        }

        public async Task<IEnumerable<Patient>> SearchPatientsAsync(string? keyword)
        {
            var query = context.Patients
                .Include(p => p.User)
                .Include(p => p.Appointments) // KHÔNG được có OrderBy ở đây
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                keyword = keyword.Trim().ToLower();
                query = query.Where(p =>
                    p.FirstName.ToLower().Contains(keyword) ||
                    p.Phone.ToLower().Contains(keyword) ||
                    p.User.Email.ToLower().Contains(keyword));
            }

            return await query.ToListAsync(); // Trả về raw entity
        }

        // Add appointment for patient

        public async Task<Appointment> AddAppointmentAsync(Appointment appointment)
        {
            context.Appointments.Add(appointment);
            await context.SaveChangesAsync();        
            return await context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Doctor)
                .FirstOrDefaultAsync(a => a.Id == appointment.Id);
        }

        public async Task<IEnumerable<Appointment>> GetAppointmentsByDateAndQueryAsync(DateOnly? date, string? query)
        {
            var selectedDate = date ?? DateOnly.FromDateTime(DateTime.Today);
            query = query?.ToLower().Trim();

            return await context.Appointments
                .Include(a => a.Patient)
                    .ThenInclude(p => p.User)
                .Include(a => a.Doctor)
                    .ThenInclude(d => d.User)
                .Include(a => a.Doctor.Specialty)
                .Where(a => a.AppointmentDate == selectedDate &&
                    (string.IsNullOrEmpty(query) ||
                     a.Doctor.FirstName.ToLower().Contains(query) ||
                     a.Doctor.LastName.ToLower().Contains(query) ||
                     a.Patient.LastName.ToLower().Contains(query) ||
                     a.Patient.FirstName.ToLower().Contains(query)))
                .ToListAsync();
        }


        public async Task<bool> CancelAppointmentAsync(long appointmentId, string cancelReason, long? cancelledByUserId = null)
        {
            var appointment = await context.Appointments.FindAsync(appointmentId);
            if (appointment == null)
                return false;

            appointment.Status = "cancelled";
            appointment.CancelReason = cancelReason;
            appointment.CancelledBy = cancelledByUserId;

            context.Appointments.Update(appointment);
            await context.SaveChangesAsync();
            return true;
        }

        public async Task<Patient?> GetPatientByPatientIdAsync(long id)
        {
            return await context.Patients.FirstOrDefaultAsync(p => p.Id == id);
        }

    }
}
