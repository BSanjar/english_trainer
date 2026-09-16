using Lexi.Data;
using Lexi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Lexi.Controllers;

public record TrialSignupRequest(string Name);
public record RedeemRequest(string Code, string Name);
public record UnlockRequest(string Code);
public record ClientDto(Guid Id, string Name, string? Level, int DailyGoal, bool TrialLocked);
public record RedeemResponse(Guid DeviceToken, ClientDto Client);

[ApiController]
[Route("api/auth")]
public class AuthController : LexiControllerBase
{
    private readonly LexiDbContext _db;
    public AuthController(LexiDbContext db) { _db = db; }

    private static ClientDto ToDto(Client c) => new(c.Id, c.Name, c.Level, c.DailyGoal, c.TrialLocked);

    /// First-run signup: only a name, no code. The client can use the app
    /// freely until they finish one full daily cycle, at which point the
    /// backend flips TrialLocked and they need a real code to continue.
    [HttpPost("trial")]
    public async Task<IActionResult> Trial([FromBody] TrialSignupRequest req)
    {
        var name = (req.Name ?? "").Trim();
        if (name.Length == 0 || name.Length > 60)
            return BadRequest(new { error = "invalid_name" });

        var client = new Client { Name = name };
        _db.Clients.Add(client);
        await _db.SaveChangesAsync();

        return Ok(new RedeemResponse(client.DeviceToken, ToDto(client)));
    }

    /// Legacy path: redeeming a code creates a brand-new client (used when
    /// an admin hands out a code directly, bypassing the trial).
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

        var client = new Client { Name = name, CodeRedeemed = true };
        _db.Clients.Add(client);
        otc.UsedAt = now;
        otc.UsedByClientId = client.Id;
        await _db.SaveChangesAsync();

        return Ok(new RedeemResponse(client.DeviceToken, ToDto(client)));
    }

    /// Unlocks a trial-locked client with a real one-time code, in place -
    /// same device token, same progress, just no longer locked. Never
    /// auto-locks again afterwards.
    [HttpPost("unlock")]
    public async Task<IActionResult> Unlock([FromBody] UnlockRequest req)
    {
        if (!TryGetClient(out var client)) return Unauthorized();
        var code = (req.Code ?? "").Trim();

        var now = DateTime.UtcNow;
        var otc = await _db.OneTimeCodes
            .Where(c => c.Code == code && c.UsedAt == null && c.ExpiresAt > now)
            .OrderByDescending(c => c.CreatedAt)
            .FirstOrDefaultAsync();

        if (otc == null)
            return BadRequest(new { error = "invalid_or_expired_code" });

        client.TrialLocked = false;
        client.CodeRedeemed = true;
        otc.UsedAt = now;
        otc.UsedByClientId = client.Id;
        await _db.SaveChangesAsync();

        return Ok(ToDto(client));
    }

    [HttpGet("me")]
    public IActionResult Me()
    {
        if (!TryGetClient(out var client)) return Unauthorized();
        return Ok(ToDto(client));
    }
}
