using EventBooking.API.Models;
using Microsoft.EntityFrameworkCore;

namespace EventBooking.API.Data
{
    public class EventDBContext : DbContext
    {
        public EventDBContext(DbContextOptions<EventDBContext> options) : base(options) { }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<Booking> Bookings { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Category -> Events (one to many)
            modelBuilder.Entity<Event>()
                .HasOne(e => e.Category)
                .WithMany(c => c.Events)
                .HasForeignKey(e => e.CategoryId);

            // Event -> Bookings (one to many)
            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Event)
                .WithMany(e => e.Bookings)
                .HasForeignKey(b => b.EventId);
        }
    }
}