using medical_appointment_booking.Models;
using Microsoft.EntityFrameworkCore;

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

        public async Task<IEnumerable<Appointment>> GetTodayAppointmentsAsync()
        {
            var today = DateOnly.FromDateTime(DateTime.Today);

            return await context.Appointments
                .Include(a => a.Patient)
                    .ThenInclude(p => p.User)
                .Include(a => a.Doctor)
                    .ThenInclude(d => d.Specialty)
                .Where(a => a.AppointmentDate == today)
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

    }
}
