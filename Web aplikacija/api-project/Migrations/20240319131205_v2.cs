using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api_project.Migrations
{
    /// <inheritdoc />
    public partial class v2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RecenzijeKnjige");

            migrationBuilder.DropTable(
                name: "RecenzijeKnjizare");

            migrationBuilder.AlterColumn<string>(
                name: "Username",
                table: "Korisnici",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Prezime",
                table: "Korisnici",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Password",
                table: "Korisnici",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Ime",
                table: "Korisnici",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Korisnici",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Username",
                table: "Korisnici",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Prezime",
                table: "Korisnici",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Password",
                table: "Korisnici",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Ime",
                table: "Korisnici",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Korisnici",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "RecenzijeKnjige",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    KnjigaID = table.Column<int>(type: "int", nullable: true),
                    KorisnikID = table.Column<int>(type: "int", nullable: true),
                    Ocena = table.Column<long>(type: "bigint", nullable: false),
                    Tekst = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RecenzijeKnjige", x => x.ID);
                    table.ForeignKey(
                        name: "FK_RecenzijeKnjige_Knjige_KnjigaID",
                        column: x => x.KnjigaID,
                        principalTable: "Knjige",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_RecenzijeKnjige_Korisnici_KorisnikID",
                        column: x => x.KorisnikID,
                        principalTable: "Korisnici",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "RecenzijeKnjizare",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    KnjizaraID = table.Column<int>(type: "int", nullable: true),
                    KorisnikID = table.Column<int>(type: "int", nullable: true),
                    Ocena = table.Column<long>(type: "bigint", nullable: false),
                    Tekst = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RecenzijeKnjizare", x => x.ID);
                    table.ForeignKey(
                        name: "FK_RecenzijeKnjizare_Knjizara_KnjizaraID",
                        column: x => x.KnjizaraID,
                        principalTable: "Knjizara",
                        principalColumn: "ID");
                    table.ForeignKey(
                        name: "FK_RecenzijeKnjizare_Korisnici_KorisnikID",
                        column: x => x.KorisnikID,
                        principalTable: "Korisnici",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_RecenzijeKnjige_KnjigaID",
                table: "RecenzijeKnjige",
                column: "KnjigaID");

            migrationBuilder.CreateIndex(
                name: "IX_RecenzijeKnjige_KorisnikID",
                table: "RecenzijeKnjige",
                column: "KorisnikID");

            migrationBuilder.CreateIndex(
                name: "IX_RecenzijeKnjizare_KnjizaraID",
                table: "RecenzijeKnjizare",
                column: "KnjizaraID");

            migrationBuilder.CreateIndex(
                name: "IX_RecenzijeKnjizare_KorisnikID",
                table: "RecenzijeKnjizare",
                column: "KorisnikID");
        }
    }
}
