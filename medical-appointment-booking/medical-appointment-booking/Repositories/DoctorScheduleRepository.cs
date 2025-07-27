using medical_appointment_booking.Dtos.Response;
using medical_appointment_booking.Models;
using Microsoft.EntityFrameworkCore;

namespace medical_appointment_booking.Repositories
{
    public class DoctorScheduleRepository
    {
        private readonly AppDbContext context;

        public DoctorScheduleRepository(AppDbContext context)
        {
            this.context = context;
        }

        public async Task<List<WorkSchedule>> GetDoctorWorkSchedulesAsync(long doctorId, DateOnly? fromDate = null, DateOnly? toDate = null)
        {
            var query = context.WorkSchedules.AsQueryable();

            query = query.Where(ws => ws.DoctorId == doctorId);

            if (fromDate.HasValue)
                query = query.Where(ws => ws.WorkDate >= fromDate.Value);

            if (toDate.HasValue)
                query = query.Where(ws => ws.WorkDate <= toDate.Value);

            return await query
                .Include(ws => ws.TimeSlots)
                .ThenInclude(ts => ts.Appointments)
                .ThenInclude(a => a.Patient)
                .ThenInclude(p => p.User)
                .OrderBy(ws => ws.WorkDate)
                .ThenBy(ws => ws.StartTime)
                .ToListAsync();
        }

        public async Task<PageResponse<Appointment>> GetDoctorAppointmentsAsync(long doctorId, DateOnly? appointmentDate = null,
            string? status = null, string? orderBy = null, int page = 1, int pageSize = 20)
        {
            var query = context.Appointments.AsQueryable();

            query = query.Where(a => a.DoctorId == doctorId);

            if (appointmentDate.HasValue)
                query = query.Where(a => a.AppointmentDate == appointmentDate.Value);

            if (!string.IsNullOrEmpty(status))
                query = query.Where(a => a.Status == status);

            // Apply ordering
            query = orderBy?.ToLower() switch
            {
                "appointmenttime" => query.OrderBy(a => a.AppointmentTime),
                "appointmenttime_desc" => query.OrderByDescending(a => a.AppointmentTime),
                "appointmentdate" => query.OrderBy(a => a.AppointmentDate),
                "appointmentdate_desc" => query.OrderByDescending(a => a.AppointmentDate),
                "status" => query.OrderBy(a => a.Status),
                "createdat" => query.OrderBy(a => a.CreatedAt),
                "createdat_desc" => query.OrderByDescending(a => a.CreatedAt),
                _ => query.OrderBy(a => a.AppointmentDate).ThenBy(a => a.AppointmentTime)
            };

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

            var appointments = await query
                .Include(a => a.Patient)
                .ThenInclude(p => p.User)
                .Include(a => a.ServicePackage)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PageResponse<Appointment>
            {
                CurrentPages = page,
                PageSizes = pageSize,
                TotalPages = totalPages,
                TotalElements = totalCount,
                Items = appointments
            };
        }

        public async Task<Appointment?> GetAppointmentByIdAsync(long appointmentId)
        {
            return await context.Appointments
                .Include(a => a.Patient)
                .ThenInclude(p => p.User)
                .Include(a => a.ServicePackage)
                .FirstOrDefaultAsync(a => a.Id == appointmentId);
        }

        public async Task<bool> UpdateAppointmentStatusAsync(long appointmentId, string status, string? notes = null)
        {
            var appointment = await context.Appointments.FindAsync(appointmentId);
            if (appointment == null) return false;

            appointment.Status = status;
            appointment.UpdatedAt = DateTime.UtcNow;

            // If completing appointment, could add notes to a medical record table
            // For now, we'll assume notes are stored elsewhere or in a separate field

            await context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> CheckAppointmentBelongsToDoctorAsync(long appointmentId, long doctorId)
        {
            return await context.Appointments
                .AnyAsync(a => a.Id == appointmentId && a.DoctorId == doctorId);
        }

        public async Task<DoctorLeave> CreateLeaveRequestAsync(DoctorLeave leave)
        {
            context.DoctorLeaves.Add(leave);
            await context.SaveChangesAsync();
            return leave;
        }

        public async Task<bool> CheckLeaveConflictAsync(long doctorId, DateOnly leaveDate)
        {
            return await context.DoctorLeaves
                .AnyAsync(dl => dl.DoctorId == doctorId && dl.LeaveDate == leaveDate);
        }

        public async Task<bool> DoctorExistsAsync(long doctorId)
        {
            return await context.Doctors.AnyAsync(d => d.Id == doctorId);
        }
    }
}
