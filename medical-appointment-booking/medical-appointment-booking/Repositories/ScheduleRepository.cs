using medical_appointment_booking.Models;
using Microsoft.EntityFrameworkCore;

namespace medical_appointment_booking.Repositories
{
    public class ScheduleRepository
    {
        private readonly AppDbContext context;

        public ScheduleRepository(
            AppDbContext context)
        {
            this.context = context;
        }

        public async Task<List<WorkSchedule>> GetDoctorSchedulesAsync(long doctorId)
        {
            return await context.WorkSchedules
                .Include(ws => ws.TimeSlots.OrderBy(ts => ts.SlotTime))
                .Include(ws => ws.Doctor)
                .Where(ws => ws.DoctorId == doctorId)
                .OrderBy(ws => ws.WorkDate)
                .ThenBy(ws => ws.StartTime)
                .ToListAsync();
        }

        public async Task CreateListScheduleAsync(List<WorkSchedule> schedules)
        {
            context.WorkSchedules.AddRange(schedules);
            await context.SaveChangesAsync();
        }
    }
}
