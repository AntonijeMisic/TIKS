namespace Models
{
    public class Knjiga
    {
        [Key]
        public int ID { get; set; }
        public required string ISBN { get; set; }
        public required string Naslov { get; set; }
        public required string Autor { get; set; }
        public required string Izdavac { get; set; }
        public required string Zanr { get; set; }
        public string? Slika { get; set; }
        public required int GodinaIzdavanja { get; set; }
        public required double Cena { get; set; } 

        [JsonIgnore]
        public Knjizara? Knjizara { get; set; }
    }
}