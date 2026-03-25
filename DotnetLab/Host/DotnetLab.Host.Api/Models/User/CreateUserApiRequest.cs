using System.ComponentModel.DataAnnotations;

namespace DotnetLab.Host.Api.Models.User;

public class CreateUserApiRequest
{
    [Required]
    public required string Email { get; set; }
    [Required]
    [StringLength(100, MinimumLength = 8)]
    public required string Password { get; set; }
}
