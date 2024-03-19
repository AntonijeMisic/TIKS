namespace Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class KnjizaraController : ControllerBase
    {
        public EKnjizaraContext Context { get; set; }

        public KnjizaraController(EKnjizaraContext context)
        {
            Context = context;
        }

        [HttpGet("PrikaziSveKnjizare")]
        public async Task<ActionResult> PrikaziSveKnjizare()
        {
            try
            {
                var knjizare = await Context.Knjizara
                    .Include(r => r.Knjige!)
                    .ToListAsync();

                if (knjizare.Count == 0)
                {
                    return NotFound("Nema knjizara koje odgovaraju kriterijumima.");
                }

                return Ok(knjizare);
            }
            catch (Exception ex)
            {
                // Log the exception and handle it appropriately (e.g., return BadRequest)
                return BadRequest("Greška prilikom prikazivanja knjizara.");
            }
        }

        [HttpGet("PrikaziKnjizaru/{knjizaraID}")]
        public async Task<ActionResult> PrikaziKnjizaru(int? knjizaraID)
        {
            if (knjizaraID == null) return BadRequest("Los unos Id-ja");
            var k = await Context.Knjizara.FindAsync(knjizaraID);
            if (k == null) return NotFound($"Knjizara sa ID-jem {knjizaraID} nije pronadjena!");

            return Ok(await Context.Knjizara
                .Where(k => k.ID == knjizaraID)
                .Include(r => r.Knjige!)
                .SingleOrDefaultAsync()
            );
        }

        [HttpPost("UnesiKnjizaru")]
        public async Task<ActionResult> UnesiKnjizaru([FromBody] Knjizara k, int korisnikID)
        {
            try
            {
                var user = await Context.Korisnici.FindAsync(korisnikID);
                if (user == null) return NotFound($"Korisnik sa ID-jem {korisnikID} nije pronadjen!");

                if (user.Tip == "Admin")
                {
                    if (!string.IsNullOrWhiteSpace(k.Naziv)
                    && !string.IsNullOrWhiteSpace(k.Adresa)
                    && !string.IsNullOrWhiteSpace(k.Telefon)
                    && !string.IsNullOrWhiteSpace(k.Email))
                    {
                        await Context.Knjizara.AddAsync(k);
                        await Context.SaveChangesAsync();
                        return Ok(k);
                    }
                    else
                    {
                        throw new Exception("Neispravan unos!");
                    }
                }
                else
                {
                    return Unauthorized("Ne mozete uneti knjizaru!");
                }

            }
            catch (Exception ex)
            {
                return BadRequest("Greska: " + ex.Message);
            }
        }

        [HttpPut("IzmeniKnjizaru/{knjizaraID}")]
        public async Task<ActionResult> IzmeniKnjizaru([FromBody] Knjizara k, int knjizaraID, int korisnikID)
        {
            try
            {
                var v = await Context.Knjizara.FindAsync(knjizaraID);
                if (v == null) return NotFound($"Knjizara sa ID-jem {knjizaraID} nije pronadjena!");
                var user = await Context.Korisnici.FindAsync(korisnikID);
                if (user == null) return NotFound($"Korisnik sa ID-jem {korisnikID} nije pronadjen!");

                if (user.Tip == "Admin")
                {
                    if (!string.IsNullOrWhiteSpace(k.Naziv)
                    && !string.IsNullOrWhiteSpace(k.Adresa)
                    && !string.IsNullOrWhiteSpace(k.Telefon)
                    && !string.IsNullOrWhiteSpace(k.Email))
                    {
                        v.Naziv = k.Naziv;
                        v.Adresa = k.Adresa;
                        v.Telefon = k.Telefon;
                        v.Slika = k.Slika;
                        v.Email = k.Email;

                        Context.Knjizara.Update(v);
                        await Context.SaveChangesAsync();
                        return Ok(v);
                    }
                    else
                    {
                        throw new Exception("Neispravan unos!");
                    }
                }
                else
                {
                    return Unauthorized("Ne mozete uneti knjizaru!");
                }
            }
            catch (Exception ex)
            {
                return BadRequest("Greska: " + ex.Message);
            }
        }

        [HttpDelete("ObrisiKnjizaru/{knjizaraID}")]
        public async Task<ActionResult> ObrisiKnjizaru(int knjizaraID, int korisnikID)
        {
            var v = await Context.Knjizara.FindAsync(knjizaraID);
            if (v == null) return NotFound($"Knjizara sa ID-jem {knjizaraID} nije pronadjena!");
            var user = await Context.Korisnici.FindAsync(korisnikID);
            if (user == null) return NotFound($"Korisnik sa ID-jem {korisnikID} nije pronadjen!");

            try
            {
                if (user.Tip == "Admin")
                {
                    foreach (var knjiga in v.Knjige!)
                    {
                        Context.Knjige.Remove(knjiga);
                    }

                    Context.Knjizara.Remove(v);
                    await Context.SaveChangesAsync();
                    return Ok(v);
                }
                else
                {
                    return Unauthorized("Ne mozete izbrisati knjizaru!");
                }

            }
            catch (Exception ex)
            {
                return BadRequest("Greska: " + ex.Message);
            }
        }
    }
}