using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using DotnetLab.Common.Configuration;

namespace DotnetLab.Access.Common;
public static class ServiceInjection
{
    public static void ConfigureServices(IServiceCollection services, MainConfiguration configuration)
    {
        _ = services.AddDbContext<DotnetLabDbContext>(options =>
        {
            var connectionString = configuration.ConnectionStrings.Postgres;
            _ = options.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
            _ = options.UseNpgsql(connectionString);
        });
    }
}