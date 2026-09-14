using Lexi.Models;

namespace Lexi.Services;

/// <summary>
/// Grading has exactly three forward-progressing outcomes — there is no "again"/lapse
/// path by design (removed per product decision: swiping a card = "easy", tapping +
/// revealing = "good" or "hard"; nothing sends a word back into short-interval relearning).
/// </summary>
public static class Grade
{
    public const string Hard = "hard";
    public const string Good = "good";
    public const string Easy = "easy";
}

public class SrsService
{
    public ClientWordProgress Review(ClientWordProgress? existing, Guid clientId, int wordId, string grade)
    {
        var now = DateTime.UtcNow;
        var p = existing ?? new ClientWordProgress
        {
            ClientId = clientId,
            WordId = wordId,
            Ef = 2.5,
            Ivl = 0,
            Reps = 0,
            Stage = "review",
            Due = now,
            Last = now,
            Correct = 0,
            Wrong = 0,
        };

        var isNew = existing == null || p.Reps == 0;

        if (isNew)
        {
            p.Ivl = grade switch
            {
                Grade.Hard => 1,
                Grade.Good => 2,
                Grade.Easy => 4,
                _ => 1,
            };
        }
        else
        {
            p.Ivl = grade switch
            {
                Grade.Hard => Math.Max(1, (int)Math.Round(p.Ivl * 1.2)),
                Grade.Good => Math.Max(1, (int)Math.Round(p.Ivl * p.Ef)),
                Grade.Easy => Math.Max(1, (int)Math.Round(p.Ivl * p.Ef * 1.3)),
                _ => p.Ivl,
            };
        }

        p.Ef = grade switch
        {
            Grade.Hard => Math.Max(1.3, p.Ef - 0.15),
            Grade.Easy => p.Ef + 0.15,
            _ => p.Ef,
        };

        p.Reps += 1;
        p.Correct += 1;
        p.Stage = "review";
        p.Due = now.AddDays(p.Ivl);
        p.Last = now;
        return p;
    }

    public static string StatusOf(ClientWordProgress? p)
    {
        if (p == null) return "new";
        if (p.Ivl >= 21) return "mastered";
        return "review";
    }
}
