﻿namespace medical_appointment_booking.Middlewares
{
    public class AppException : Exception
    {
        public ErrorCode ErrorCode { get; }

        public AppException(ErrorCode errorCode) : base(errorCode.Message)
        {
            this.ErrorCode = errorCode;
        }

        public AppException(string? message) : base(message)
        {
        }
    }

}