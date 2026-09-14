using Lexi.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Lexi.Controllers;

public record DayStatDto(DateOnly Date, int Completed, int Target);
public record MonthStatsResponse(List<DayStatDto> Days, int Streak, double AccuracyPercent, int TotalMastered, int TotalInProgress);

[ApiController]
[Route("api/stats")]
public class StatsController : LexiControllerBase
{
    private readonly LexiDbContext _db;
    public StatsController(LexiDbContext db) { _db = db; }

    [HttpGet("month")]
    public async Task<IActionResult> Month([FromQuery] int? year, [FromQuery] int? month)
    {
        if (!TryGetClient(out var client)) return Unauthorized();
        var now = DateTime.UtcNow;
        var y = year ?? now.Year;
        var m = month ?? now.Month;
        var start = new DateOnly(y, m, 1);
        var end = start.AddMonths(1);

        var rows = await _db.DailyBlockActivities
            .Where(a => a.ClientId == client.Id && a.Date >= start && a.Date < end)
            .GroupBy(a => a.Date)
            .Select(g => new DayStatDto(g.Key, g.Sum(x => x.CompletedCount), g.Sum(x => x.TargetCount)))
            .ToListAsync();

        var streak = await ComputeStreakAsync(client.Id);

        var progress = await _db.ClientWordProgress.Where(p => p.ClientId == client.Id).ToListAsync();
        var totalCorrect = progress.Sum(p => p.Correct);
        var totalWrong = progress.Sum(p => p.Wrong);
        var accuracy = (totalCorrect + totalWrong) > 0 ? 100.0 * totalCorrect / (totalCorrect + totalWrong) : 0;
        var mastered = progress.Count(p => p.Ivl >= 21);

        return Ok(new MonthStatsResponse(rows, streak, Math.Round(accuracy, 1), mastered, progress.Count - mastered));
    }

    private async Task<int> ComputeStreakAsync(Guid clientId)
    {
        var activeDates = (await _db.DailyBlockActivities
            .Where(a => a.ClientId == clientId && a.CompletedCount > 0)
            .Select(a => a.Date)
            .Distinct()
            .ToListAsync())
            .ToHashSet();

        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var cursor = activeDates.Contains(today) ? today : today.AddDays(-1);
        var streak = 0;
        while (activeDates.Contains(cursor))
        {
            streak++;
            cursor = cursor.AddDays(-1);
        }
        return streak;
    }
}
