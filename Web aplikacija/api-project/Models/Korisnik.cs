namespace Models
{
    public class Korisnik
    {
        [Key]
        public int ID { get; set; }
        public string? Ime { get; set; }
        public string? Prezime { get; set; }
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? Tip { get; set; }
    }
}