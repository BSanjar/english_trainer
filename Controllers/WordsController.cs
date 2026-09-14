using Lexi.Data;
using Lexi.Models;
using Lexi.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Lexi.Controllers;

public record WordDto(
    int Id, string Word, string Pos, string Level, string Topic, string Ru, string Ipa,
    string ExampleEn, string ExampleRu, string Status, bool Starred, int? Ivl, DateTime? Due
);

[ApiController]
[Route("api/words")]
public class WordsController : LexiControllerBase
{
    private readonly LexiDbContext _db;
    public WordsController(LexiDbContext db) { _db = db; }

    [HttpGet]
    public async Task<IActionResult> GetWords([FromQuery] string? level)
    {
        if (!TryGetClient(out var client)) return Unauthorized();
        var effectiveLevel = level ?? client.Level;
        if (string.IsNullOrEmpty(effectiveLevel))
            return BadRequest(new { error = "level_not_set" });

        var words = await _db.Words.Where(w => w.Level == effectiveLevel).OrderBy(w => w.Id).ToListAsync();
        var progress = await _db.ClientWordProgress.Where(p => p.ClientId == client.Id).ToDictionaryAsync(p => p.WordId);
        var stars = (await _db.ClientStars.Where(s => s.ClientId == client.Id).Select(s => s.WordId).ToListAsync()).ToHashSet();

        var dtos = words.Select(w =>
        {
            progress.TryGetValue(w.Id, out var p);
            return new WordDto(
                w.Id, w.WordText, w.Pos, w.Level, w.Topic, w.Ru, w.Ipa, w.ExampleEn, w.ExampleRu,
                SrsService.StatusOf(p), stars.Contains(w.Id), p?.Ivl, p?.Due
            );
        });

        return Ok(dtos);
    }

    [HttpPost("{id:int}/star")]
    public async Task<IActionResult> ToggleStar(int id)
    {
        if (!TryGetClient(out var client)) return Unauthorized();
        var existing = await _db.ClientStars.FirstOrDefaultAsync(s => s.ClientId == client.Id && s.WordId == id);
        bool starred;
        if (existing != null)
        {
            _db.ClientStars.Remove(existing);
            starred = false;
        }
        else
        {
            _db.ClientStars.Add(new ClientStar { ClientId = client.Id, WordId = id });
            starred = true;
        }
        await _db.SaveChangesAsync();
        return Ok(new { starred });
    }
}
