namespace Models
{
    public class EKnjizaraContext : DbContext
    {
        public  DbSet<Korisnik> Korisnici { get; set; }
        public  DbSet<Knjiga> Knjige { get; set; }
        public  DbSet<Knjizara> Knjizara { get; set; }

        public EKnjizaraContext(DbContextOptions options) : base(options)
        {
            
        }
    }
}