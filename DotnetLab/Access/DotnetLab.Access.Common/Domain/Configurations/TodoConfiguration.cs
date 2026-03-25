using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DotnetLab.Access.Common.Domain.Configurations;

internal sealed class TodoConfiguration : IEntityTypeConfiguration<TodoItem>
{
    public void Configure(EntityTypeBuilder<TodoItem> builder)
    {
        _ = builder
            .Property(x => x.Title)
            .HasMaxLength(100);

        _ = builder
            .HasOne(x => x.User)
            .WithMany(x => x.Todos)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.NoAction);
    }
}
