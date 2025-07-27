using medical_appointment_booking.Dtos.Request;
using medical_appointment_booking.Dtos.Response;
using medical_appointment_booking.Middlewares;
using medical_appointment_booking.Models;
using medical_appointment_booking.Repositories;
using Microsoft.EntityFrameworkCore;

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

        public async Task<CreateAppointmentResponse> AddAppointmentAsync(AppointmentCreationRequest request, int currentUserId)
        {
            using var transaction = await context.Database.BeginTransactionAsync();

            try
            {
                // 1. Validate input
                await ValidateAppointmentRequest(request);

                // 2. Get patient from current user
                var patient = await context.Patients
                    .FirstOrDefaultAsync(p => p.Id == request.PatientId);

                if (patient == null)
                {
                    throw new AppException(ErrorCode.PATIENT_NOT_FOUND);
                }


                // 3. Get doctor information with specialty
                var doctor = await context.Doctors
                    .Include(d => d.User)
                    .Include(d => d.Specialty)
                    .FirstOrDefaultAsync(d => d.Id == request.DoctorId);

                if (doctor == null || !doctor.IsAvailable)
                {
                    throw new AppException(ErrorCode.DOCTOR_NOT_FOUND);
                }

                // 4. Get time slot information with schedule
                var timeSlot = await context.TimeSlots
                    .Include(ts => ts.WorkSchedule)
                    .FirstOrDefaultAsync(ts => ts.Id == request.SlotId);

                if (timeSlot == null || !timeSlot.IsAvailable)
                {
                    throw new AppException(ErrorCode.TIMESLOT_NOT_AVAILABLE);
                }
                // 5. Get service package for fee calculation
                var servicePackage = await context.ServicePackages
                    .FirstOrDefaultAsync(sp => sp.Id == request.PackageId);

                if (servicePackage == null || !servicePackage.IsActive)
                {
                    throw new AppException(ErrorCode.SERVICE_PACKAGE_NOT_FOUND);
                }

                // 6. Parse appointment date
                if (!DateOnly.TryParse(request.AppointmentDate, out var appointmentDate))
                {
                    throw new AppException(ErrorCode.INVALID_APPOINTMENT_DATE);
                }

                // 7. Validate that the slot belongs to the requested doctor and date
                if (timeSlot.WorkSchedule.DoctorId != request.DoctorId ||
                    timeSlot.WorkSchedule.WorkDate != appointmentDate)
                {
                    throw new AppException(ErrorCode.TIMESLOT_DOCTOR_MISMATCH);
                }

                // 8. Calculate fees
                var consultationFee = doctor.ConsultationFee;
                var packageFee = servicePackage.Fee;
                var totalFee = consultationFee + packageFee;

                // 9. Create appointment entity
                var appointment = new Appointment
                {
                    PatientId = patient.Id,
                    DoctorId = request.DoctorId,
                    SlotId = request.SlotId,
                    AppointmentDate = appointmentDate,
                    AppointmentTime = timeSlot.SlotTime,
                    Status = "scheduled",
                    ReasonForVisit = request.ReasonForVisit,
                    ConsultationFee = consultationFee,
                    TotalFee = totalFee,
                    ServicePackageId = request.PackageId,
                    CreatedBy = currentUserId,
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now,
                };

                // 10. Save appointment
                context.Appointments.Add(appointment);
                await context.SaveChangesAsync();


                // 11. Update time slot availability
                timeSlot.IsAvailable = false;
                await context.SaveChangesAsync();

                // 12. Generate appointment number
                var appointmentNumber = GenerateAppointmentNumber(appointmentDate, appointment.Id);

                // 13. Commit transaction
                await transaction.CommitAsync();

                // 14. Create response
                var response = new CreateAppointmentResponse
                {
                    AppointmentId = appointment.Id,
                    AppointmentNumber = appointmentNumber,
                    Doctor = new DoctorInfoDto
                    {
                        FullName = $"Dr. {doctor.FirstName} {doctor.LastName}".Trim(),
                        Specialty = doctor.Specialty?.SpecialtyName ?? "N/A"
                    },
                    AppointmentDate = appointmentDate.ToString("yyyy-MM-dd"),
                    AppointmentTime = timeSlot.SlotTime.ToString(@"hh\:mm"),
                    TotalFee = totalFee,
                    Status = "scheduled"
                };

                return response;
            }
            catch (AppException ex)
            {
                await transaction.RollbackAsync();
                throw;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        private async Task ValidateAppointmentRequest(AppointmentCreationRequest request)
        {

            // Validate appointment date
            if (!DateOnly.TryParse(request.AppointmentDate, out var appointmentDate))
            {
                throw new AppException(ErrorCode.INVALID_APPOINTMENT_DATE);
            }

            if (appointmentDate < DateOnly.FromDateTime(DateTime.Now))
            {
                throw new AppException(ErrorCode.PAST_APPOINTMENT_DATE);
            }

            // Check if doctor exists and is available
            var doctor = await context.Doctors
                .FirstOrDefaultAsync(d => d.Id == request.DoctorId);

            if (doctor == null || !doctor.IsAvailable)
            {
                throw new AppException(ErrorCode.DOCTOR_NOT_FOUND);
            }

            // Check if time slot exists and is available
            var timeSlot = await context.TimeSlots
                .Include(ts => ts.WorkSchedule)
                .FirstOrDefaultAsync(ts => ts.Id == request.SlotId);

            if (timeSlot == null || !timeSlot.IsAvailable)
            {
                throw new AppException(ErrorCode.TIMESLOT_NOT_AVAILABLE);
            }

            // Validate that the slot belongs to the requested doctor and date
            if (timeSlot.WorkSchedule.DoctorId != request.DoctorId ||
                timeSlot.WorkSchedule.WorkDate != appointmentDate)
            {
                throw new AppException(ErrorCode.TIMESLOT_DOCTOR_MISMATCH);
            }

            // Check if service package exists
            var servicePackage = await context.ServicePackages
                .FirstOrDefaultAsync(sp => sp.Id == request.PackageId);

            if (servicePackage == null || !servicePackage.IsActive)
            {
                throw new AppException(ErrorCode.SERVICE_PACKAGE_NOT_FOUND);
            }

            // Check if patient already has appointment at this time
            var patient = await context.Patients
                .FirstOrDefaultAsync(p => p.Id == request.PatientId);

            if (patient == null)
            {
                throw new AppException(ErrorCode.PATIENT_NOT_FOUND);
            }

            var existingAppointment = await context.Appointments
                .FirstOrDefaultAsync(a =>
                    a.PatientId == patient.Id &&
                    a.AppointmentDate == appointmentDate &&
                    a.AppointmentTime == timeSlot.SlotTime &&
                    a.Status != "cancelled");

            if (existingAppointment != null)
            {
                throw new AppException(ErrorCode.APPOINTMENT_CONFLICT);
            }
        }

        private static string GenerateAppointmentNumber(DateOnly appointmentDate, long appointmentId)
        {
            // Format: AP + YYYYMMDD + 4-digit sequential number
            return $"AP{appointmentDate:yyyyMMdd}{appointmentId:D4}";
        }

        public async Task<IEnumerable<AppointmentListDto>> GetAppointmentsByDateAndQueryAsync(DateOnly? date, string? query)
        {
            var appointments = await receptionistRepository.GetAppointmentsByDateAndQueryAsync(date, query);

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