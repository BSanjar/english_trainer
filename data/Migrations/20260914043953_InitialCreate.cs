using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Lexi.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "admin_users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Username = table.Column<string>(type: "text", nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_admin_users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "client_daily_block_activity",
                columns: table => new
                {
                    ClientId = table.Column<Guid>(type: "uuid", nullable: false),
                    Date = table.Column<DateOnly>(type: "date", nullable: false),
                    Block = table.Column<string>(type: "text", nullable: false),
                    CompletedCount = table.Column<int>(type: "integer", nullable: false),
                    TargetCount = table.Column<int>(type: "integer", nullable: false),
                    LastWordId = table.Column<int>(type: "integer", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_client_daily_block_activity", x => new { x.ClientId, x.Date, x.Block });
                });

            migrationBuilder.CreateTable(
                name: "client_word_stars",
                columns: table => new
                {
                    ClientId = table.Column<Guid>(type: "uuid", nullable: false),
                    WordId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_client_word_stars", x => new { x.ClientId, x.WordId });
                });

            migrationBuilder.CreateTable(
                name: "clients",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    DeviceToken = table.Column<Guid>(type: "uuid", nullable: false),
                    Level = table.Column<string>(type: "text", nullable: true),
                    DailyGoal = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    LastSeenAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_clients", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "words",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    WordText = table.Column<string>(type: "text", nullable: false),
                    Pos = table.Column<string>(type: "text", nullable: false),
                    Level = table.Column<string>(type: "text", nullable: false),
                    Topic = table.Column<string>(type: "text", nullable: false),
                    Ru = table.Column<string>(type: "text", nullable: false),
                    Ipa = table.Column<string>(type: "text", nullable: false),
                    ExampleEn = table.Column<string>(type: "text", nullable: false),
                    ExampleRu = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_words", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "one_time_codes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Code = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UsedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    UsedByClientId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_one_time_codes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_one_time_codes_clients_UsedByClientId",
                        column: x => x.UsedByClientId,
                        principalTable: "clients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "client_word_progress",
                columns: table => new
                {
                    ClientId = table.Column<Guid>(type: "uuid", nullable: false),
                    WordId = table.Column<int>(type: "integer", nullable: false),
                    Ef = table.Column<double>(type: "double precision", nullable: false),
                    Ivl = table.Column<int>(type: "integer", nullable: false),
                    Reps = table.Column<int>(type: "integer", nullable: false),
                    Stage = table.Column<string>(type: "text", nullable: false),
                    Due = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Last = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Correct = table.Column<int>(type: "integer", nullable: false),
                    Wrong = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_client_word_progress", x => new { x.ClientId, x.WordId });
                    table.ForeignKey(
                        name: "FK_client_word_progress_clients_ClientId",
                        column: x => x.ClientId,
                        principalTable: "clients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_client_word_progress_words_WordId",
                        column: x => x.WordId,
                        principalTable: "words",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_admin_users_Username",
                table: "admin_users",
                column: "Username",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_client_word_progress_ClientId_Due",
                table: "client_word_progress",
                columns: new[] { "ClientId", "Due" });

            migrationBuilder.CreateIndex(
                name: "IX_client_word_progress_WordId",
                table: "client_word_progress",
                column: "WordId");

            migrationBuilder.CreateIndex(
                name: "IX_clients_DeviceToken",
                table: "clients",
                column: "DeviceToken",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_one_time_codes_Code",
                table: "one_time_codes",
                column: "Code");

            migrationBuilder.CreateIndex(
                name: "IX_one_time_codes_UsedByClientId",
                table: "one_time_codes",
                column: "UsedByClientId");

            migrationBuilder.CreateIndex(
                name: "IX_words_Level",
                table: "words",
                column: "Level");

            migrationBuilder.CreateIndex(
                name: "IX_words_WordText",
                table: "words",
                column: "WordText");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "admin_users");

            migrationBuilder.DropTable(
                name: "client_daily_block_activity");

            migrationBuilder.DropTable(
                name: "client_word_progress");

            migrationBuilder.DropTable(
                name: "client_word_stars");

            migrationBuilder.DropTable(
                name: "one_time_codes");

            migrationBuilder.DropTable(
                name: "words");

            migrationBuilder.DropTable(
                name: "clients");
        }
    }
}
