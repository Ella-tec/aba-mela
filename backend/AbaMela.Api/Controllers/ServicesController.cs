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
        var existingServices = await db.ServiceCategories.ToListAsync();
        foreach (var service in existingServices.Where(service =>
                     DefaultServiceKeys.Contains(service.Key, StringComparer.OrdinalIgnoreCase)))
        {
            // Restore catalog entries that may have been disabled in an older database.
            service.IsActive = true;
        }

        var existingKeys = existingServices.Select(service => service.Key).ToList();
        var missingKeys = DefaultServiceKeys.Except(existingKeys, StringComparer.OrdinalIgnoreCase).ToArray();
        foreach (var key in missingKeys)
            db.ServiceCategories.Add(new ServiceCategory { Key = key });

        if (missingKeys.Length > 0 || existingServices.Count > 0)
            await db.SaveChangesAsync();

        var items = await db.ServiceCategories.Where(service => service.IsActive)
            .OrderBy(service => service.Key).ToListAsync();
        return Ok(items);
    }
}
