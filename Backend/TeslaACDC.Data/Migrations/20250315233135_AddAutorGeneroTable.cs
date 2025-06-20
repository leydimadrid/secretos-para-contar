using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace TeslaACDC.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddAutorGeneroTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "autor_genero",
                columns: table => new
                {
                    autor_id = table.Column<int>(type: "integer", nullable: false),
                    genero_id = table.Column<int>(type: "integer", nullable: false),
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_autor_genero", x => new { x.autor_id, x.genero_id });
                    table.ForeignKey(
                        name: "FK_autor_genero_autor_autor_id",
                        column: x => x.autor_id,
                        principalTable: "autor",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_autor_genero_genero_genero_id",
                        column: x => x.genero_id,
                        principalTable: "genero",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "donacion",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    monto = table.Column<decimal>(type: "numeric", nullable: false),
                    fecha_donacion = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    medio_pago = table.Column<string>(type: "text", nullable: false),
                    moneda = table.Column<string>(type: "text", nullable: false),
                    usuario_id = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_donacion", x => x.id);
                    table.ForeignKey(
                        name: "FK_donacion_AspNetUsers_usuario_id",
                        column: x => x.usuario_id,
                        principalTable: "AspNetUsers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_autor_genero_genero_id",
                table: "autor_genero",
                column: "genero_id");

            migrationBuilder.CreateIndex(
                name: "IX_donacion_usuario_id",
                table: "donacion",
                column: "usuario_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "autor_genero");

            migrationBuilder.DropTable(
                name: "donacion");
        }
    }
}
