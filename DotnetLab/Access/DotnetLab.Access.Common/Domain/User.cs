using System;
using Microsoft.AspNetCore.Identity;

namespace DotnetLab.Access.Common.Domain;

public class User : IdentityUser<int>
{
    public ICollection<TodoItem> Todos { get; set; } = new HashSet<TodoItem>();
}
