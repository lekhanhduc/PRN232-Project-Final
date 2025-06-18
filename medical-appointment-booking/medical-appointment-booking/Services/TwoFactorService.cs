﻿using medical_appointment_booking.Common;
using System.Security.Claims;
using medical_appointment_booking.Dtos.Request;
using medical_appointment_booking.Middlewares;
using medical_appointment_booking.Repositories;
using medical_appointment_booking.Services.Impl;
using OtpNet;
using QRCoder;
using System.IdentityModel.Tokens.Jwt;

namespace medical_appointment_booking.Services
{
    public class TwoFactorService
    {

        private readonly UserRepository userRepository;
        private readonly IJwtService jwtService;

        public TwoFactorService(UserRepository userRepository, IJwtService jwtService)
        {
            this.userRepository = userRepository;
            this.jwtService = jwtService;
        }

        public (string secretKey, string qrCodeUrl) GenerateSetupCode(string userEmail, string appName)
        {
            var secretKeyBytes = KeyGeneration.GenerateRandomKey(20);
            var secretKey = Base32Encoding.ToString(secretKeyBytes).TrimEnd('='); // bỏ padding

            // 2. Encode thông tin
            var encodedAppName = Uri.EscapeDataString(appName);
            var encodedEmail = Uri.EscapeDataString(userEmail);

            // 3. Tạo TOTP URI chuẩn
            var otpUri = $"otpauth://totp/{encodedAppName}:{encodedEmail}?secret={secretKey}&issuer={encodedAppName}&algorithm=SHA1&digits=6&period=30";

            var qrGenerator = new QRCodeGenerator();
            var qrCodeData = qrGenerator.CreateQrCode(otpUri, QRCodeGenerator.ECCLevel.Q);
            var qrCode = new PngByteQRCode(qrCodeData);
            var qrCodeBytes = qrCode.GetGraphic(10); 
            var qrCodeBase64 = Convert.ToBase64String(qrCodeBytes);
            var qrCodeUrl = $"data:image/png;base64,{qrCodeBase64}";

            return (secretKey, qrCodeUrl);
        }


        public bool isValidCode(string userProvidedCode, string savedSecretKey)
        {
            var totp = new Totp(Base32Encoding.ToBytes(savedSecretKey));
            return totp.VerifyTotp(userProvidedCode, out _, new VerificationWindow(2, 2));
        }

        public async Task<SignInResponse> VerifyCode(Verify2FARequest request)
        {
            var user = await userRepository.FindUserByEmailOrPhone(request.PhoneOrEmail);
            if (user == null)
            {
                throw new AppException(ErrorCode.USER_NOT_EXISTED);
            }

            if (string.IsNullOrEmpty(user.TwoFactorSecret))
            {
                throw new AppException(ErrorCode.TWO_FACTOR_SECRET_NOT_SET);
            }

            var totp = new Totp(Base32Encoding.ToBytes(user.TwoFactorSecret));
            var isValid = totp.VerifyTotp(request.Code, out _, new VerificationWindow(2, 2));

            if (!isValid)
            {
                throw new AppException(ErrorCode.INVALID_2FA_CODE);
            }

            if (user.UserStatus == UserStatus.PENDING_VERIFICATION)
            {
                user.UserStatus = UserStatus.ACTIVE;
                user.Enable2FA = true;
                await userRepository.UpdateUser(user);
            }

            var claims = new[]
            {
                 new Claim("userId", user.Id.ToString()),
                 new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                 new Claim("Authorities", user.Role?.Name ?? "")
            };

            var accessToken = jwtService.GenerateAccessToken(claims);
            var refreshToken = jwtService.GenerateRefreshToken(claims);

            return new SignInResponse(accessToken, refreshToken, user.Role?.Name ?? "", "Bearer", TwoFaStep.VERIFICATION_REQUIRED);
        }


        public async Task<string> Enable2FA(Enable2FARequest request)
        {
            var user = await userRepository.FindUserByEmailOrPhone(request.PhoneOrEmail);
            if (user == null)
            {
                throw new AppException(ErrorCode.USER_NOT_EXISTED);
            }

            var (secretKey, qrCodeBase64) = GenerateSetupCode(user.Email ?? "", "MedicalAppointmentBooking");
            user.TwoFactorSecret = secretKey;
            user.Enable2FA = true;
            await userRepository.UpdateUser(user);

            return qrCodeBase64;
        }

    }
}
