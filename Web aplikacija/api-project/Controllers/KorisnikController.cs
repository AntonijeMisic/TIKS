

namespace Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class KorisnikController : ControllerBase
    {
        public EKnjizaraContext Context { get; set; }

        public KorisnikController(EKnjizaraContext context)
        {
            Context = context;
        }

        [HttpGet("PrikaziSveKorisnike")]
        public async Task<ActionResult> PrikaziSveKorisnike()
            => Ok(await Context.Korisnici.ToListAsync());

        [HttpGet("PrikaziKorisnika/{korisnikID}")]
        public async Task<ActionResult> PrikaziKorisnika(int? korisnikID)
        {
            if(korisnikID == null) return BadRequest("Los unos id-ja");
            var k = await Context.Korisnici.FindAsync(korisnikID);
            if (k == null) return NotFound($"Korisnik sa ID-jem {korisnikID} nije pronadjen!");

            return Ok(await Context.Korisnici
                .Where(k => k.ID == korisnikID)
                .SingleOrDefaultAsync()
            );
        }

         [HttpPost("Registracija")]
        public async Task<ActionResult> Registracija([FromBody]Korisnik k)
        {
            try
            {
                var u = await Context.Korisnici
                    .Where(h => h.Username == k.Username || h.Email ==k.Email)
                    .SingleOrDefaultAsync();
                if (u!=null)
                    throw new Exception("Korisnik vec postoji!");


                var pass = CheckPasswordStrength(k.Password!);
                if (!string.IsNullOrEmpty(pass))
                    throw new Exception(pass);

                k.Password = k.Password!;
                k.Tip = "Korisnik";

                await Context.Korisnici.AddAsync(k);
                await Context.SaveChangesAsync();
                return Ok(k);
            }
            catch (Exception ex)
            {
                return BadRequest("Greska: " + ex.Message);
            }
        }
        [HttpPost("Autentikacija")]
        public async Task<ActionResult> Autentikacija([FromBody]Korisnik k)
        {
            try
            {
                var korisnik = await Context.Korisnici
                    .FirstOrDefaultAsync(x => x.Username == k.Username);
                if (korisnik == null) return NotFound("Korisnik nije pronadjen!");

                if (k.Password!=korisnik.Password)
                {
                    return BadRequest("Pogresna lozinka!");
                }

                return Ok(korisnik);
            }
            catch (Exception ex)
            {
                return BadRequest("Greska: " + ex.Message);
            }
        }
        private string CheckPasswordStrength(string password)
        {
            StringBuilder sb = new StringBuilder();
            if (password.Length < 8)
            {
                sb.Append("Sifra mora imati bar 8 karaktera!" + Environment.NewLine);
            }
            if (!(Regex.IsMatch(password, "[a-z]") && Regex.IsMatch(password, "[A-Z]") && Regex.IsMatch(password, "[0-9]")))
            {
                sb.Append("Sifra mora imati mala i velika slova i brojeve!" + Environment.NewLine);
            }
            return sb.ToString();
        }

        [HttpPut("IzmeniKorisnika/{korisnikID}")]
        public async Task<ActionResult> IzmeniKorisnika(int korisnikID, [FromBody]Korisnik k)
        {
            try
            {
                var user = await Context.Korisnici.FindAsync(korisnikID);
                if (user == null) return NotFound($"Korisnik sa ID-jem {korisnikID} nije pronadjen!");

                if (!string.IsNullOrWhiteSpace(k.Ime) && 
                    !string.IsNullOrWhiteSpace(k.Prezime) && 
                    !string.IsNullOrWhiteSpace(k.Email) && 
                    !string.IsNullOrWhiteSpace(k.Username) && 
                    !string.IsNullOrWhiteSpace(k.Password)
                )
                {
                    user.Ime = k.Ime;
                    user.Prezime = k.Prezime;
                    user.Email = k.Email;
                    user.Username = k.Username;
                    user.Password = k.Password!;

                    Context.Korisnici.Update(user);
                    await Context.SaveChangesAsync();
                    return Ok(user);
                }
                else
                {
                    throw new Exception("Neispravan unos!");
                }
            }
            catch (Exception ex)
            {
                return BadRequest("Greska: " + ex.Message);
            }
        }
        [HttpDelete("ObrisiKorisnika/{korisnikID}")]
        public async Task<ActionResult> ObrisiKorisnika(int korisnikID, int userID) //prvi koji brise drugi koji se brise
        {
            try
            {
                var user = await Context.Korisnici.FindAsync(korisnikID);
                if (user == null) return NotFound($"Korisnik sa ID-jem {korisnikID} nije pronadjen!");
                var k = await Context.Korisnici.FindAsync(userID);
                if (k == null) return NotFound($"Korisnik sa ID-jem {userID} nije pronadjen!"); 

                if(userID == korisnikID || user.Tip == "Admin")
                {
                    Context.Korisnici.Remove(k);
                    await Context.SaveChangesAsync();
                    return Ok(k);
                }
                else
                {
                    return Unauthorized("Ne mozete obrisati knjigu!");
                }
            }
            catch (Exception ex)
            {
                return BadRequest("Greska: " + ex.Message);
            }
        }
    }
}