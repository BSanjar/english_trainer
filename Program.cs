using Lexi.Data;
using Lexi.Middleware;
using Lexi.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog((ctx, cfg) => cfg
    .ReadFrom.Configuration(ctx.Configuration)
    .WriteTo.Console());

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<LexiDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services
    .AddAuthentication("AdminCookie")
    .AddCookie("AdminCookie", opt =>
    {
        opt.LoginPath = "/api/admin/login";
        opt.ExpireTimeSpan = TimeSpan.FromDays(30);
        opt.SlidingExpiration = true;
        opt.Events.OnRedirectToLogin = ctx =>
        {
            ctx.Response.StatusCode = 401;
            return Task.CompletedTask;
        };
    });
builder.Services.AddAuthorization();

builder.Services.AddScoped<SrsService>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<LexiDbContext>();
    db.Database.Migrate();
    await Seeder.SeedAsync(db, app.Configuration, app.Environment);
}

app.UseSerilogRequestLogging();
app.UseDefaultFiles();
// No cache-control was set at all, so mobile browsers (Safari in particular)
// were free to keep serving app.js/index.html from their own heuristic cache
// for a long time after a deploy, well past the ETag actually changing.
// no-cache forces revalidation on every load (fast 304s when unchanged)
// instead of trusting a stale copy.
app.UseStaticFiles(new StaticFileOptions
{
    OnPrepareResponse = ctx =>
    {
        ctx.Context.Response.Headers.CacheControl = "no-cache";
    }
});

app.UseAuthentication();
app.UseMiddleware<ClientAuthMiddleware>();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();

app.Run();
