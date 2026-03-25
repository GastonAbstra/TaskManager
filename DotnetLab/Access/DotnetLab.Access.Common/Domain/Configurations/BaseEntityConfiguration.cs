using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DotnetLab.Access.Common.Domain;

internal static class BaseEntityConfiguration<T> where T : BaseEntity  
{
    public static void Configure(EntityTypeBuilder<T> builder)
    {
        _ = builder.HasKey(x => x.Id);
        _ = builder
            .Property(x => x.DateCreated)
            .HasDefaultValueSql("GETUTCDATE()");
        //user create max length 50 char
        _ = builder
            .Property(x => x.UserCreated)
            .HasMaxLength(50);
        //user update max length 50 char
        _ = builder
            .Property(x => x.UserUpdated)
            .HasMaxLength(50);
    }
}
