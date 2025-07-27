using medical_appointment_booking.Models;

namespace medical_appointment_booking.Repositories
{
    public class DoctorLeaveRepository
    {
        private readonly AppDbContext context;

        public DoctorLeaveRepository(AppDbContext context)
        {
            this.context = context;
        }

        public async Task<DoctorLeave> CreateLeaveAsync(DoctorLeave leave)
        {
            context.DoctorLeaves.Add(leave);
            await context.SaveChangesAsync();
            return leave;
        }
    }

}
