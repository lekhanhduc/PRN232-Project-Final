
using medical_appointment_booking.Configuration;
using medical_appointment_booking.Middlewares;
using medical_appointment_booking.Models;
using medical_appointment_booking.Repositories;
using medical_appointment_booking.Services;
using medical_appointment_booking.Services.Impl;
using Microsoft.EntityFrameworkCore;

namespace medical_appointment_booking
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

            builder.Services.AddControllers()
                 .AddJsonOptions(options =>
                 {
                     options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
                 });

            builder.Services.AddHttpClient<GoogleAuthClient>(client =>
            {
                client.BaseAddress = new Uri("https://oauth2.googleapis.com/");
            });

            builder.Services.AddHttpClient<GoogleUserInfoClient>(client =>
            {
                client.BaseAddress = new Uri("https://www.googleapis.com/");
            });

            builder.Services.AddHttpClient<FacebookAuthClient>(client =>
            {
                client.BaseAddress = new Uri("https://graph.facebook.com/");
            });

            builder.Services.AddHttpClient<FacebookUserInfoClient>(client =>
            {
                client.BaseAddress = new Uri("https://graph.facebook.com/");
            });

            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddDbContext<AppDbContext>(options =>
               options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            builder.Services.AddCustomJwtAuthentication(builder.Configuration); // JWT
            CorsConfiguration.ConfigureServices(builder.Services); // CORS
            builder.Services.AddHttpContextAccessor(); // HttpContextAccessor

            builder.Services.AddScoped<UserRepository>();
            builder.Services.AddScoped<RoleRepository>();
            builder.Services.AddScoped<PatientRepository>();
            builder.Services.AddScoped<DoctorRepository>();
            builder.Services.AddScoped<SpecialtyRepository>();
            builder.Services.AddScoped<ReceptionistRepository>();
            builder.Services.AddScoped<ManagerRepository>();
            builder.Services.AddScoped<ScheduleRepository>();

            builder.Services.AddScoped<IUserService, UserService>();
            builder.Services.AddScoped<IAuthService, AuthService>();
            builder.Services.AddScoped<IJwtService, JwtService>();
            builder.Services.AddScoped<IMailService, MailService>();
            builder.Services.AddScoped<IPatientService, PatientService>();
            builder.Services.AddScoped<IDoctorService, DoctorService>();
            builder.Services.AddScoped<ISpecialtyService, SpecialtyService>();
            builder.Services.AddScoped<IReceptionistService, ReceptionistService>();
            builder.Services.AddScoped<IManagerService, ManagerService>();
            builder.Services.AddScoped<IAppointmentService, AppointmentService>();
            builder.Services.AddScoped<IScheduleService, ScheduleService>();
            builder.Services.AddScoped<TwoFactorService>();
            builder.Services.AddSingleton<CloudinaryService>();


            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();
            app.UseCors("AllowAll");

            app.UseMiddleware<ExceptionMiddleware>();
            app.UseAuthentication();
            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
