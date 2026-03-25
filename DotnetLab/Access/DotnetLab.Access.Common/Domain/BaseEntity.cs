using System;

namespace DotnetLab.Access.Common.Domain;
public class BaseEntity
{
    public int Id { get; set; }
    public DateTime DateCreated { get; set; }
    public DateTime? DateUpdated { get; set; }
    public string UserCreated { get; set; } = string.Empty;
    public string? UserUpdated { get; set; }
}
