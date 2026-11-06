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
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest req)
    {
        if (await db.Users.AnyAsync(u => u.Email == req.Email))
            return Conflict(new { message = "Email already registered" });

        var user = new User
        {
            Email = req.Email.Trim().ToLowerInvariant(),
            Phone = req.Phone,
            FullName = req.FullName,
            Role = string.IsNullOrWhiteSpace(req.Role) ? "Customer" : req.Role,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password)
        };
        db.Users.Add(user);
        await db.SaveChangesAsync();
        return Ok(ToAuth(user));
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest req)
    {
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == req.Email.Trim().ToLowerInvariant());
        if (user is null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
            return Unauthorized(new { message = "Invalid credentials" });
        return Ok(ToAuth(user));
    }

    private AuthResponse ToAuth(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
            config["Jwt:Key"] ?? "AbaMela_Dev_Secret_Key_Change_In_Production_32chars!"));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expires = DateTime.UtcNow.AddMinutes(int.Parse(config["Jwt:ExpiresMinutes"] ?? "10080"));
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
        return new AuthResponse(
            new JwtSecurityTokenHandler().WriteToken(token),
            user.Id, user.Email, user.FullName, user.Role, user.PreferredLanguage);
    }
}
