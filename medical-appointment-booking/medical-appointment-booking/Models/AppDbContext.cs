using Microsoft.EntityFrameworkCore;

namespace medical_appointment_booking.Models
{
    public class AppDbContext: DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Doctor> Doctors { get; set; }
        public DbSet<Specialty> Specialties { get; set; }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<AppointmentHistory> AppointmentHistories { get; set; }
        public DbSet<ServicePackage> ServicePackages { get; set; }
        //public DbSet<DoctorService> DoctorServices { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<TimeSlot> TimeSlots { get; set; }
        public DbSet<WorkSchedule> WorkSchedules { get; set; }
        public DbSet<DoctorLeave> DoctorLeaves { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Cấu hình cho Appointment
            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.CreatedByUser)
                .WithMany()
                .HasForeignKey(a => a.CreatedBy)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.CancelledByUser)
                .WithMany()
                .HasForeignKey(a => a.CancelledBy)
                .OnDelete(DeleteBehavior.NoAction); 

            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Patient)
                .WithMany(p => p.Appointments)
                .HasForeignKey(a => a.PatientId)
                .OnDelete(DeleteBehavior.Restrict); 

            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Doctor)
                .WithMany()
                .HasForeignKey(a => a.DoctorId)
                .OnDelete(DeleteBehavior.NoAction); 
        }
    }
}
