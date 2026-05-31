using EventBooking.API.Data;
using EventBooking.API.Models;
using Microsoft.EntityFrameworkCore;

namespace EventBooking.API.Repositories
{
    public class EventRepository : IEventRepository
    {
        private readonly EventDBContext _context;

        public EventRepository(EventDBContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Event>> GetAllAsync()
        {
            return await _context.Events
                .Include(e => e.Category)
                .Include(e => e.Bookings)
                .ToListAsync();
        }

        public async Task<Event?> GetByIdAsync(int id)
        {
            return await _context.Events
                .Include(e => e.Category)
                .Include(e => e.Bookings)
                .FirstOrDefaultAsync(e => e.EventId == id);
        }

        public async Task<Event> CreateAsync(Event ev)
        {
            _context.Events.Add(ev);
            await _context.SaveChangesAsync();
            return ev;
        }

        public async Task<Event?> UpdateAsync(int id, Event ev)
        {
            var existing = await _context.Events.FindAsync(id);
            if (existing == null) return null;

            existing.CategoryId = ev.CategoryId;
            existing.Title = ev.Title;
            existing.Description = ev.Description;
            existing.Location = ev.Location;
            existing.EventDate = ev.EventDate;
            existing.MaxParticipants = ev.MaxParticipants;
            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var existing = await _context.Events
                .Include(e => e.Bookings)
                .FirstOrDefaultAsync(e => e.EventId == id);

            if (existing == null) return false;

            if (existing.Bookings.Any())
                throw new InvalidOperationException("Cannot delete this event as it has existing bookings.");

            _context.Events.Remove(existing);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}