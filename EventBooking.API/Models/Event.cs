namespace EventBooking.API.Models
{
    public class Event
    {
        public int EventId { get; set; }
        public int CategoryId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Location { get; set; } = string.Empty;
        public DateTime EventDate { get; set; }
        public int MaxParticipants { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Navigation properties
        public Category? Category { get; set; }
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }
}