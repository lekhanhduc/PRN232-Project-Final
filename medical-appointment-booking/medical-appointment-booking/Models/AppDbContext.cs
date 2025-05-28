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
        public DbSet<Schedules> Schedules { get; set; }
        public DbSet<Clinics> Clinics { get; set; }
        public DbSet<Appointments> Appointments { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
