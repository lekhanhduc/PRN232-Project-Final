﻿using medical_appointment_booking.Common;
using medical_appointment_booking.Models;
using Microsoft.EntityFrameworkCore;
using SendGrid.Helpers.Mail;

namespace medical_appointment_booking.Repositories
{
    public class DoctorRepository
    {
        private readonly AppDbContext context;

        public DoctorRepository(AppDbContext context)
        {
            this.context = context;
        }

        public IQueryable<Doctor> GetDoctorsQueryable()
        {
            return context.Doctors
                .Include(d => d.User)
                .Include(d => d.Specialty)
                .Where(d => d.User.UserStatus != UserStatus.DELETED)
                .AsQueryable();
        }

        public async Task CreateDoctorAsync(Doctor doctor)
        {
            context.Doctors.Add(doctor);
            await context.SaveChangesAsync();
        }

        public async Task<List<Doctor>> GetAll(int page, int size, string? keyword = null)
        {
            if (page < 1)
            {
                page = 1;
            }
            if (size > 100) size = 100;

            var query = context.Doctors.Include(d => d.Specialty).Include(s => s.User).AsQueryable();

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                query = query.Where(s => s.FirstName.Contains(keyword) || s.LastName.Contains(keyword));
            }

            return await query
                .OrderBy(s => s.FirstName)
                .Skip((page - 1) * size)
                .Take(size)
                .ToListAsync();
        }

        public async Task<long> GetTotalCount(string? keyword = null)
        {
            var query = context.Doctors.AsQueryable();

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                query = query.Where(s => s.FirstName.Contains(keyword) || s.LastName.Contains(keyword));
            }

            return await query.LongCountAsync();
        }

        public async Task<Doctor?> GetDoctorByIdAsync(long id)
        {
            return await context.Doctors
                .Include(d => d.User)
                .Include(d => d.Specialty)
                .FirstOrDefaultAsync(d => d.Id == id && d.IsAvailable);
        }

        public async Task<List<WorkSchedule>> GetWorkSchedulesAsync(long doctorId, DateOnly startDate, DateOnly endDate)
        {
            return await context.WorkSchedules
                .Where(ws => ws.DoctorId == doctorId &&
                           ws.WorkDate >= startDate &&
                           ws.WorkDate <= endDate &&
                           ws.IsAvailable)
                .Include(ws => ws.TimeSlots)
                .OrderBy(ws => ws.WorkDate)
                .ToListAsync();
        }

        public async Task<List<DateOnly>> GetDoctorLeaveDatesAsync(long doctorId, DateOnly startDate, DateOnly endDate)
        {
            return await context.DoctorLeaves
                .Where(dl => dl.DoctorId == doctorId &&
                           dl.LeaveDate >= startDate &&
                           dl.LeaveDate <= endDate)
                .Select(dl => dl.LeaveDate)
                .ToListAsync();
        }

        public async Task<List<(DateOnly AppointmentDate, long SlotId)>> GetBookedSlotsAsync(long doctorId, DateOnly startDate, DateOnly endDate)
        {
            return await context.Appointments
                .Where(a => a.DoctorId == doctorId &&
                           a.AppointmentDate >= startDate &&
                           a.AppointmentDate <= endDate &&
                           a.Status != "CANCELLED")
                .Select(a => new ValueTuple<DateOnly, long>(a.AppointmentDate, a.SlotId))
                .ToListAsync();
        }

        public async Task<long> ToTalDoctorsBySpecialty(int specialty)
        {
            return await context.Doctors.Include(d => d.Specialty)
                .Include(u => u.User)
                .Where(d => d.SpecialtyId == specialty)
                .CountAsync();
        }

        public async Task<Doctor?> GetDoctorByLicenseNumber(string licenseNumber)
        {
            return await context.Doctors.Include(d => d.User)
                .Include(d => d.Specialty)
                .FirstOrDefaultAsync(d => d.LicenseNumber == licenseNumber);
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

        public async Task UpdateDoctorAsync(Doctor doctor)
        {
            context.Doctors.Update(doctor);
            await context.SaveChangesAsync();
        }

    }
}
