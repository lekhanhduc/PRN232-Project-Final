using medical_appointment_booking.Dtos.Response;
using medical_appointment_booking.Repositories;

namespace medical_appointment_booking.Services.Impl
{
    public class ScheduleService : IScheduleService
    {
        private readonly ScheduleRepository _scheduleRepository;

        public ScheduleService(ScheduleRepository scheduleRepository)
        {
            _scheduleRepository = scheduleRepository;
        }

        public async Task<List<WorkScheduleDto>> GetDoctorWorkSchedules(long doctorId)
        {
            // This method should fetch work schedules from your schedule repository
            // Replace with your actual implementation
            var schedules = await _scheduleRepository.GetDoctorSchedulesAsync(doctorId);


            return schedules.Select(s => new WorkScheduleDto
            {
                ScheduleId = s.Id,
                WorkDate = s.WorkDate.ToString("yyyy-MM-dd"),
                StartTime = s.StartTime.ToString(@"hh\:mm"),
                EndTime = s.EndTime.ToString(@"hh\:mm"),
                TimeSlots = s.TimeSlots?.Select(ts => new TimeSlotDto
                {
                    SlotId = ts.Id,
                    SlotTime = ts.SlotTime.ToString(@"hh\:mm"),
                    IsAvailable = ts.IsAvailable
                }).ToList() ?? new List<TimeSlotDto>()
            }).ToList();
        }
    }
}
