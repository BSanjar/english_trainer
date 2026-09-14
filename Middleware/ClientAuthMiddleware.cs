using Lexi.Data;
using Microsoft.EntityFrameworkCore;

namespace Lexi.Middleware;

public class ClientAuthMiddleware
{
    private readonly RequestDelegate _next;

    public ClientAuthMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, LexiDbContext db)
    {
        var header = context.Request.Headers.Authorization.ToString();
        if (header.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
        {
            var tokenStr = header["Bearer ".Length..].Trim();
            if (Guid.TryParse(tokenStr, out var token))
            {
                var client = await db.Clients.FirstOrDefaultAsync(c => c.DeviceToken == token);
                if (client != null)
                {
                    context.Items["Client"] = client;
                    if (DateTime.UtcNow - client.LastSeenAt > TimeSpan.FromMinutes(1))
                    {
                        client.LastSeenAt = DateTime.UtcNow;
                        await db.SaveChangesAsync();
                    }
                }
            }
        }

        await _next(context);
    }
}
