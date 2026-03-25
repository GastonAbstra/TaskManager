using DotnetLab.Access.Common.Domain.Configurations;

namespace DotnetLab.Access.Common.Domain;

public class TodoItem : BaseEntity
{
    public required string Title { get; set; }
    public required bool Completed { get; set; }

    public int UserId { get; set; }
    public User User { get; set; } = default!;
}
