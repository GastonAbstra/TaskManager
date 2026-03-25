using DotnetLab.Host.Common;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

// Check if exist for postgres
// builder.Services.AddOpenTelemetry().UseAzureMonitor();

builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

var app = builder.Build();

app.MapReverseProxy();
app.UseHttpsRedirection();

await app.RunAsync();