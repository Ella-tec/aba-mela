using AbaMela.Api.Data;
using AbaMela.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AbaMela.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ServicesController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult> List()
    {
        var items = await db.ServiceCategories.Where(s => s.IsActive).ToListAsync();
        if (items.Count == 0)
        {
            // seed defaults
            var keys = new[] { "plumbing", "electrical", "painting", "cleaning", "carpentry", "hvac", "masonry", "roofing" };
            foreach (var k in keys)
                db.ServiceCategories.Add(new ServiceCategory { Key = k });
            await db.SaveChangesAsync();
            items = await db.ServiceCategories.ToListAsync();
        }
        return Ok(items);
    }
}
