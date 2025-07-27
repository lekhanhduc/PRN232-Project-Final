using medical_appointment_booking.Models;
using Microsoft.EntityFrameworkCore;


namespace medical_appointment_booking.Repositories
{
    public class WorkScheduleRepository
    {
        private readonly AppDbContext context;

        public WorkScheduleRepository(AppDbContext context)
        {
            this.context = context;
        }

        public async Task<List<WorkSchedule>> GetSchedulesByDoctorIdAsync(long doctorId)
        {
            return await context.WorkSchedules
                .Where(ws => ws.DoctorId == doctorId)
                .Include(ws => ws.TimeSlots)
                    .ThenInclude(ts => ts.Appointments!
                        .Where(a => a.DoctorId == doctorId))
                        .ThenInclude(a => a.Patient)
                            .ThenInclude(p => p.User)
                .ToListAsync();
        }
    }
}
