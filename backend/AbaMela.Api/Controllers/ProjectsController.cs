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
public class ProjectsController(AppDbContext db) : ControllerBase
{
    private Guid UserId => Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var id)
        ? id : throw new UnauthorizedAccessException();
    private string Role => User.FindFirstValue(ClaimTypes.Role) ?? "";
    private bool IsAdmin => Role == "Admin";

    [HttpGet]
    public async Task<ActionResult> List([FromQuery] string? status)
    {
        var q = db.Projects.AsNoTracking().AsQueryable();
        if (Role == "Organization") q = q.Where(p => p.OrganizationId == UserId);
        else if (Role == "Customer") q = q.Where(p => p.CustomerId == UserId);
        else if (!IsAdmin) return Forbid();

        if (!string.IsNullOrWhiteSpace(status)) q = q.Where(p => p.Status.ToLower() == status.ToLower());
        var projects = await q.OrderByDescending(p => p.StartDate).ToListAsync();

        if (Role == "Customer")
            return Ok(projects.Select(p => new CustomerProjectResponse(p.Id, p.Name, p.Client, p.Location, p.Status, p.Progress, p.StartDate, p.EndDate)));
        return Ok(projects);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult> Get(Guid id)
    {
        var q = db.Projects.AsNoTracking().AsQueryable();
        if (Role == "Organization") q = q.Where(p => p.OrganizationId == UserId);
        else if (Role == "Customer") q = q.Where(p => p.CustomerId == UserId);
        else if (!IsAdmin) return Forbid();

        var project = await q.FirstOrDefaultAsync(p => p.Id == id);
        if (project is null) return NotFound();
        if (Role == "Customer")
            return Ok(new CustomerProjectResponse(project.Id, project.Name, project.Client, project.Location, project.Status, project.Progress, project.StartDate, project.EndDate));
        return Ok(project);
    }

    [HttpPatch("{id:guid}")]
    [Authorize(Roles = "Organization,Admin")]
    public async Task<ActionResult> Update(Guid id, UpdateProjectRequest update)
    {
        if (update.Progress is < 0 or > 100)
            return BadRequest(new { message = "Progress must be between 0 and 100." });
        var q = db.Projects.AsQueryable();
        if (!IsAdmin) q = q.Where(p => p.OrganizationId == UserId);
        var project = await q.FirstOrDefaultAsync(p => p.Id == id);
        if (project is null) return NotFound();

        var allowedStatuses = new[] { "planning", "active", "onHold", "completed", "cancelled" };
        if (!allowedStatuses.Contains(update.Status, StringComparer.OrdinalIgnoreCase))
            return BadRequest(new { message = "Choose a valid project status." });

        project.Status = update.Status;
        project.Progress = update.Status.Equals("completed", StringComparison.OrdinalIgnoreCase) ? 100 : update.Progress;
        if (update.EndDate.HasValue) project.EndDate = update.EndDate;
        await db.SaveChangesAsync();
        return Ok(project);
    }

    [HttpPost]
    [Authorize(Roles = "Organization,Admin")]
    public async Task<ActionResult> Create(Project project)
    {
        if (string.IsNullOrWhiteSpace(project.Name) || project.Name.Trim().Length > 160)
            return BadRequest(new { message = "Project name is required and must be 160 characters or fewer." });
        if (project.Progress is < 0 or > 100 || project.Budget < 0 || project.Spent < 0)
            return BadRequest(new { message = "Progress must be 0–100 and budget/spent cannot be negative." });

        project.Id = Guid.NewGuid();
        project.OrganizationId = IsAdmin ? project.OrganizationId : UserId;
        if (project.OrganizationId == Guid.Empty)
            return BadRequest(new { message = "Organization is required." });

        if (!string.IsNullOrWhiteSpace(project.CustomerEmail))
        {
            var email = project.CustomerEmail.Trim().ToLowerInvariant();
            var customer = await db.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Email.ToLower() == email && u.Role == "Customer");
            if (customer is null)
                return BadRequest(new { message = "No Mela customer account was found for that email. Ask the customer to register first." });
            project.CustomerId = customer.Id;
            project.Client = customer.FullName;
        }
        else if (project.CustomerId.HasValue)
        {
            var customerExists = await db.Users.AnyAsync(u => u.Id == project.CustomerId && u.Role == "Customer");
            if (!customerExists) return BadRequest(new { message = "The selected customer account is invalid." });
        }

        project.Name = project.Name.Trim();
        project.Client = project.Client.Trim();
        project.Location = project.Location.Trim();
        db.Projects.Add(project);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = project.Id }, project);
    }
}

public record UpdateProjectRequest(string Status, int Progress, DateTime? EndDate);
