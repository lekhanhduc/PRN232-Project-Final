using System.ComponentModel.DataAnnotations;

namespace medical_appointment_booking.Dtos.Request
{
    public class DoctorAppointmentFilterRequest
    {
        public DateOnly? AppointmentDate { get; set; }
        public string? Status { get; set; }
        public string? OrderBy { get; set; } = "appointmentTime";
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }

    public class LeaveRequest
    {
        [Required]
        public DateOnly LeaveDate { get; set; }

        public string? Reason { get; set; }
    }

    public class CompleteAppointmentRequest
    {
        public string? Notes { get; set; }
    }

    public class DoctorScheduleFilterRequest
    {
        public DateOnly? FromDate { get; set; }
        public DateOnly? ToDate { get; set; }
        public bool? IncludeTimeSlots { get; set; } = true;
    }
}
