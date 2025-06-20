using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TeslaACDC.Data.Migrations
{
    /// <inheritdoc />
    public partial class CampoUrlReproduccionquitartilde : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "url_reproducción",
                table: "audiolibro",
                newName: "url_reproduccion");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "url_reproduccion",
                table: "audiolibro",
                newName: "url_reproducción");
        }
    }
}
