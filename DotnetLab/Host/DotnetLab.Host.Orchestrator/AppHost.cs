//Check why [Project].Common is referenced with the IsAspireProject=false flag
//Check about Scalar and WithCommand method


var builder = DistributedApplication.CreateBuilder(args);

var sqlPassword = builder.AddParameter("sqlPassword", DotnetLab.Common.Constants.DevPassword);
var sql = builder.AddPostgres("postgres").WithPassword(sqlPassword).WithPgAdmin();
var db = sql.AddDatabase("DotnetLab");

var apiService = builder.AddProject<Projects.DotnetLab_Host_Api>("dotnetlab-host-api");
apiService
    .WithReference(db, "postgres")
    .WaitFor(db);

var proxyService = builder.AddProject<Projects.DotnetLab_Host_Proxy>("dotnetlab-host-proxy");
proxyService
    .WaitFor(apiService);

var clientService = builder.AddNpmApp("dotnetlab-client","../../../angular-app");
clientService
    .WaitFor(proxyService);

builder.Build().Run();
public partial class OrchestratorProgram { }