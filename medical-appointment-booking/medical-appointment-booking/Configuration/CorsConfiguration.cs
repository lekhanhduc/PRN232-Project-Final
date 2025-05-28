﻿namespace medical_appointment_booking.Configuration
{
    public static class CorsConfiguration
    {
        public static void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("AllowAll",
                    builder => builder
                        .AllowAnyOrigin() // Cho phép tất cả nguồn
                        .AllowAnyMethod()
                        .AllowAnyHeader());
            });
        }
    }
}