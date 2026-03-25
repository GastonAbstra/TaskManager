using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using DotnetLab.Common.Configuration;
using DotnetLab.Common.Enums;

namespace DotnetLab.Host.Common;
public static class HostConfiguration
{
    public static MainConfiguration Configure(IServiceCollection services, IConfiguration configuration, string environmentName)
    {
        var environment = Enum.Parse<EnvironmentType>(environmentName, true);

        _ = services.AddOptions<ConnectionStrings>().Bind(configuration.GetSection(ConnectionStrings.ConfigSection))
            .ValidateDataAnnotations()
            .ValidateOnStart();

        var mainConfiguration = configuration.Get<MainConfiguration>();

        mainConfiguration!.Environment = environment;

        return mainConfiguration!;
    }
}