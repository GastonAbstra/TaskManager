using System.Text.Json.Serialization;
using DotnetLab.Access.Common;
using DotnetLab.Access.Common.Domain;
using DotnetLab.Host.Common;
using System.Runtime.CompilerServices;
using Microsoft.EntityFrameworkCore;

[assembly: InternalsVisibleTo("Dotnetlab.Integration.Test")]

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAuthentication();
builder.AddServiceDefaults();

// Bind Configurations
var environment = builder.Environment;

 var mainConfiguration = HostConfiguration.Configure(
     builder.Services,
     builder.Configuration,
     environment.EnvironmentName);


// Add services to the container.
DotnetLab.Manager.Customer.ServiceInjection.ConfigureServices(builder.Services);

DotnetLab.Access.Common.ServiceInjection.ConfigureServices(builder.Services, mainConfiguration);
DotnetLab.Access.Todo.Data.ServiceInjection.ConfigureServices(builder.Services);

builder.Services
    .AddControllers()
    .AddJsonOptions(options => options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

builder.Services.AddIdentityApiEndpoints<User>()
    .AddEntityFrameworkStores<DotnetLabDbContext>();

var app = builder.Build();

// using var scope = app.Services.CreateScope();
// var context = scope.ServiceProvider.GetRequiredService<DotnetLabDbContext>();
if (app.Environment.IsDevelopment() && !app.Environment.IsEnvironment("Testing"))
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<DotnetLabDbContext>();
    db.Database.Migrate();
}

// _ = context.Database.EnsureDeleted();
// _ = context.Database.EnsureCreated();

app.UseDeveloperExceptionPage();

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapIdentityApi<User>();
app.Run();

public partial class ApiProgram { }