using AbaMela.Api.Data;
using AbaMela.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AbaMela.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ServicesController(AppDbContext db) : ControllerBase
{
    private static readonly string[] DefaultServiceKeys =
    [
        "plumbing", "electrical", "painting", "cleaning", "carpentry", "hvac",
        "masonry", "roofing", "tiling", "appliance", "pest", "landscaping",
        "fiber-splicing", "fiber-installation", "fiber-repair",
        "cctv-installation", "security-camera-installation", "access-control",
        "alarm-systems", "structured-cabling", "network-cabling", "intercom-systems",
        "audio-video-installation", "smart-home-installation", "low-voltage-troubleshooting", "gate-automation",
        "flooring",
        "drywall",
        "windows",
        "fencing",
        "insulation",
        "solar",
        "moving",
        "remodeling",
        "welding",
        "concrete"
    ];

    [HttpGet]
    public async Task<ActionResult> List()
    {
        // Add missing categories on older installations without duplicating existing rows.
        var existingKeys = await db.ServiceCategories.Select(service => service.Key).ToListAsync();
        var missingKeys = DefaultServiceKeys.Except(existingKeys, StringComparer.OrdinalIgnoreCase).ToArray();
        if (missingKeys.Length > 0)
        {
            foreach (var key in missingKeys)
                db.ServiceCategories.Add(new ServiceCategory { Key = key });
            await db.SaveChangesAsync();
        }

        var items = await db.ServiceCategories.Where(service => service.IsActive)
            .OrderBy(service => service.Key).ToListAsync();
        return Ok(items);
    }
}
