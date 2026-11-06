using System.Security.Claims;
using AbaMela.Api.Data;
using AbaMela.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AbaMela.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BookingsController(AppDbContext db) : ControllerBase
{
    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<ActionResult> List([FromQuery] string? status)
    {
        var role = User.FindFirstValue(ClaimTypes.Role);
        var q = db.Bookings.AsQueryable();
        if (role == "Customer")
            q = q.Where(b => b.CustomerId == UserId);
        else if (role == "Professional")
            q = q.Where(b => b.ProfessionalId == UserId || b.Status == "requested");
        if (!string.IsNullOrEmpty(status))
            q = q.Where(b => b.Status == status);
        var items = await q.OrderByDescending(b => b.CreatedAt).Take(100).ToListAsync();
        return Ok(items);
    }

    [HttpPost]
    public async Task<ActionResult> Create(CreateBookingRequest req)
    {
        var booking = new Booking
        {
            CustomerId = UserId,
            ServiceCategoryId = req.ServiceCategoryId,
            Address = req.Address,
            ScheduledAt = req.ScheduledAt,
            Notes = req.Notes,
            Lat = req.Lat,
            Lng = req.Lng,
            Status = "requested"
        };
        db.Bookings.Add(booking);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = booking.Id }, booking);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult> Get(Guid id)
    {
        var b = await db.Bookings.FindAsync(id);
        if (b is null) return NotFound();
        return Ok(b);
    }

    [HttpPost("{id:guid}/accept")]
    public async Task<ActionResult> Accept(Guid id)
    {
        var b = await db.Bookings.FindAsync(id);
        if (b is null) return NotFound();
        if (b.Status != "requested") return BadRequest(new { message = "Not available" });
        b.ProfessionalId = UserId;
        b.Status = "assigned";
        await db.SaveChangesAsync();
        return Ok(b);
    }

    [HttpPatch("{id:guid}/status")]
    public async Task<ActionResult> UpdateStatus(Guid id, [FromBody] StatusDto dto)
    {
        var b = await db.Bookings.FindAsync(id);
        if (b is null) return NotFound();
        b.Status = dto.Status;
        await db.SaveChangesAsync();
        return Ok(b);
    }

    public record StatusDto(string Status);
}
