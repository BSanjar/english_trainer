using Lexi.Models;
using Microsoft.EntityFrameworkCore;

namespace Lexi.Data;

public class LexiDbContext : DbContext
{
    public LexiDbContext(DbContextOptions<LexiDbContext> options) : base(options) { }

    public DbSet<AdminUser> AdminUsers => Set<AdminUser>();
    public DbSet<OneTimeCode> OneTimeCodes => Set<OneTimeCode>();
    public DbSet<Client> Clients => Set<Client>();
    public DbSet<Word> Words => Set<Word>();
    public DbSet<ClientWordProgress> ClientWordProgress => Set<ClientWordProgress>();
    public DbSet<ClientStar> ClientStars => Set<ClientStar>();
    public DbSet<DailyBlockActivity> DailyBlockActivities => Set<DailyBlockActivity>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<AdminUser>(e =>
        {
            e.ToTable("admin_users");
            e.HasIndex(x => x.Username).IsUnique();
        });

        b.Entity<OneTimeCode>(e =>
        {
            e.ToTable("one_time_codes");
            e.HasIndex(x => x.Code);
            e.HasOne(x => x.UsedByClient).WithMany().HasForeignKey(x => x.UsedByClientId).OnDelete(DeleteBehavior.SetNull);
        });

        b.Entity<Client>(e =>
        {
            e.ToTable("clients");
            e.HasIndex(x => x.DeviceToken).IsUnique();
        });

        b.Entity<Word>(e =>
        {
            e.ToTable("words");
            e.HasIndex(x => x.Level);
            e.HasIndex(x => x.WordText);
        });

        b.Entity<ClientWordProgress>(e =>
        {
            e.ToTable("client_word_progress");
            e.HasKey(x => new { x.ClientId, x.WordId });
            e.HasOne<Client>().WithMany().HasForeignKey(x => x.ClientId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne<Word>().WithMany().HasForeignKey(x => x.WordId).OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(x => new { x.ClientId, x.Due });
        });

        b.Entity<ClientStar>(e =>
        {
            e.ToTable("client_word_stars");
            e.HasKey(x => new { x.ClientId, x.WordId });
        });

        b.Entity<DailyBlockActivity>(e =>
        {
            e.ToTable("client_daily_block_activity");
            e.HasKey(x => new { x.ClientId, x.Level, x.Date, x.Block });
        });
    }
}
