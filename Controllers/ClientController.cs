using Lexi.Data;
using Microsoft.AspNetCore.Mvc;

namespace Lexi.Controllers;

public record SetLevelRequest(string Level);
public record SetGoalRequest(int DailyGoal);

[ApiController]
[Route("api/client")]
public class ClientController : LexiControllerBase
{
    private static readonly string[] ValidLevels = { "A1", "A2", "B1", "B2", "C1" };
    private readonly LexiDbContext _db;
    public ClientController(LexiDbContext db) { _db = db; }

    [HttpPut("level")]
    public async Task<IActionResult> SetLevel([FromBody] SetLevelRequest req)
    {
        if (!TryGetClient(out var client)) return Unauthorized();
        if (!ValidLevels.Contains(req.Level)) return BadRequest(new { error = "invalid_level" });
        client.Level = req.Level;
        await _db.SaveChangesAsync();
        return Ok(new ClientDto(client.Id, client.Name, client.Level, client.DailyGoal, client.TrialLocked));
    }

    [HttpPut("goal")]
    public async Task<IActionResult> SetGoal([FromBody] SetGoalRequest req)
    {
        if (!TryGetClient(out var client)) return Unauthorized();
        client.DailyGoal = Math.Clamp(req.DailyGoal, 5, 200);
        await _db.SaveChangesAsync();
        return Ok(new ClientDto(client.Id, client.Name, client.Level, client.DailyGoal, client.TrialLocked));
    }
}
