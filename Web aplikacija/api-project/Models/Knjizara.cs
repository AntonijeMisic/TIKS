namespace Models
{
    public class Knjizara
    {
        [Key]
        public int ID { get; set; }
        public required string Naziv { get; set; }
        public required string Adresa { get; set; }
        public required string Telefon { get; set; }
        public required string Email { get; set; }
        public string? Slika { get; set; }
        public List<Knjiga>? Knjige { get; set; } = new List<Knjiga>();
    }
}