using System.ComponentModel.DataAnnotations;

namespace EventBooking.API.DTOs
{
    public class BookingDTO
    {
        public int BookingId { get; set; }
        public int EventId { get; set; }
        public string EventTitle { get; set; } = string.Empty;
        public string ParticipantName { get; set; } = string.Empty;
        public string ParticipantEmail { get; set; } = string.Empty;
        public DateTime BookingDate { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    public class CreateBookingDTO
    {
        [Required]
        public int EventId { get; set; }

        [Required]
        [MinLength(2, ErrorMessage = "Name must be at least 2 characters.")]
        public string ParticipantName { get; set; } = string.Empty;

        [Required]
        [EmailAddress(ErrorMessage = "Invalid email address.")]
        public string ParticipantEmail { get; set; } = string.Empty;

        [Required]
        public string Status { get; set; } = "Confirmed";
    }
}