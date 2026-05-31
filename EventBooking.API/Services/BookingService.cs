using EventBooking.API.DTOs;
using EventBooking.API.Models;
using EventBooking.API.Repositories;
using Microsoft.EntityFrameworkCore;
using EventBooking.API.Data;

namespace EventBooking.API.Services
{
    public class BookingService : IBookingService
    {
        private readonly IBookingRepository _repository;
        private readonly EventDBContext _context;

        public BookingService(IBookingRepository repository, EventDBContext context)
        {
            _repository = repository;
            _context = context;
        }

        public async Task<IEnumerable<BookingDTO>> GetAllAsync()
        {
            var bookings = await _repository.GetAllAsync();
            return bookings.Select(b => new BookingDTO
            {
                BookingId = b.BookingId,
                EventId = b.EventId,
                EventTitle = b.Event?.Title ?? string.Empty,
                ParticipantName = b.ParticipantName,
                ParticipantEmail = b.ParticipantEmail,
                BookingDate = b.BookingDate,
                Status = b.Status
            });
        }

        public async Task<BookingDTO?> GetByIdAsync(int id)
        {
            var b = await _repository.GetByIdAsync(id);
            if (b == null) return null;

            return new BookingDTO
            {
                BookingId = b.BookingId,
                EventId = b.EventId,
                EventTitle = b.Event?.Title ?? string.Empty,
                ParticipantName = b.ParticipantName,
                ParticipantEmail = b.ParticipantEmail,
                BookingDate = b.BookingDate,
                Status = b.Status
            };
        }

        public async Task<BookingDTO> CreateAsync(CreateBookingDTO dto)
        {
            // 1. Check if the event exists
            var ev = await _context.Events
                .Include(e => e.Bookings)
                .FirstOrDefaultAsync(e => e.EventId == dto.EventId);

            if (ev == null)
                throw new KeyNotFoundException($"Event with ID {dto.EventId} not found.");

            // 2. check paricipants count
            var confirmedCount = ev.Bookings.Count(b => b.Status == "Confirmed");
            if (confirmedCount >= ev.MaxParticipants)
                throw new InvalidOperationException("This event is fully booked.");

            // 3. check duplicate bookings
            var duplicate = await _context.Bookings.AnyAsync(b =>
                b.EventId == dto.EventId &&
                b.ParticipantEmail.ToLower() == dto.ParticipantEmail.ToLower() &&
                b.Status == "Confirmed");

            if (duplicate)
                throw new InvalidOperationException("This email has already booked this event.");

            var booking = new Booking
            {
                EventId = dto.EventId,
                ParticipantName = dto.ParticipantName,
                ParticipantEmail = dto.ParticipantEmail,
                Status = dto.Status
            };

            var created = await _repository.CreateAsync(booking);
            return await GetByIdAsync(created.BookingId) ?? new BookingDTO();
        }

        public async Task<BookingDTO?> UpdateAsync(int id, CreateBookingDTO dto)
        {
            var existing = await _context.Bookings.FindAsync(id);
            if (existing == null) return null;

            // Only check when Cancelled change to Confirmed
            if (existing.Status == "Cancelled" && dto.Status == "Confirmed")
            {
                var ev = await _context.Events
                    .Include(e => e.Bookings)
                    .FirstOrDefaultAsync(e => e.EventId == dto.EventId);

                if (ev == null)
                    throw new KeyNotFoundException($"Event with ID {dto.EventId} not found.");

                var confirmedCount = ev.Bookings.Count(b => b.Status == "Confirmed" && b.BookingId != id);
                if (confirmedCount >= ev.MaxParticipants)
                    throw new InvalidOperationException("This event is fully booked.");
            }

            var booking = new Booking
            {
                EventId = dto.EventId,
                ParticipantName = dto.ParticipantName,
                ParticipantEmail = dto.ParticipantEmail,
                Status = dto.Status
            };

            var updated = await _repository.UpdateAsync(id, booking);
            if (updated == null) return null;
            return await GetByIdAsync(updated.BookingId);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _repository.DeleteAsync(id);
        }
    }
}