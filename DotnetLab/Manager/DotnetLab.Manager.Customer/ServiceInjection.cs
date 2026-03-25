using DotnetLab.Access.Common.Domain.Configurations;
using DotnetLab.Manager.Customer.Contract.Todo;
using DotnetLab.Manager.Customer.Contract.User;
using Microsoft.Extensions.DependencyInjection;

namespace DotnetLab.Manager.Customer;

public static class ServiceInjection
{
    // UserManager service is not working propperly
    public static void ConfigureServices(IServiceCollection services)
    {
        _ = services.AddScoped<ITodoManager, TodoManager>();
        _ = services.AddScoped<IUserManager, UserManager>();
    }
}
