namespace Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class KnjigaController : ControllerBase
    {
        public EKnjizaraContext Context { get; set; }

        public KnjigaController(EKnjizaraContext context)
        {
            Context = context;
        }

        [HttpGet("PrikaziSveKnjige")]
        public async Task<ActionResult> PrikaziSveKnjige()
            => Ok(await Context.Knjige
                .ToListAsync());


        [HttpGet("Prikaziknjige/{knjizaraID}")]
        public async Task<ActionResult> PrikaziKnjige(int? knjizaraID)
        {
            if (knjizaraID == null) return BadRequest("Los unos Id-ja");
            var knjizara = await Context.Knjizara.FindAsync(knjizaraID);
            if (knjizara == null) return NotFound($"Knjizara sa ID-jem {knjizaraID} nije pronadjena!");

            var k = await Context.Knjige
                .Where(k => k.Knjizara!.ID == knjizaraID)
                .ToListAsync();
            
            if (k.Count == 0) return NotFound("Polica za knjige je prazna!");
            return Ok(k);
        }

        [HttpGet("PrikaziKnjigu/{knjigaID}")]
        public async Task<ActionResult> PrikaziKnjigu(int? knjigaID)
        {
            if (knjigaID == null) return BadRequest("Los unos Id-ja");
            var k = await Context.Knjige.FindAsync(knjigaID);
            if (k == null) return NotFound($"Knjiga sa ID-jem {knjigaID} nije pronadjena!");
            
            return Ok(await Context.Knjige
                .Where(k => k.ID == knjigaID)
                .SingleOrDefaultAsync()
            );
        }

        [HttpPost("UnesiKnjiu/{knjizaraID}")]
        public async Task<ActionResult> UnesiKnjigu([FromBody]Knjiga k, int knjizaraID, int korisnikID)
        {
            try
            {
                var knjizara = await Context.Knjizara.FindAsync(knjizaraID);
                if (knjizara == null) return NotFound($"Knjizara sa ID-jem {knjizaraID} nije pronadjena!");
                var user = await Context.Korisnici.FindAsync(korisnikID);
                if (user == null) return NotFound($"Korisnik sa ID-jem {korisnikID} nije pronadjen!");

                if (user.Tip == "Admin")
                {
                    if (!string.IsNullOrWhiteSpace(k.Naslov) 
                    && !string.IsNullOrWhiteSpace(k.ISBN) 
                    && k.Cena >= 0 
                    && !string.IsNullOrWhiteSpace(k.Zanr) 
                    && !string.IsNullOrWhiteSpace(k.Izdavac) 
                    && !string.IsNullOrWhiteSpace(k.Autor) 
                    && k.GodinaIzdavanja>=1800)
                    {
                        k.Knjizara = knjizara;

                        await Context.Knjige.AddAsync(k);
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
                    return Unauthorized("Ne mozete uneti knjigu!");
                }
            }
            catch (Exception ex)
            {
                return BadRequest("Greska: " + ex.Message);
            }
        }

        [HttpPut("IzmeniKnjigu/{knjigaID}")]
        public async Task<ActionResult> IzmeniKnjigu([FromBody]Knjiga k, int knjigaID, int korisnikID)
        {
            try
            {
                var v = await Context.Knjige.FindAsync(knjigaID);
                if (v == null) return NotFound($"Knjiga sa ID-jem {knjigaID} nije pronadjena!");
                var user = await Context.Korisnici.FindAsync(korisnikID);
                if (user == null) return NotFound($"Korisnik sa ID-jem {korisnikID} nije pronadjen!");

                if (user.Tip == "Admin")
                {
                    if (!string.IsNullOrWhiteSpace(k.Naslov) 
                    && !string.IsNullOrWhiteSpace(k.ISBN) 
                    && k.Cena >= 0 
                    && !string.IsNullOrWhiteSpace(k.Zanr) 
                    && !string.IsNullOrWhiteSpace(k.Izdavac) 
                    && !string.IsNullOrWhiteSpace(k.Autor) 
                    && k.GodinaIzdavanja>=1800)
                    {
                        v.Naslov = k.Naslov;
                        v.ISBN = k.ISBN;
                        v.Cena = k.Cena;
                        v.Slika = k.Slika;
                        v.Zanr = k.Zanr;
                        v.Autor = k.Autor;
                        v.GodinaIzdavanja = k.GodinaIzdavanja;
                        v.Izdavac = k.Izdavac;

                        Context.Knjige.Update(v);
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
                    return Unauthorized("Ne mozete izmeniti knjigu!");
                }
            }
            catch (Exception ex)
            {
                return BadRequest("Greska: " + ex.Message);
            }
        }
        
        [HttpDelete("ObrisiKnjigu/{knjigaID}")]
        public async Task<ActionResult> ObrisiKnjigu(int knjigaID, int korisnikID)
        {
            try
            {
                var k = await Context.Knjige
                    .Where(h => h.ID == knjigaID)
                    .SingleOrDefaultAsync();
                if (k == null) return NotFound($"Knjiga sa ID-jem {knjigaID} nije pronadjena!");

                var user = await Context.Korisnici.FindAsync(korisnikID);
                if (user == null) return NotFound($"Korisnik sa ID-jem {korisnikID} nije pronadjen!");

                if (user.Tip == "Admin")
                {

                    Context.Knjige.Remove(k);
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