using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TeslaACDC.Data.Migrations
{
    /// <inheritdoc />
    public partial class CampoPathArchivo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "pdf_url",
                table: "libro",
                newName: "path_archivo");

            migrationBuilder.RenameColumn(
                name: "url_reproduccion",
                table: "audiolibro",
                newName: "portada");

            migrationBuilder.RenameColumn(
                name: "url_descarga",
                table: "audiolibro",
                newName: "path_archivo");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "path_archivo",
                table: "libro",
                newName: "pdf_url");

            migrationBuilder.RenameColumn(
                name: "portada",
                table: "audiolibro",
                newName: "url_reproduccion");

            migrationBuilder.RenameColumn(
                name: "path_archivo",
                table: "audiolibro",
                newName: "url_descarga");
        }
    }
}
