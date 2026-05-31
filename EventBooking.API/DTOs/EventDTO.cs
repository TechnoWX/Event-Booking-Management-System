using System.ComponentModel.DataAnnotations;

namespace EventBooking.API.DTOs
{
    public class EventDTO
    {
        public int EventId { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Location { get; set; } = string.Empty;
        public DateTime EventDate { get; set; }
        public int MaxParticipants { get; set; }
        public int BookedCount { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateEventDTO
    {
        [Required]
        public int CategoryId { get; set; }

        [Required]
        [MinLength(3, ErrorMessage = "Title must be at least 3 characters.")]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        [Required]
        public string Location { get; set; } = string.Empty;

        [Required]
        public DateTime EventDate { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "MaxParticipants must be at least 1.")]
        public int MaxParticipants { get; set; }
    }
}