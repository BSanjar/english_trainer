using Lexi.Data;
using Lexi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Lexi.Controllers;

public record RedeemRequest(string Code, string Name);
public record ClientDto(Guid Id, string Name, string? Level, int DailyGoal);
public record RedeemResponse(Guid DeviceToken, ClientDto Client);

[ApiController]
[Route("api/auth")]
public class AuthController : LexiControllerBase
{
    private readonly LexiDbContext _db;
    public AuthController(LexiDbContext db) { _db = db; }

    [HttpPost("redeem")]
    public async Task<IActionResult> Redeem([FromBody] RedeemRequest req)
    {
        var code = (req.Code ?? "").Trim();
        var name = (req.Name ?? "").Trim();
        if (name.Length == 0 || name.Length > 60)
            return BadRequest(new { error = "invalid_name" });

        var now = DateTime.UtcNow;
        var otc = await _db.OneTimeCodes
            .Where(c => c.Code == code && c.UsedAt == null && c.ExpiresAt > now)
            .OrderByDescending(c => c.CreatedAt)
            .FirstOrDefaultAsync();

        if (otc == null)
            return BadRequest(new { error = "invalid_or_expired_code" });

        var client = new Client { Name = name };
        _db.Clients.Add(client);
        otc.UsedAt = now;
        otc.UsedByClientId = client.Id;
        await _db.SaveChangesAsync();

        return Ok(new RedeemResponse(client.DeviceToken, new ClientDto(client.Id, client.Name, client.Level, client.DailyGoal)));
    }

    [HttpGet("me")]
    public IActionResult Me()
    {
        if (!TryGetClient(out var client)) return Unauthorized();
        return Ok(new ClientDto(client.Id, client.Name, client.Level, client.DailyGoal));
    }
}
