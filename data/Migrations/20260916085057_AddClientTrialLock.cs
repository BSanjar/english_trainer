using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Lexi.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddClientTrialLock : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "CodeRedeemed",
                table: "clients",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "TrialLocked",
                table: "clients",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            // Every client that already exists at this point signed up through the
            // old code-only flow, before the trial-signup path existed - mark them
            // as already having redeemed a code so they're never auto-locked.
            migrationBuilder.Sql("UPDATE clients SET \"CodeRedeemed\" = true;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CodeRedeemed",
                table: "clients");

            migrationBuilder.DropColumn(
                name: "TrialLocked",
                table: "clients");
        }
    }
}
