using Microsoft.Extensions.DependencyInjection;
using DotnetLab.Common.Helpers;

namespace DotnetLab.Common;
public static class ServiceInjection
{
    public static void ConfigureServices(IServiceCollection services)
    {
        _ = services.AddSingleton<IStringManipulationHelper, StringManipulationHelper>();
    }
}