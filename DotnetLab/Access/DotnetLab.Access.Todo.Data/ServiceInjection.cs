using DotnetLab.Access.Todo.Data.Contract;
using Microsoft.Extensions.DependencyInjection;

namespace DotnetLab.Access.Todo.Data;

public static class ServiceInjection
{
    public static void ConfigureServices(IServiceCollection services)
    {
        _ = services.AddScoped<ITodoDataAccess, TodoDataAccess>();
    }
}
