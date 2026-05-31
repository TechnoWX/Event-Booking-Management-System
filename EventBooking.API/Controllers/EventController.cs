using EventBooking.API.DTOs;
using EventBooking.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace EventBooking.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventController : ControllerBase
    {
        private readonly IEventService _service;

        public EventController(IEventService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var events = await _service.GetAllAsync();
            return Ok(events);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var ev = await _service.GetByIdAsync(id);
            if (ev == null)
                return NotFound(new { message = $"Event with ID {id} not found." });

            return Ok(ev);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateEventDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var created = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.EventId }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateEventDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updated = await _service.UpdateAsync(id, dto);
            if (updated == null)
                return NotFound(new { message = $"Event with ID {id} not found." });

            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var success = await _service.DeleteAsync(id);
                if (!success)
                    return NotFound(new { message = $"Event with ID {id} not found." });
                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}