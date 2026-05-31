namespace EventBooking.API.Models
{
    public class Booking
    {
        public int BookingId { get; set; }
        public int EventId { get; set; }
        public string ParticipantName { get; set; } = string.Empty;
        public string ParticipantEmail { get; set; } = string.Empty;
        public DateTime BookingDate { get; set; } = DateTime.Now;
        public string Status { get; set; } = "Confirmed";

        // Navigation property
        public Event? Event { get; set; }
    }
}