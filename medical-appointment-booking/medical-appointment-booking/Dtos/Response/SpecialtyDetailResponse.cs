namespace medical_appointment_booking.Dtos.Response
{
    public class SpecialtyDetailResponse
    {
        public int Id { get; set; }
        public string SpecialtyName { get; set; }
        public string Description { get; set; }
        public long DoctorNumber { get; set; }
        public long PatientNumber { get; set; }
    }
}
