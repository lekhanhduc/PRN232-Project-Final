namespace medical_appointment_booking.Dtos.Response
{
    public class CreateAppointmentResponse
    {
        public long AppointmentId { get; set; }
        public string AppointmentNumber { get; set; }
        public DoctorInfoDto Doctor { get; set; }
        public string AppointmentDate { get; set; }
        public string AppointmentTime { get; set; }
        public decimal TotalFee { get; set; }
        public string Status { get; set; }
    }

    public class DoctorInfoDto
    {
        public long DoctorId { get; set; }
        public string FullName { get; set; }
        public string Specialty { get; set; }
    }
}
