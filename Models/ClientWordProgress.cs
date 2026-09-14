namespace Lexi.Models;

public class ClientWordProgress
{
    public Guid ClientId { get; set; }
    public int WordId { get; set; }
    public double Ef { get; set; } = 2.5;
    public int Ivl { get; set; } = 0;
    public int Reps { get; set; } = 0;
    public string Stage { get; set; } = "review";
    public DateTime Due { get; set; } = DateTime.UtcNow;
    public DateTime Last { get; set; } = DateTime.UtcNow;
    public int Correct { get; set; } = 0;
    public int Wrong { get; set; } = 0;
}
