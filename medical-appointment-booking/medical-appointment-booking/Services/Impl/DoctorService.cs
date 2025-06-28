using System.Text;
using medical_appointment_booking.Common;
using medical_appointment_booking.Dtos.Request;
using medical_appointment_booking.Dtos.Response;
using medical_appointment_booking.Middlewares;
using medical_appointment_booking.Models;
using medical_appointment_booking.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace medical_appointment_booking.Services.Impl
{
    public class DoctorService : IDoctorService
    {

        private readonly DoctorRepository doctorRepository;
        private readonly UserRepository userRepository;
        private readonly IHttpContextAccessor httpContextAccessor;
        private readonly PasswordHasher<User> passwordHasher;
        private readonly RoleRepository roleRepository;
        private readonly IMailService mailService;
        private readonly SpecialtyRepository specialtyRepository;
        private readonly ScheduleRepository scheduleRepository;
        private readonly ILogger<DoctorService> logger;

        public DoctorService(
            DoctorRepository doctorRepository,
            UserRepository userRepository,
            IHttpContextAccessor httpContextAccessor,
            RoleRepository roleRepository,
            IMailService mailService,
            SpecialtyRepository specialtyRepository,
            ScheduleRepository scheduleRepository,
            ILogger<DoctorService> logger)
        {
            this.doctorRepository = doctorRepository;
            this.userRepository = userRepository;
            passwordHasher = new PasswordHasher<User>();
            this.httpContextAccessor = httpContextAccessor;
            this.roleRepository = roleRepository;
            this.mailService = mailService;
            this.specialtyRepository = specialtyRepository;
            this.scheduleRepository = scheduleRepository;
            this.logger = logger;
        }

        public async Task<DoctorCreationResponse> CreateDoctorAsync(DoctorCreationRequest request)
        {
            var user = await userRepository.FindUserByEmail(request.Email);
            if (user != null)
            {
                throw new AppException(ErrorCode.USER_EXISTED);
            }

            var existingDoctor = await doctorRepository.GetDoctorByLicenseNumber(request.LicenseNumber);
            if (existingDoctor != null)
            {
                throw new AppException(ErrorCode.LICENSENUMBER_EXISTED);
            }

            var specialty = await specialtyRepository.GetSpecialty(request.SpecialtyId);
            if (specialty == null)
            {
                throw new AppException(ErrorCode.SPECIALTY_NOT_FOUND);
            }

            var role = await roleRepository.FindByRoleName(DefinitionRole.DOCTOR);
            if (role == null)
            {
                role = new Role();
                role.Name = DefinitionRole.DOCTOR;
                await roleRepository.CreateRole(role);
            }

            string password = GenerateRandomPassword();
            logger.LogInformation("Mật khẩu {}", password);

            User newUser = new User();
            newUser.Email = request.Email;
            newUser.Password = passwordHasher.HashPassword(newUser, password);
            newUser.Role = role;
            newUser.Phone = request.Phone;
            newUser.UserStatus = UserStatus.PENDING_VERIFICATION;

            await userRepository.CreateUserAsync(newUser);

            var newDoctor = new Doctor
            {
                UserId = newUser.Id,
                FirstName = request.FirstName,
                LastName = request.LastName,
                SpecialtyId = request.SpecialtyId,
                LicenseNumber = request.LicenseNumber,
                Degree = request.Degree,
                ConsultationFee = request.ConsultationFee,
                Gender = request.Gender,
                YearsOfExperience = request.YearsOfExperience,
                Bio = request.Bio,
                Avatar = request.Avatar,
                IsAvailable = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await doctorRepository.CreateDoctorAsync(newDoctor);

            await mailService.SendDoctorWelcomeEmail(
                to: newUser.Email,
                doctorName: newDoctor.FirstName + " " + newDoctor.LastName,
                email: newUser.Email,
                temporaryPassword: password,
                licenseNumber: newDoctor.LicenseNumber,
                specialty: specialty.SpecialtyName,
                consultationFee: newDoctor.ConsultationFee,
                registrationDate: newDoctor.CreatedAt
            );

            return new DoctorCreationResponse
            {
                Id = newDoctor.Id,
                UserId = newDoctor.UserId,
                UserName = newDoctor.FirstName + " " + newDoctor.LastName,
                UserEmail = newUser.Email,
                SpecialtyId = specialty.Id,
                SpecialtyName = specialty.SpecialtyName,
                LicenseNumber = newDoctor.LicenseNumber,
                Degree = newDoctor.Degree,
                ConsultationFee = newDoctor.ConsultationFee,
                IsAvailable = newDoctor.IsAvailable,
                Gender = newDoctor.Gender,
                YearsOfExperience = newDoctor.YearsOfExperience,
                Bio = newDoctor.Bio,
                CreatedAt = newDoctor.CreatedAt
            };
        }

        public async Task<DoctorDetailResponse> GetDoctorByIdAsync(long id)
        {
            var doctor = await doctorRepository.GetDoctorByIdAsync(id);
            if (doctor == null)
            {
                throw new AppException(ErrorCode.DOCTOR_NOT_FOUND);
            }

            var specialty = await specialtyRepository.GetSpecialty(doctor.SpecialtyId);

            return new DoctorDetailResponse
            {
                DoctorId = doctor.Id,
                FullName = $"{doctor.FirstName} {doctor.LastName}",
                Specialty = new SpecialtyDto
                {
                    SpecialtyId = specialty.Id,
                    SpecialtyName = specialty.SpecialtyName,
                    Description = specialty.Description
                },
                LicenseNumber = doctor.LicenseNumber,
                Degree = doctor.Degree,
                YearsOfExperience = doctor.YearsOfExperience,
                ConsultationFee = doctor.ConsultationFee,
                Bio = doctor.Bio,
                Gender = doctor.Gender,
                IsAvailable = doctor.IsAvailable
            };
        }

        public async Task<PageResponse<DoctorSearchResponse>> SearchDoctorsAsync(string? specialtyName,
            Gender? gender, bool? isAvailable, string? orderBy, int page, int pageSize)
        {
            try
            {
                // Build the base query
                var query = doctorRepository.GetDoctorsQueryable();

                // Apply filters
                if (!string.IsNullOrEmpty(specialtyName))
                {
                    query = query.Where(d => d.Specialty.SpecialtyName.Contains(specialtyName));
                }

                if (gender.HasValue)
                {
                    query = query.Where(d => d.Gender == gender.Value);
                }

                if (isAvailable.HasValue)
                {
                    query = query.Where(d => d.IsAvailable == isAvailable.Value);
                }

                // Apply ordering
                if (!string.IsNullOrEmpty(orderBy))
                {
                    switch (orderBy.ToLower())
                    {
                        case "experience":
                            query = query.OrderBy(d => d.YearsOfExperience);
                            break;
                        case "experience_desc":
                            query = query.OrderByDescending(d => d.YearsOfExperience);
                            break;
                        case "fee":
                            query = query.OrderBy(d => d.ConsultationFee);
                            break;
                        case "fee_desc":
                            query = query.OrderByDescending(d => d.ConsultationFee);
                            break;
                        default:
                            query = query.OrderBy(d => d.FirstName);
                            break;
                    }
                }
                else
                {
                    query = query.OrderBy(d => d.FirstName);
                }

                // Get total count
                var totalCount = await query.CountAsync();
                var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

                // Apply pagination
                var doctors = await query
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var result = new List<DoctorSearchResponse>();
                foreach (var doctor in doctors)
                {
                    var workSchedules = await GetDoctorWorkSchedules(doctor.Id);
                    result.Add(new DoctorSearchResponse
                    {
                        DoctorId = doctor.Id,
                        FullName = $"Dr. {doctor.FirstName} {doctor.LastName}".Trim(),
                        Specialty = new SpecialtyDto
                        {
                            SpecialtyId = doctor.Specialty.Id,
                            SpecialtyName = doctor.Specialty.SpecialtyName
                        },
                        Gender = doctor.Gender,
                        YearsOfExperience = doctor.YearsOfExperience,
                        ConsultationFee = doctor.ConsultationFee,
                        Bio = doctor.Bio,
                        WorkSchedules = workSchedules
                    });
                }

                return new PageResponse<DoctorSearchResponse>
                {
                    CurrentPages = page,
                    PageSizes = pageSize,
                    TotalPages = totalPages,
                    TotalElements = totalCount,
                    Items = result
                };
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error searching doctors");
                throw;
            }
        }

        private async Task<List<WorkScheduleDto>> GetDoctorWorkSchedules(long doctorId)
        {
            // This method should fetch work schedules from your schedule repository
            // Replace with your actual implementation
            var schedules = await scheduleRepository.GetDoctorSchedulesAsync(doctorId);

            return schedules.Select(s => new WorkScheduleDto
            {
                ScheduleId = s.Id,
                WorkDate = s.WorkDate.ToString("yyyy-MM-dd"),
                StartTime = s.StartTime.ToString(@"hh\:mm"),
                EndTime = s.EndTime.ToString(@"hh\:mm"),
                TimeSlots = s.TimeSlots?.Select(ts => new TimeSlotDto
                {
                    SlotId = ts.Id,
                    SlotTime = ts.SlotTime.ToString(@"hh\:mm"),
                    IsAvailable = ts.IsAvailable
                }).ToList() ?? new List<TimeSlotDto>()
            }).ToList();
        }

        private string GenerateRandomPassword(int length = 12)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
            var random = new Random();
            var password = new StringBuilder();

            // Đảm bảo có ít nhất 1 chữ hoa, 1 chữ thường, 1 số, 1 ký tự đặc biệt
            password.Append(chars[random.Next(0, 26)]); // Chữ hoa
            password.Append(chars[random.Next(26, 52)]); // Chữ thường  
            password.Append(chars[random.Next(52, 62)]); // Số
            password.Append(chars[random.Next(62, chars.Length)]); // Ký tự đặc biệt

            // Điền các ký tự còn lại
            for (int i = 4; i < length; i++)
            {
                password.Append(chars[random.Next(chars.Length)]);
            }

            // Shuffle để không có pattern cố định
            return new string(password.ToString().ToCharArray().OrderBy(x => random.Next()).ToArray());
        }
    }
}
