using DotnetLab.Common.Enums;

namespace DotnetLab.Common.Configuration;
public class MainConfiguration
{
    public ConnectionStrings ConnectionStrings { get; set; } = null!;
    public EnvironmentType Environment { get; set; }
}