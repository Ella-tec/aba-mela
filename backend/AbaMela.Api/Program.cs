
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using AbaMela.Api.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// ==================================================
// 1. CONTROLLERS AND API DOCUMENTATION
// ==================================================

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Mela API",
        Version = "v1",
        Description = "Mela Service Platform API"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Enter your JWT Bearer token.",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// ==================================================
// 2. POSTGRESQL DATABASE
// ==================================================

var connectionString =
    builder.Configuration.GetConnectionString("Default");

if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException(
        "ConnectionStrings:Default must be configured."
    );
}

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseNpgsql(connectionString);
});

// ==================================================
// 3. JWT AUTHENTICATION
// ==================================================

var jwtKey = builder.Configuration["Jwt:Key"];

if (string.IsNullOrWhiteSpace(jwtKey) ||
    Encoding.UTF8.GetByteCount(jwtKey) < 32)
{
    throw new InvalidOperationException(
        "Jwt:Key must contain at least 32 UTF-8 bytes."
    );
}

var issuer = builder.Configuration["Jwt:Issuer"] ?? "Mela";
var audience = builder.Configuration["Jwt:Audience"] ?? "Mela";

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,

                ValidIssuer = issuer,
                ValidAudience = audience,

                IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(jwtKey)
                ),

                ClockSkew = TimeSpan.FromMinutes(1)
            };
    });

builder.Services.AddAuthorization();

// ==================================================
// 4. CORS CONFIGURATION
// ==================================================

var configuredOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .Get<string[]>() ?? Array.Empty<string>();

var allowedOrigins = configuredOrigins
    .Concat(
        builder.Environment.IsDevelopment()
            ? new[]
            {
                "http://localhost:5178",
                "http://localhost:5179",
                "http://127.0.0.1:5179"
            }
            : Array.Empty<string>()
    )
    .Distinct(StringComparer.OrdinalIgnoreCase)
    .ToArray();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        if (allowedOrigins.Length > 0)
        {
            policy.WithOrigins(allowedOrigins);
        }

        policy.AllowAnyHeader();
        policy.AllowAnyMethod();
    });
});

// ==================================================
// 5. BUILD APPLICATION
// ==================================================

var app = builder.Build();

// ==================================================
// 6. DEVELOPMENT DATABASE INITIALIZATION
// ==================================================

if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();

    var db = scope.ServiceProvider
        .GetRequiredService<AppDbContext>();

    await db.Database.EnsureCreatedAsync();
}

// ==================================================
// 7. SWAGGER
// ==================================================

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();

    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint(
            "/swagger/v1/swagger.json",
            "Mela API v1"
        );
    });
}

// ==================================================
// 8. HTTP MIDDLEWARE
// ==================================================

app.UseHttpsRedirection();

// CORS must run before authentication and authorization.
app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

// ==================================================
// 9. API ROUTES
// ==================================================

app.MapControllers();

// API health check
app.MapGet("/health", () =>
{
    return Results.Ok(new
    {
        status = "ok",
        service = "Mela API"
    });
});

// ==================================================
// 10. START APPLICATION
// ==================================================

app.Run();
