namespace medical_appointment_booking.Common
{
    public enum TwoFaStep
    {
        NONE,               // Không cần xác minh 2FA
        SETUP_REQUIRED,     // Chưa xác minh lần đầu, cần hiện QR + nhập mã
        VERIFICATION_REQUIRED // Đã bật 2FA, chỉ cần nhập mã
    }

}
