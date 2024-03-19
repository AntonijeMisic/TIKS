using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api_project.Migrations
{
    /// <inheritdoc />
    public partial class V1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Knjizara",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Naziv = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Adresa = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Telefon = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Slika = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Knjizara", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Korisnici",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ime = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Prezime = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Username = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Password = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Tip = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Korisnici", x => x.ID);
                });

            migrationBuilder.CreateTable(
                name: "Knjige",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ISBN = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Naslov = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Autor = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Izdavac = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Zanr = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Slika = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    GodinaIzdavanja = table.Column<int>(type: "int", nullable: false),
                    Cena = table.Column<double>(type: "float", nullable: false),
                    KnjizaraID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Knjige", x => x.ID);
                    table.ForeignKey(
                        name: "FK_Knjige_Knjizara_KnjizaraID",
                        column: x => x.KnjizaraID,
                        principalTable: "Knjizara",
                        principalColumn: "ID");
                });

            migrationBuilder.CreateTable(
                name: "RecenzijeKnjizare",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    KnjizaraID = table.Column<int>(type: "int", nullable: true),
                    Tekst = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Ocena = table.Column<long>(type: "bigint", nullable: false),
                    KorisnikID = table.Column<int>(type: "int", nullable: true)
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

            migrationBuilder.CreateTable(
                name: "RecenzijeKnjige",
                columns: table => new
                {
                    ID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    KnjigaID = table.Column<int>(type: "int", nullable: true),
                    Tekst = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Ocena = table.Column<long>(type: "bigint", nullable: false),
                    KorisnikID = table.Column<int>(type: "int", nullable: true)
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

            migrationBuilder.CreateIndex(
                name: "IX_Knjige_KnjizaraID",
                table: "Knjige",
                column: "KnjizaraID");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RecenzijeKnjige");

            migrationBuilder.DropTable(
                name: "RecenzijeKnjizare");

            migrationBuilder.DropTable(
                name: "Knjige");

            migrationBuilder.DropTable(
                name: "Korisnici");

            migrationBuilder.DropTable(
                name: "Knjizara");
        }
    }
}
