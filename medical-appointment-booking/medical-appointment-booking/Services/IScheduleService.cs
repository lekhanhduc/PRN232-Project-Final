using medical_appointment_booking.Dtos.Response;

namespace medical_appointment_booking.Services
{
    public interface IScheduleService
    {
        Task<List<WorkScheduleDto>> GetDoctorWorkSchedules(long doctorId);
    }
}
