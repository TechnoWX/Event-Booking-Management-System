namespace EventBooking.API.Models
{
    public class Category
    {
        public int CategoryId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }

        // Navigation property
        public ICollection<Event> Events { get; set; } = new List<Event>();
    }
}