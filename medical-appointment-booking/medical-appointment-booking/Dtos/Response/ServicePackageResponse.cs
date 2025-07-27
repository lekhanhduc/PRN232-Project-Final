namespace medical_appointment_booking.Dtos.Response
{
    public class ServicePackageResponse
    {
        public int PackageId { get; set; }
        public string PackageName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal Fee { get; set; }
        public int? DurationMinutes { get; set; }
    }
}
