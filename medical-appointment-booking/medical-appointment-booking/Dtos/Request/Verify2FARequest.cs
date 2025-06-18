namespace medical_appointment_booking.Dtos.Request
{
    public class Verify2FARequest
    {
        public string PhoneOrEmail { get; set; }
        public string Code { get; set; } = string.Empty;
    }
}
