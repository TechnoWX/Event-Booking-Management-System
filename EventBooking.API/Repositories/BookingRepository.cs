using EventBooking.API.Data;
using EventBooking.API.Models;
using Microsoft.EntityFrameworkCore;

namespace EventBooking.API.Repositories
{
    public class BookingRepository : IBookingRepository
    {
        private readonly EventDBContext _context;

        public BookingRepository(EventDBContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Booking>> GetAllAsync()
        {
            return await _context.Bookings
                .Include(b => b.Event)
                .ToListAsync();
        }

        public async Task<Booking?> GetByIdAsync(int id)
        {
            return await _context.Bookings
                .Include(b => b.Event)
                .FirstOrDefaultAsync(b => b.BookingId == id);
        }

        public async Task<Booking> CreateAsync(Booking booking)
        {
            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();
            return booking;
        }

        public async Task<Booking?> UpdateAsync(int id, Booking booking)
        {
            var existing = await _context.Bookings.FindAsync(id);
            if (existing == null) return null;

            existing.EventId = booking.EventId;
            existing.ParticipantName = booking.ParticipantName;
            existing.ParticipantEmail = booking.ParticipantEmail;
            existing.Status = booking.Status;
            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var existing = await _context.Bookings.FindAsync(id);
            if (existing == null) return false;

            _context.Bookings.Remove(existing);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}