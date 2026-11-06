using AbaMela.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace AbaMela.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<ServiceCategory> ServiceCategories => Set<ServiceCategory>();
    public DbSet<Booking> Bookings => Set<Booking>();
    public DbSet<Quote> Quotes => Set<Quote>();
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<Product> Products => Set<Product>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
        modelBuilder.Entity<ServiceCategory>().HasIndex(s => s.Key).IsUnique();
        modelBuilder.Entity<Booking>().HasIndex(b => b.Status);
        modelBuilder.Entity<Booking>().HasIndex(b => b.CustomerId);
    }
}
