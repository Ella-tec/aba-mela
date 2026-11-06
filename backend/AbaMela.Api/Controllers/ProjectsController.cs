using System.Security.Claims;
using AbaMela.Api.Data;
using AbaMela.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AbaMela.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Organization,Admin")]
public class ProjectsController(AppDbContext db) : ControllerBase
{
    private Guid UserId => Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var id)
        ? id : throw new UnauthorizedAccessException();
    private bool IsAdmin => User.IsInRole("Admin");

    [HttpGet]
    public async Task<ActionResult> List([FromQuery] string? status)
    {
        var q = db.Projects.AsQueryable();
        if (!IsAdmin) q = q.Where(p => p.OrganizationId == UserId);
        if (!string.IsNullOrWhiteSpace(status)) q = q.Where(p => p.Status == status);
        return Ok(await q.OrderByDescending(p => p.StartDate).ToListAsync());
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult> Get(Guid id)
    {
        var q = db.Projects.AsQueryable();
        if (!IsAdmin) q = q.Where(p => p.OrganizationId == UserId);
        var project = await q.FirstOrDefaultAsync(p => p.Id == id);
        return project is null ? NotFound() : Ok(project);
    }

    [HttpPost]
    public async Task<ActionResult> Create(Project project)
    {
        if (string.IsNullOrWhiteSpace(project.Name) || project.Name.Trim().Length > 160)
            return BadRequest(new { message = "Project name is required and must be 160 characters or fewer." });
        if (project.Progress is < 0 or > 100 || project.Budget < 0 || project.Spent < 0)
            return BadRequest(new { message = "Progress must be 0–100 and budget/spent cannot be negative." });
        project.Id = Guid.NewGuid();
        project.OrganizationId = IsAdmin ? project.OrganizationId : UserId;
        if (project.OrganizationId == Guid.Empty) return BadRequest(new { message = "Organization is required." });
        project.Name = project.Name.Trim();
        db.Projects.Add(project);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = project.Id }, project);
    }
}
