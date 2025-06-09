namespace medical_appointment_booking.Services
{
    public interface IMailService1
    {
        Task SendEmailWelcome(string to, string name, string phone, DateTime registrationDate);
        Task SendDoctorWelcomeEmail(string to, string doctorName, string email, string temporaryPassword,
            string licenseNumber, string specialty, decimal consultationFee, DateTime registrationDate);
    }
}
