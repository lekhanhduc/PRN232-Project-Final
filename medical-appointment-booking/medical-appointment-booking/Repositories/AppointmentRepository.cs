using medical_appointment_booking.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace medical_appointment_booking.Repositories
{
    public class AppointmentRepository
    {
        private readonly AppDbContext context;

        public AppointmentRepository(AppDbContext context)
        {
            this.context = context;
        }

        public async Task<List<Appointment>> GetAppointmentsByDoctorIdAsync(long doctorId)
        {
            return await context.Appointments
                .Include(a => a.Patient)
                    .ThenInclude(p => p.User)
                .Where(a => a.DoctorId == doctorId)
                .ToListAsync();
        }

        //public async Task<Appointment?> GetAppointmentByIdAsync(long appointmentId)
        //{
        //    return await context.Appointments.FindAsync(appointmentId);
        //}

        //public async Task<bool> UpdateAppointmentAsync(Appointment appointment)
        //{
        //    context.Appointments.Update(appointment);
        //    var saved = await context.SaveChangesAsync();
        //    return saved > 0;
        //}

    }
}
