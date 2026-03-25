using System.ComponentModel.DataAnnotations;

namespace DotnetLab.Common.Configuration;
public class ConnectionStrings : IValidatableObject
{
    public const string ConfigSection = "ConnectionStrings";

    [Required]
    public string? Postgres { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        var result = new List<ValidationResult>();
        return result;
    }
}