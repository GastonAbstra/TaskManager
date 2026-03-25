using System;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using DotnetLab.Access.Common.Domain;
using DotnetLab.Access.Common.Domain.Configurations;

namespace DotnetLab.Access.Common;

public class DotnetLabDbContext : IdentityDbContext<User, IdentityRole<int>, int>
{
    public DotnetLabDbContext(DbContextOptions<DotnetLabDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        _ = builder.ApplyConfigurationsFromAssembly(typeof(TodoConfiguration).Assembly);

        base.OnModelCreating(builder);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var entities = ChangeTracker.Entries().Where(
            e => e.Entity is BaseEntity && (
                e.State == EntityState.Added ||
                e.State == EntityState.Modified
            ));
        
        foreach (var entityEntry in entities)
        {
            var baseEntity = (BaseEntity)entityEntry.Entity;

            if (entityEntry.State == EntityState.Added)
            {
                baseEntity.DateCreated = DateTime.UtcNow;
                baseEntity.UserCreated = "System"; // baseEntity.UserCreated ?? "System";
            }
            else
            {
                baseEntity.DateUpdated = DateTime.UtcNow;
                baseEntity.UserUpdated = "System";
            }
        }
        
        return await base.SaveChangesAsync(cancellationToken);
    }

    public DbSet<User> User { get; set; }
    public DbSet<TodoItem> Todo { get; set; }
}