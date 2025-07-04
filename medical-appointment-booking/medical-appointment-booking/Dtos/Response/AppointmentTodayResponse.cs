namespace medical_appointment_booking.Dtos.Response
{
    public class AppointmentTodayResponse
    {
        public long AppointmentId { get; set; }

        public string AppointmentTime { get; set; } // e.g. "08:30"

        public string Status { get; set; }

        public decimal TotalFee { get; set; }

        public PatientInfoDto Patient { get; set; }

        public DoctorInfoDto Doctor { get; set; }
    }

    public class PatientInfoDto
    {
        public string FullName { get; set; }

        public string Phone { get; set; }
    }

    public class DoctorInfoDto
    {
        public string FullName { get; set; }

        public string Specialty { get; set; }
    }

}
