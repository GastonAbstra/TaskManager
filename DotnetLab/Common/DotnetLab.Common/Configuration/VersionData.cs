using System.ComponentModel.DataAnnotations;

namespace DotnetLab.Common.Configuration;

public class VersionData : IValidatableObject
{
    public const string ConfigSection = "VersionData";

    [Required]
    public string? Version { get; set; }

    [Required]
    public string? CommitHash { get; set; }

    [Required]
    public string? VersionDate { get; set; }

    [Required]
    public string? BranchName { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        var result = new List<ValidationResult>();
        return result;
    }
}