using System.ComponentModel.DataAnnotations;

namespace DotnetLab.Host.Api.Models.Todo;

public class CreateTodoApiRequest
{
    [Required]
    public required int UserId { get; set; }
    public required string Title { get; set; } 
}
