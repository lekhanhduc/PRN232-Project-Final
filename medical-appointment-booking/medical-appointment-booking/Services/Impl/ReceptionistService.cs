using Azure.Core;
using medical_appointment_booking.Dtos.Request;
using medical_appointment_booking.Dtos.Response;
using medical_appointment_booking.Models;
using medical_appointment_booking.Repositories;
using Microsoft.AspNetCore.Mvc;
using System.Numerics;

namespace medical_appointment_booking.Services.Impl
{
    public class ReceptionistService : IReceptionistService
    {
        private readonly ReceptionistRepository receptionistRepository;
        private readonly ILogger<ReceptionistService> logger;


        public ReceptionistService(ReceptionistRepository receptionistRepository, ILogger<ReceptionistService> logger)
        {
            this.receptionistRepository = receptionistRepository;
            this.logger = logger;
        }

        public async Task<IEnumerable<PatientDto>> SearchPatientsAsync(string? keyword)
        {
            try
            {
                var patients = await receptionistRepository.SearchPatientsAsync(keyword);

                return patients.Select(p => new PatientDto
                {
                    Id = p.Id,
                    FirstName = p.FirstName,
                    Phone = p.Phone,
                    Email = p.User?.Email,
                    RecentAppointments = p.Appointments?
                        .OrderByDescending(a => a.AppointmentDate)
                        .Take(3)
                        .Select(a => new AppointmentForReceptionistResponse
                        {
                            AppointmentId = a.Id,
                            AppointmentDate = a.AppointmentDate,
                            Status = a.Status
                        }).ToList() ?? new List<AppointmentForReceptionistResponse>()
                });
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error searching patients");
                throw;
            }
        }

        public async Task<AppointmentCreationResponse> AddAppointmentAsync(AppointmentCreationRequest appointmentRequest)
        {
            try
            {
                var appointment = new Appointment
                {
                    PatientId = appointmentRequest.PatientId,
                    DoctorId = appointmentRequest.DoctorId,
                    SlotId = appointmentRequest.SlotId,
                    AppointmentDate = appointmentRequest.AppointmentDate,
                    AppointmentTime = appointmentRequest.AppointmentTime,
                 //   PackageId = appointmentRequest.PackageId,
                };
                await receptionistRepository.AddAppointmentAsync(appointment);

                var response = new AppointmentCreationResponse
                {
                    AppointmentId = appointment.Id,
                    DoctorId = appointment.DoctorId,
                    Doctor = new DoctorDto
                    {
                        FullName = $"{appointment.Doctor.LastName} {appointment.Doctor.FirstName}",
                        SpecialtyName = appointment.Doctor?.Specialty?.SpecialtyName
                    },
                    AppointmentDate = appointment.AppointmentDate,
                    AppointmentTime = appointment.AppointmentTime,
                    Status = appointment.Status,
                    TotalFee = appointment.TotalFee,
                };

                return response; // Ensure a value is returned in all code paths
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error adding appointment");
                throw; // Rethrow the exception to maintain the error handling behavior
            }
        }

        public async Task<IEnumerable<AppointmentTodayResponse>> GetTodayAppointmentsAsync()
        {
            var appointments = await receptionistRepository.GetTodayAppointmentsAsync();

            return appointments.Select(a => new AppointmentTodayResponse
            {
                AppointmentId = a.Id,
                AppointmentTime = a.AppointmentTime.ToString(@"hh\:mm"),
                Status = a.Status,
                TotalFee = a.TotalFee,
                Patient = new PatientInfoDto
                {
                    FullName = $"{a.Patient.LastName} {a.Patient.FirstName}",
                    Phone = a.Patient.Phone ?? a.Patient.User?.Phone ?? ""
                },
                Doctor = new DoctorViewInfoDto
                {
                    FullName = $"{a.Doctor.Degree} {a.Doctor.LastName} {a.Doctor.FirstName}",
                    Specialty = a.Doctor.Specialty?.SpecialtyName ?? ""
                }
            }).ToList();
        }

        public async Task<bool> CancelAppointmentAsync(long appointmentId, string cancelReason, long? cancelledByUserId = null)
        {
            return await receptionistRepository.CancelAppointmentAsync(appointmentId, cancelReason, cancelledByUserId);
        }

        public async Task<Patient?> GetPatientByPatientIdAsync(long id)
        {
            return await receptionistRepository.GetPatientByPatientIdAsync(id);
        }
    }
}
