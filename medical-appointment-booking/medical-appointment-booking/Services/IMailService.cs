namespace medical_appointment_booking.Services
{
    public interface IMailService
    {
        Task SendEmailWelcome(string to, string name, string phone, DateTime registrationDate);
    }
}
