using Lexi.Data;
using Lexi.Models;
using Lexi.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Lexi.Controllers;

public record QueueResponse(List<WordDto> Due, List<WordDto> New);
public record ReviewRequest(int WordId, string Grade);
public record ProgressRequest(string Block, int? WordId);
public record BlockProgressDto(string Block, int Completed, int Target);
public record TodayResponse(List<BlockProgressDto> Blocks, int TotalCompleted, int TotalTarget);

[ApiController]
[Route("api/session")]
public class SessionController : LexiControllerBase
{
    private readonly LexiDbContext _db;
    private readonly SrsService _srs;
    public SessionController(LexiDbContext db, SrsService srs) { _db = db; _srs = srs; }

    [HttpGet("queue")]
    public async Task<IActionResult> GetQueue()
    {
        if (!TryGetClient(out var client)) return Unauthorized();
        if (string.IsNullOrEmpty(client.Level)) return BadRequest(new { error = "level_not_set" });

        var now = DateTime.UtcNow;

        var dueProgress = await _db.ClientWordProgress
            .Where(p => p.ClientId == client.Id && p.Due <= now)
            .OrderBy(p => p.Due)
            .Join(_db.Words.Where(w => w.Level == client.Level), p => p.WordId, w => w.Id, (p, w) => new { p, w })
            .ToListAsync();

        var seenWordIds = await _db.ClientWordProgress.Where(p => p.ClientId == client.Id).Select(p => p.WordId).ToListAsync();
        var newWords = await _db.Words
            .Where(w => w.Level == client.Level && !seenWordIds.Contains(w.Id))
            .OrderBy(w => w.Id)
            .Take(client.DailyGoal)
            .ToListAsync();

        var stars = (await _db.ClientStars.Where(s => s.ClientId == client.Id).Select(s => s.WordId).ToListAsync()).ToHashSet();

        var due = dueProgress.Select(x => new WordDto(
            x.w.Id, x.w.WordText, x.w.Pos, x.w.Level, x.w.Topic, x.w.Ru, x.w.Ipa, x.w.ExampleEn, x.w.ExampleRu,
            SrsService.StatusOf(x.p), stars.Contains(x.w.Id), x.p.Ivl, x.p.Due
        )).ToList();

        var @new = newWords.Select(w => new WordDto(
            w.Id, w.WordText, w.Pos, w.Level, w.Topic, w.Ru, w.Ipa, w.ExampleEn, w.ExampleRu,
            "new", stars.Contains(w.Id), null, null
        )).ToList();

        return Ok(new QueueResponse(due, @new));
    }

    [HttpPost("review")]
    public async Task<IActionResult> Review([FromBody] ReviewRequest req)
    {
        if (!TryGetClient(out var client)) return Unauthorized();
        if (client.TrialLocked) return StatusCode(403, new { error = "trial_locked" });
        if (string.IsNullOrEmpty(client.Level)) return BadRequest(new { error = "level_not_set" });
        if (req.Grade is not (Grade.Hard or Grade.Good or Grade.Easy))
            return BadRequest(new { error = "invalid_grade" });

        var existing = await _db.ClientWordProgress
            .FirstOrDefaultAsync(p => p.ClientId == client.Id && p.WordId == req.WordId);
        var wasNew = existing == null;
        var updated = _srs.Review(existing, client.Id, req.WordId, req.Grade);
        if (wasNew) _db.ClientWordProgress.Add(updated);

        await BumpBlockAsync(client.Id, client.Level!, BlockType.Learn, req.WordId, client.DailyGoal);
        await _db.SaveChangesAsync();
        await CheckTrialLockAsync(client);

        return Ok(new { updated.Ivl, updated.Due, status = SrsService.StatusOf(updated) });
    }

    [HttpPost("progress")]
    public async Task<IActionResult> LogProgress([FromBody] ProgressRequest req)
    {
        if (!TryGetClient(out var client)) return Unauthorized();
        if (client.TrialLocked) return StatusCode(403, new { error = "trial_locked" });
        if (string.IsNullOrEmpty(client.Level)) return BadRequest(new { error = "level_not_set" });
        if (!BlockType.All.Contains(req.Block) || req.Block == BlockType.Learn)
            return BadRequest(new { error = "invalid_block" });

        var activity = await BumpBlockAsync(client.Id, client.Level, req.Block, req.WordId, client.DailyGoal);
        await _db.SaveChangesAsync();
        await CheckTrialLockAsync(client);
        return Ok(new BlockProgressDto(req.Block, activity.CompletedCount, activity.TargetCount));
    }

    [HttpGet("today")]
    public async Task<IActionResult> Today()
    {
        if (!TryGetClient(out var client)) return Unauthorized();
        if (string.IsNullOrEmpty(client.Level)) return BadRequest(new { error = "level_not_set" });
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var rows = await _db.DailyBlockActivities
            .Where(a => a.ClientId == client.Id && a.Level == client.Level && a.Date == today)
            .ToDictionaryAsync(a => a.Block);

        var blocks = BlockType.Active.Select(b =>
        {
            rows.TryGetValue(b, out var row);
            return new BlockProgressDto(b, row?.CompletedCount ?? 0, row?.TargetCount ?? client.DailyGoal);
        }).ToList();

        return Ok(new TodayResponse(blocks, blocks.Sum(b => b.Completed), blocks.Sum(b => b.Target)));
    }

    private async Task<DailyBlockActivity> BumpBlockAsync(Guid clientId, string level, string block, int? wordId, int dailyGoal)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var activity = await _db.DailyBlockActivities
            .FirstOrDefaultAsync(a => a.ClientId == clientId && a.Level == level && a.Date == today && a.Block == block);
        if (activity == null)
        {
            activity = new DailyBlockActivity { ClientId = clientId, Level = level, Date = today, Block = block, TargetCount = dailyGoal };
            _db.DailyBlockActivities.Add(activity);
        }
        activity.CompletedCount += 1;
        activity.LastWordId = wordId;
        activity.UpdatedAt = DateTime.UtcNow;
        return activity;
    }

    /// A trial client (never redeemed a real code) who just finished one
    /// full daily cycle - every active block at/above its target - gets
    /// locked out until they enter a code. Clients who've ever redeemed a
    /// code are never auto-locked again.
    private async Task CheckTrialLockAsync(Client client)
    {
        if (client.CodeRedeemed || client.TrialLocked) return;
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var rows = await _db.DailyBlockActivities
            .Where(a => a.ClientId == client.Id && a.Level == client.Level && a.Date == today)
            .ToListAsync();
        var allDone = BlockType.Active.All(b =>
        {
            var row = rows.FirstOrDefault(r => r.Block == b);
            return row != null && row.TargetCount > 0 && row.CompletedCount >= row.TargetCount;
        });
        if (allDone)
        {
            client.TrialLocked = true;
            await _db.SaveChangesAsync();
        }
    }
}
