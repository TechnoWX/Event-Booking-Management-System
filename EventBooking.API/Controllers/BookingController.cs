using EventBooking.API.DTOs;
using EventBooking.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace EventBooking.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingController : ControllerBase
    {
        private readonly IBookingService _service;

        public BookingController(IBookingService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var bookings = await _service.GetAllAsync();
            return Ok(bookings);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var booking = await _service.GetByIdAsync(id);
            if (booking == null)
                return NotFound(new { message = $"Booking with ID {id} not found." });

            return Ok(booking);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateBookingDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var created = await _service.CreateAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id = created.BookingId }, created);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateBookingDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var updated = await _service.UpdateAsync(id, dto);
                if (updated == null)
                    return NotFound(new { message = $"Booking with ID {id} not found." });
                return Ok(updated);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _service.DeleteAsync(id);
            if (!success)
                return NotFound(new { message = $"Booking with ID {id} not found." });

            return NoContent();
        }
    }
}