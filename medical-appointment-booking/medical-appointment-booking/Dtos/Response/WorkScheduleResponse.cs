namespace medical_appointment_booking.Dtos.Response
{
    public class WorkScheduleResponse
    {
        public int ScheduleId { get; set; }
        public DateOnly WorkDate { get; set; }
        public TimeOnly StartTime { get; set; }
        public TimeOnly EndTime { get; set; }
        public int MaxPatients { get; set; }
        public bool IsAvailable { get; set; }
        public List<TimeSlotDoctorResponse> TimeSlots { get; set; } = new List<TimeSlotDoctorResponse>();
    }

    public class TimeSlotDoctorResponse
    {
        public int SlotId { get; set; }
        public TimeOnly SlotTime { get; set; }
        public string SlotTimeFormatted { get; set; } = string.Empty;
        public bool IsAvailable { get; set; }
        public AppointmentSummaryResponse? Appointment { get; set; }
    }

    public class AppointmentSummaryResponse
    {
        public long AppointmentId { get; set; }
        public PatientSummaryResponse Patient { get; set; } = new PatientSummaryResponse();
    }

    public class PatientSummaryResponse
    {
        public long PatientId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string? Phone { get; set; }
    }

    public class AppointmentDoctorResponse
    {
        public long AppointmentId { get; set; }
        public PatientInfoDetailResponse Patient { get; set; } = new();
        public DateOnly AppointmentDate { get; set; }
        public TimeOnly AppointmentTime { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? ReasonForVisit { get; set; }
        public decimal TotalFee { get; set; }
        public decimal ConsultationFee { get; set; }
        public ServicePackageResponse? ServicePackage { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class PatientInfoDetailResponse
    {
        public long PatientId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public DateOnly DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public string? Address { get; set; }
        public string? Avatar { get; set; }
    }

    public class LeaveResponse
    {
        public int LeaveId { get; set; }
        public long DoctorId { get; set; }
        public DateOnly LeaveDate { get; set; }
        public string? Reason { get; set; }
        public DateTime RequestedAt { get; set; }
    }
}
