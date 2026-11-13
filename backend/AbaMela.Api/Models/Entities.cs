namespace AbaMela.Api.Models;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Email { get; set; } = "";
    public string? Phone { get; set; }
    public string PasswordHash { get; set; } = "";
    public string FullName { get; set; } = "";
    public string Role { get; set; } = "Customer"; // Customer | Professional | Organization | Admin
    public string PreferredLanguage { get; set; } = "en";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool IsVerified { get; set; }
    public string? AuthenticatorSecretProtected { get; set; }
    public bool AuthenticatorEnabled { get; set; }
}

public class ServiceCategory
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Key { get; set; } = "";
    public bool IsActive { get; set; } = true;
}

public class Booking
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid CustomerId { get; set; }
    public Guid? ProfessionalId { get; set; }
    public Guid ServiceCategoryId { get; set; }
    public string Status { get; set; } = "requested";
    public string Address { get; set; } = "";
    public double? Lat { get; set; }
    public double? Lng { get; set; }
    public DateTime? ScheduledAt { get; set; }
    public string? Notes { get; set; }
    public decimal? Price { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class Quote
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid BookingId { get; set; }
    public Guid ProfessionalId { get; set; }
    public decimal Amount { get; set; }
    public string? Notes { get; set; }
    public string Status { get; set; } = "pending";
    public DateTime ValidUntil { get; set; }
}

public class Project
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid OrganizationId { get; set; }
    public Guid? CustomerId { get; set; }
    [System.ComponentModel.DataAnnotations.Schema.NotMapped]
    public string? CustomerEmail { get; set; }
    public string Name { get; set; } = "";
    public string Client { get; set; } = "";
    public string Location { get; set; } = "";
    public string Status { get; set; } = "planning";
    public int Progress { get; set; }
    public decimal Budget { get; set; }
    public decimal Spent { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}

public class Product
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid SupplierId { get; set; }
    public string Name { get; set; } = "";
    public string Category { get; set; } = "";
    public int Stock { get; set; }
    public decimal Price { get; set; }
    public string Unit { get; set; } = "unit";
}

public record RegisterRequest(string Email, string Password, string FullName, string Role, string? Phone);
public record LoginRequest(string Email, string Password);
public record AuthResponse(string Token, Guid UserId, string Email, string FullName, string Role, string PreferredLanguage);
public record CreateBookingRequest(Guid ServiceCategoryId, string Address, DateTime? ScheduledAt, string? Notes, double? Lat, double? Lng);
public record CustomerProjectResponse(Guid Id, string Name, string Client, string Location, string Status, int Progress, DateTime? StartDate, DateTime? EndDate);
