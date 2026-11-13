using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AbaMela.Api.Data;
using AbaMela.Api.Models;
using AbaMela.Api.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace AbaMela.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(AppDbContext db, IConfiguration config, IDataProtectionProvider protection) : ControllerBase
{
    private static readonly HashSet<string> PublicRoles = new(StringComparer.OrdinalIgnoreCase)
        { "Customer", "Professional", "Organization" };
    private readonly IDataProtector _protector = protection.CreateProtector("Mela.AuthenticatorSecret.v1");

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest req)
    {
        var email = req.Email?.Trim().ToLowerInvariant();
        if (string.IsNullOrWhiteSpace(email) || email.Length > 254 || !System.Net.Mail.MailAddress.TryCreate(email, out _))
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
    public async Task<IActionResult> Login(LoginRequest req)
    {
        var email = req.Email?.Trim().ToLowerInvariant();
        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(req.Password))
            return BadRequest(new { message = "Email and password are required." });
        var user = await db.Users.FirstOrDefaultAsync(u => u.Email == email);
        if (user is null || !BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash))
            return Unauthorized(new { message = "Invalid email or password." });
        if (user.AuthenticatorEnabled)
            return Ok(new { mfaRequired = true, challengeToken = CreateToken(user, true) });
        return Ok(ToAuth(user));
    }

    [HttpPost("verify-authenticator")]
    public async Task<IActionResult> VerifyAuthenticator(VerifyAuthenticatorRequest req)
    {
        var user = await ValidateChallenge(req.ChallengeToken);
        if (user is null) return Unauthorized(new { message = "Your sign-in challenge expired. Please sign in again." });
        if (string.IsNullOrWhiteSpace(user.AuthenticatorSecretProtected))
            return Unauthorized(new { message = "Authenticator is not configured for this account." });
        if (!Totp.Verify(_protector.Unprotect(user.AuthenticatorSecretProtected), req.Code))
            return Unauthorized(new { message = "The authenticator code is incorrect. Check the code and try again." });
        return Ok(ToAuth(user));
    }

    [Authorize]
    [HttpGet("security")]
    public async Task<IActionResult> SecurityStatus()
    {
        var user = await CurrentUser();
        return user is null ? Unauthorized() : Ok(new { authenticatorEnabled = user.AuthenticatorEnabled });
    }

    [Authorize]
    [HttpPost("authenticator/setup")]
    public async Task<IActionResult> StartAuthenticatorSetup()
    {
        var user = await CurrentUser();
        if (user is null) return Unauthorized();
        var secret = Totp.CreateSecret();
        user.AuthenticatorSecretProtected = _protector.Protect(secret);
        user.AuthenticatorEnabled = false;
        await db.SaveChangesAsync();
        return Ok(new { secret, otpauthUri = Totp.ProvisioningUri(secret, user.Email), message = "Add this account to Microsoft Authenticator, then verify a code to finish setup." });
    }

    [Authorize]
    [HttpPost("authenticator/confirm")]
    public async Task<IActionResult> ConfirmAuthenticator(AuthenticatorCodeRequest req)
    {
        var user = await CurrentUser();
        if (user is null) return Unauthorized();
        if (string.IsNullOrWhiteSpace(user.AuthenticatorSecretProtected))
            return BadRequest(new { message = "Start authenticator setup first." });
        if (!Totp.Verify(_protector.Unprotect(user.AuthenticatorSecretProtected), req.Code))
            return BadRequest(new { message = "That code is not valid. Please try the current six-digit code." });
        user.AuthenticatorEnabled = true;
        await db.SaveChangesAsync();
        return Ok(new { authenticatorEnabled = true, message = "Microsoft Authenticator two-step verification is now enabled." });
    }

    [Authorize]
    [HttpPost("authenticator/disable")]
    public async Task<IActionResult> DisableAuthenticator(DisableAuthenticatorRequest req)
    {
        var user = await CurrentUser();
        if (user is null) return Unauthorized();
        if (!BCrypt.Net.BCrypt.Verify(req.Password ?? "", user.PasswordHash))
            return Unauthorized(new { message = "Your password is incorrect." });
        if (string.IsNullOrWhiteSpace(user.AuthenticatorSecretProtected) ||
            !Totp.Verify(_protector.Unprotect(user.AuthenticatorSecretProtected), req.Code))
            return Unauthorized(new { message = "The authenticator code is incorrect." });
        user.AuthenticatorEnabled = false;
        user.AuthenticatorSecretProtected = null;
        await db.SaveChangesAsync();
        return Ok(new { authenticatorEnabled = false, message = "Two-step verification has been disabled." });
    }

    private async Task<User?> CurrentUser()
    {
        var id = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(id, out var userId) ? await db.Users.FirstOrDefaultAsync(u => u.Id == userId) : null;
    }

    private async Task<User?> ValidateChallenge(string? token)
    {
        if (string.IsNullOrWhiteSpace(token)) return null;
        try
        {
            var handler = new JwtSecurityTokenHandler();
            var principal = handler.ValidateToken(token, ValidationParameters(), out _);
            if (principal.FindFirstValue("purpose") != "mfa") return null;
            var id = principal.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(id, out var userId)) return null;
            var user = await db.Users.FirstOrDefaultAsync(u => u.Id == userId);
            return user?.AuthenticatorEnabled == true ? user : null;
        }
        catch { return null; }
    }

    private TokenValidationParameters ValidationParameters()
    {
        var key = config["Jwt:Key"]!;
        return new TokenValidationParameters
        {
            ValidateIssuer = true, ValidateAudience = true, ValidateLifetime = true,
            ValidateIssuerSigningKey = true, ValidIssuer = config["Jwt:Issuer"] ?? "Mela",
            ValidAudience = config["Jwt:Audience"] ?? "Mela",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
            ClockSkew = TimeSpan.FromSeconds(30)
        };
    }

    private string CreateToken(User user, bool challenge = false)
    {
        var configuredKey = config["Jwt:Key"];
        if (string.IsNullOrWhiteSpace(configuredKey) || Encoding.UTF8.GetByteCount(configuredKey) < 32)
            throw new InvalidOperationException("Jwt:Key must be configured as a secret with at least 32 UTF-8 bytes.");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuredKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expires = DateTime.UtcNow.AddMinutes(challenge ? 5 :
            int.TryParse(config["Jwt:ExpiresMinutes"], out var minutes) ? Math.Clamp(minutes, 5, 1440) : 60);
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Role, user.Role),
            new("lang", user.PreferredLanguage)
        };
        if (challenge) claims.Add(new Claim("purpose", "mfa"));
        var token = new JwtSecurityToken(config["Jwt:Issuer"] ?? "Mela",
            config["Jwt:Audience"] ?? "Mela", claims, expires: expires, signingCredentials: creds);
        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private AuthResponse ToAuth(User user) =>
        new(CreateToken(user), user.Id, user.Email, user.FullName, user.Role, user.PreferredLanguage);
}

public record VerifyAuthenticatorRequest(string ChallengeToken, string Code);
public record AuthenticatorCodeRequest(string Code);
public record DisableAuthenticatorRequest(string Password, string Code);
