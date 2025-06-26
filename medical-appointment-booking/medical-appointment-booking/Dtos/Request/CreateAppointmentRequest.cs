namespace medical_appointment_booking.Dtos.Request
{
    public class CreateAppointmentRequest
    {
        public int DoctorId { get; set; }
        public int SlotId { get; set; }
        public string AppointmentDate { get; set; } // Format: "2024-06-10"
        public string ReasonForVisit { get; set; }
        public int PackageId { get; set; }
    }
}
