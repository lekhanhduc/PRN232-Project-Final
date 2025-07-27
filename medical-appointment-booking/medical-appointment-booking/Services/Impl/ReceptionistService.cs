using Azure.Core;
using medical_appointment_booking.Dtos.Request;
using medical_appointment_booking.Dtos.Response;
using medical_appointment_booking.Middlewares;
using medical_appointment_booking.Models;
using medical_appointment_booking.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Numerics;

namespace medical_appointment_booking.Services.Impl
{
    public class ReceptionistService : IReceptionistService
    {
        private readonly AppDbContext context;
        private readonly ReceptionistRepository receptionistRepository;
        private readonly ILogger<ReceptionistService> logger;


        public ReceptionistService(AppDbContext context, ReceptionistRepository receptionistRepository, ILogger<ReceptionistService> logger)
        {
            this.context = context;
            this.receptionistRepository = receptionistRepository;
            this.logger = logger;
        }

        public async Task<PageResponse<PatientDto>> SearchPatientsAsync(string? keyword, int page, int pageSize)
        {
            try
            {

                var (patients, totalCount) = await receptionistRepository.SearchPatientsAsync(keyword, page, pageSize);

                var patientDtos = patients.Select(p => new PatientDto
                {
                    Id = p.Id,
                    FirstName = p.FirstName ?? "",
                    LastName = p.LastName ?? "",
                    Phone = p.Phone ?? "",
                    Email = p.User?.Email ?? "",
                    DateOfBirth = p.Dob,
                    Gender = p.Gender.ToString() ?? "",
                    RecentAppointments = p.Appointments?
                        .OrderByDescending(a => a.AppointmentDate)
                        .Take(3)
                        .Select(a => new AppointmentForReceptionistResponse
                        {
                            AppointmentId = a.Id,
                            AppointmentDate = a.AppointmentDate,
                            Status = a.Status
                        }).ToList() ?? new List<AppointmentForReceptionistResponse>()
                }).ToList();

                var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

                return new PageResponse<PatientDto>
                {
                    CurrentPages = page,
                    PageSizes = pageSize,
                    TotalPages = totalPages,
                    TotalElements = totalCount,
                    Items = patientDtos
                };
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<AppointmentCreationResponse> AddAppointmentAsync(AppointmentCreationRequest appointmentRequest)
        {
            try
            {
                var patient = await context.Patients
                    .FirstOrDefaultAsync(p => p.Id == appointmentRequest.PatientId);

                if (patient == null)
                {
                    throw new AppException(ErrorCode.PATIENT_NOT_FOUND);
                }


                // 3. Get doctor information with specialty
                var doctor = await context.Doctors
                    .Include(d => d.User)
                    .Include(d => d.Specialty)
                    .FirstOrDefaultAsync(d => d.Id == appointmentRequest.DoctorId);

                if (doctor == null || !doctor.IsAvailable)
                {
                    throw new AppException(ErrorCode.DOCTOR_NOT_FOUND);
                }

                // 4. Get time slot information with schedule
                var timeSlot = await context.TimeSlots
                    .Include(ts => ts.WorkSchedule)
                    .FirstOrDefaultAsync(ts => ts.Id == appointmentRequest.SlotId);

                if (timeSlot == null || !timeSlot.IsAvailable)
                {
                    throw new AppException(ErrorCode.TIMESLOT_NOT_AVAILABLE);
                }

                // 5. Get service package for fee calculation
                var servicePackage = await context.ServicePackages
                    .FirstOrDefaultAsync(sp => sp.Id == appointmentRequest.PackageId);

                if (servicePackage == null || !servicePackage.IsActive)
                {
                    throw new AppException(ErrorCode.SERVICE_PACKAGE_NOT_FOUND);
                }

                var appointment = new Appointment
                {
                    PatientId = appointmentRequest.PatientId,
                    DoctorId = appointmentRequest.DoctorId,
                    SlotId = appointmentRequest.SlotId,
                    AppointmentDate = appointmentRequest.AppointmentDate,
                    AppointmentTime = appointmentRequest.AppointmentTime,
                    ServicePackageId = appointmentRequest.PackageId
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

        public async  Task<IEnumerable<AppointmentListDto>> GetAppointmentsByDateAndQueryAsync(DateOnly? date, string? query)
        {
            var appointments = await receptionistRepository.GetAppointmentsByDateAndQueryAsync(date,query);

            return appointments.Select(a => new AppointmentListDto
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
