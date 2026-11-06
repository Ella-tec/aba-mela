using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AbaMela.Api.Data;
using AbaMela.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace AbaMela.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(AppDbContext db, IConfiguration config) : ControllerBase
{
    private static readonly HashSet<string> PublicRoles = new(StringComparer.OrdinalIgnoreCase)
        { "Customer", "Professional", "Organization" };

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest req)
    {
        var email = req.Email?.Trim().ToLowerInvariant();
        if (string.IsNullOrWhiteSpace(email) || email.Length > 254 ||
            !System.Net.Mail.MailAddress.TryCreate(email, out _))
            return BadRequest(new { message = "A valid email address is required." });
        if (string.IsNullOrWhiteSpace(req.Password) || req.Password.Length < 12 || req.Password.Length > 200)
            return BadRequest(new { message = "Password must be between 12 and 200 characters." });
        if (string.IsNullOrWhiteSpace(req.FullName) || req.FullName.Trim().Length > 120)
            return BadRequest(new { message = "Full name is required and must be 120 characters or fewer." });
        if (!PublicRoles.Contains(req.Role ?? ""))
            return BadRequest(new { message = "Select Customer, Professional, or Organization. Admin accounts cannot self-register." });
        if (await db.Users.AnyAsync(u => u.Email == email))
            return Conflict(new { message = "Email already registered" });

        var user = new User
        {
            Email = email,
            Phone = string.IsNullOrWhiteSpace(req.Phone) ? null : req.Phone.Trim(),
            FullName = req.FullName.Trim(),
            Role = PublicRoles.Single(r => r.Equals(req.Role, StringComparison.OrdinalIgnoreCase)),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password, workFactor: 12)
        };
        db.Users.Add(user);
        await db.SaveChangesAsync();
        return Ok(ToAuth(user));
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest req)
    {
        var email = req.Email?.Trim().ToLowerInvariant();
        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(req.Password))
            return BadRequest(new { message = "Email and password are required." });
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == email);
        if (user is null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
            return Unauthorized(new { message = "Invalid email or password." });
        return Ok(ToAuth(user));
    }

    private AuthResponse ToAuth(User user)
    {
        var configuredKey = config["Jwt:Key"];
        if (string.IsNullOrWhiteSpace(configuredKey) || Encoding.UTF8.GetByteCount(configuredKey) < 32)
            throw new InvalidOperationException("Jwt:Key must be configured as a secret with at least 32 UTF-8 bytes.");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuredKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expires = DateTime.UtcNow.AddMinutes(int.TryParse(config["Jwt:ExpiresMinutes"], out var minutes)
            ? Math.Clamp(minutes, 5, 1440) : 60);
        var token = new JwtSecurityToken(
            issuer: config["Jwt:Issuer"] ?? "AbaMela",
            audience: config["Jwt:Audience"] ?? "AbaMela",
            claims:
            [
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("lang", user.PreferredLanguage)
            ],
            expires: expires,
            signingCredentials: creds);
        return new AuthResponse(new JwtSecurityTokenHandler().WriteToken(token),
            user.Id, user.Email, user.FullName, user.Role, user.PreferredLanguage);
    }
}
