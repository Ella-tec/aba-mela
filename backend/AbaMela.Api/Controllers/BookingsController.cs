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
    private Guid UserId => Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var id)
        ? id : throw new UnauthorizedAccessException();
    private string Role => User.FindFirstValue(ClaimTypes.Role) ?? "";

    [HttpGet]
    public async Task<ActionResult> List([FromQuery] string? status)
    {
        var q = db.Bookings.AsQueryable();
        if (Role == "Customer") q = q.Where(b => b.CustomerId == UserId);
        else if (Role == "Professional") q = q.Where(b => b.ProfessionalId == UserId || b.Status == "requested");
        else if (Role != "Admin") return Forbid();
        if (!string.IsNullOrWhiteSpace(status)) q = q.Where(b => b.Status == status);
        return Ok(await q.OrderByDescending(b => b.CreatedAt).Take(100).ToListAsync());
    }

    [HttpPost]
    [Authorize(Roles = "Customer")]
    public async Task<ActionResult> Create(CreateBookingRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Address) || req.Address.Trim().Length > 500)
            return BadRequest(new { message = "A valid service address is required." });
        if (req.ScheduledAt.HasValue && req.ScheduledAt.Value < DateTime.UtcNow.AddMinutes(-5))
            return BadRequest(new { message = "Scheduled time must be in the future." });
        var serviceExists = await db.ServiceCategories.AnyAsync(s => s.Id == req.ServiceCategoryId && s.IsActive);
        if (!serviceExists) return BadRequest(new { message = "Choose an active service category." });

        var booking = new Booking
        {
            CustomerId = UserId, ServiceCategoryId = req.ServiceCategoryId,
            Address = req.Address.Trim(), ScheduledAt = req.ScheduledAt,
            Notes = string.IsNullOrWhiteSpace(req.Notes) ? null : req.Notes.Trim(),
            Lat = req.Lat, Lng = req.Lng, Status = "requested"
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
        if (!CanAccess(b)) return Forbid();
        return Ok(b);
    }

    [HttpPost("{id:guid}/accept")]
    [Authorize(Roles = "Professional")]
    public async Task<ActionResult> Accept(Guid id)
    {
        var b = await db.Bookings.FindAsync(id);
        if (b is null) return NotFound();
        if (b.Status != "requested" || b.ProfessionalId != null)
            return Conflict(new { message = "This booking is no longer available." });
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
        if (!CanAccess(b)) return Forbid();
        var allowed = Role switch
        {
            "Customer" => new[] { "cancelled" },
            "Professional" => new[] { "assigned", "in_progress", "completed", "cancelled" },
            "Admin" => new[] { "requested", "assigned", "in_progress", "completed", "cancelled" },
            _ => Array.Empty<string>()
        };
        if (!allowed.Contains(dto.Status, StringComparer.OrdinalIgnoreCase))
            return Forbid();
        if (Role == "Customer" && b.Status != "requested")
            return Conflict(new { message = "Only requested bookings can be cancelled by the customer." });
        b.Status = dto.Status.ToLowerInvariant();
        await db.SaveChangesAsync();
        return Ok(b);
    }

    private bool CanAccess(Booking booking) => Role switch
    {
        "Admin" => true,
        "Customer" => booking.CustomerId == UserId,
        "Professional" => booking.ProfessionalId == UserId,
        _ => false
    };

    public record StatusDto(string Status);
}
