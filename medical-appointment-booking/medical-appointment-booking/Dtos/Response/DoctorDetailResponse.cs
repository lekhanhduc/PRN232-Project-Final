using medical_appointment_booking.Common;

namespace medical_appointment_booking.Dtos.Response
{
    public class DoctorDetailResponse
    {
        public long DoctorId { get; set; }
        public string FullName { get; set; }
        public SpecialtyDto Specialty { get; set; }
        public string LicenseNumber { get; set; }
        public string Degree { get; set; }
        public int YearsOfExperience { get; set; }
        public decimal ConsultationFee { get; set; }
        public string Bio { get; set; }
        public Gender? Gender { get; set; }
        public bool IsAvailable { get; set; }
    }

    public class SpecialtyDto
    {
        public long SpecialtyId { get; set; }
        public string SpecialtyName { get; set; }
        public string Description { get; set; }
    }
}
