using Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;

namespace EKnjizara.Test;

public class KorisnikControllerTest
{
    public EKnjizaraContext Context { get; set; }
    public KorisnikController KorisnikController { get; set; }
    public static string connectionString = "Server=(localdb)\\eKnjizara;Database=eKnjizara";

    [SetUp]
    public void SetUp()
    {
        var optionsBuilder = new DbContextOptionsBuilder().UseSqlServer(connectionString);
        Context = new EKnjizaraContext(optionsBuilder.Options);

        KorisnikController = new KorisnikController(Context);
    }
    #region PrikaziKorisnikaByIDTest

    [Test]
    [TestCase(1)]
    public async Task PrikaziKorisnikaById_Return_OkResult(int korisnikid)
    {

        //Act  
        var data = await KorisnikController.PrikaziKorisnika(korisnikid);
        var result = data as OkObjectResult;

        //Assert
        if (result is OkObjectResult)
        {
            Assert.NotNull(result.Value);
            var user = result.Value as Korisnik;
            Console.WriteLine($"Nadjen je user: {user.Username}");
            Assert.Pass();
        }
        else
        {
            Console.WriteLine("Nije nadjen trazen korisnik");
            Assert.Fail();
        }
    }
    [Test]
    [TestCase(3)]
    public async Task PrikaziKorisnikaById_Return_NotFoundResult(int korisnikid)
    {

        //Act  
        var data = await KorisnikController.PrikaziKorisnika(korisnikid);
        var result = data as NotFoundObjectResult;

        //Assert
        if (result is NotFoundObjectResult)
        {

            Assert.That(result is NotFoundObjectResult, "I treba da izbaci NotFound u ovom testu");
            Console.WriteLine($"Nije nadjen korisnik sa id-jem: {korisnikid}");
            Assert.Pass();
        }
        else
        {
            Assert.Fail();
        }
    }
    [Test]
    public async Task PrikaziKorisnikaById_Return_BadRequest()
    {
        //Arrange  
        int? korisnikId = null;

        //Act  
        var data = await KorisnikController.PrikaziKorisnika(korisnikId);
        var result = data as BadRequestObjectResult;

        //Assert
        if (result is BadRequestObjectResult)
        {
            Assert.That(result is BadRequestObjectResult, "I treba da izbaci BadRequest u ovom testu");
            Console.WriteLine($"Nije nadjena knjiga sa id-jem koji je null");
            Assert.Pass();
        }
        else
        {
            Assert.Fail();
        }
    }
    #endregion
    #region PrikaziSveKorisnikeTest
    [Test]
    public async Task PrikaziSveKorisnikeTest()
    {
        var result = await KorisnikController.PrikaziSveKorisnike();

        if (result is OkObjectResult okResult)
        {
            var korisnici = okResult.Value as IEnumerable<Korisnik>;

            Assert.True(korisnici.Count() > 0, "Treba da postoji barem jedan korisnik!");
            Console.WriteLine("Postoje korisnici");
        }
        else
        {
            Assert.Fail("PrikaziSveKorisnike funkcija nije vratila OkObjectResult!");
        }
    }
    [Ignore("Ignorisan jer nema nacina da dobijemo NotFound za sad")]
    [Test]
    public async Task PrikaziSveKorisnike_Returns_NotFound()
    {
        // Act
        var data = await KorisnikController.PrikaziSveKorisnike();

        // Assert
        Assert.That(data, Is.TypeOf<NotFoundObjectResult>(), "U ovom slucaju je ocekivano da bude NotFound");
        Console.WriteLine("Nije nadjen nijedan korisnik u bazi.");
    }
    [Ignore("Ignorisan jer nema nacina da dobijemo BadRequest za sad")]
    [Test]
    public async Task PrikaziSveKorisnike_Returns_BadRequest()
    {

        // Act
        var data = await KorisnikController.PrikaziSveKorisnike();

        // Assert
        Assert.That(data, Is.TypeOf<BadRequestObjectResult>(), "U ovom slucaju je ocekivano da dobijemo BadRequest");
        Console.WriteLine("Bad Request");
    }
    #endregion
    #region RegistracijaTest
    [Test]
    public async Task Registracija_Returns_Ok()
    {

        var user = new Korisnik
        {
           Ime="Zoran",
           Prezime="Misic",
           Email="zoran67@gmail.com",
           Password="Antonije1",
           Tip="Korisnik",
           Username="Zoran67"
        };

        var result = await KorisnikController.Registracija(user);
        if (result is OkObjectResult okResult)
        {
            Assert.NotNull(okResult.Value);
            var u = okResult.Value as Korisnik;
            Console.WriteLine($"Registrovan korisnik: {u.Username}");
            var dbKorisnik = await Context.Korisnici.FindAsync(u.ID);
            Assert.NotNull(dbKorisnik);
        }
        else
        {
            Console.WriteLine($"Neuspešno registrovanje korisnik. Rezultat: {result}");
            Assert.Fail();
        }
    }
    [Test]
    public async Task Registracija_Returns_BadRequest()
    {

       var user = new Korisnik
        {
           Ime="Zoran",
           Prezime="Misic",
           Email="antonijemisic@gmail.com",
           Password="Antonije1",
           Tip="Korisnik",
           Username="Entoni"
        };

        var result = await KorisnikController.Registracija(user);
        if (result is BadRequestObjectResult)
        {
            Assert.That(result is BadRequestObjectResult, "I treba da izbaci BadRequest u ovom testu jer nije dobar unos");
            Console.WriteLine($"Los unos podataka");
            Assert.Pass();
        }
        else
        {
            Console.WriteLine($"Neuspešna registracija. Rezultat: {result}");
            Assert.Fail();
        }
    }
    #endregion
    #region AutentikacijaTest

    [Test]
    public async Task Autentikacija_Return_OkResult()
    {
        var user = new Korisnik
        {
           Ime="Antonije",
           Prezime="Misic",
           Email="antonijemisic@gmail.com",
           Password="Antonije1@",
           Tip="Admin",
           Username="Detonator"
        };


        //Act  
        var data = await KorisnikController.Autentikacija(user);
        var result = data as OkObjectResult;

        //Assert
        if (result is OkObjectResult)
        {
            Assert.NotNull(result.Value);
            var u = result.Value as Korisnik;
            Console.WriteLine($"Nadjen je user: {u.Username}");
            Assert.Pass();
        }
        else
        {
            Console.WriteLine("Neuspesna autentikacija");
            Assert.Fail();
        }
    }
    [Test]
    public async Task Autentikacija_Return_NotFoundResult()
    {
        var user = new Korisnik
        {
           Ime="Antonije",
           Prezime="Misic",
           Email="antonijemisic@gmail.com",
           Password="Antonije1@",
           Tip="Korisnik",
           Username="Entoni123" //username koji ne postoji
        };

        //Act  
        var data = await KorisnikController.Autentikacija(user);
        var result = data as NotFoundObjectResult;

        //Assert
        if (result is NotFoundObjectResult)
        {

            Assert.That(result is NotFoundObjectResult, "I treba da izbaci NotFound u ovom testu");
            Console.WriteLine($"Neuspesna autentikacija");
            Assert.Pass();
        }
        else
        {
            Assert.Fail();
        }
    }
    [Test]
    public async Task Autentikacija_Return_BadRequest()
    {
        //Arrange  
        var user = new Korisnik
        {
           Ime="Antonije",
           Prezime="Misic",
           Email="antonijemisic@gmail.com",
           Password="Antonije12356", //vraca BadRequest kada je pogresna lozinka
           Tip="Korisnik",
           Username="Detonator"
        };

        //Act  
        var data = await KorisnikController.Autentikacija(user);
        var result = data as BadRequestObjectResult;

        //Assert
        if (result is BadRequestObjectResult)
        {
            Assert.That(result is BadRequestObjectResult, "I treba da izbaci BadRequest u ovom testu");
            Console.WriteLine($"Neuspesna autentikacija");
            Assert.Pass();
        }
        else
        {
            Assert.Fail();
        }
    }
    #endregion
    #region IzmeniKorisnikaTest
    [Test]
    [TestCase(13)] //korisnik sa ovim id ce biti izbrisan kasnije tako da na to treba obratiti paznju
    public async Task IzmeniKorisnika_Returns_Ok(int userID)
    {
        var user = new Korisnik
        {
           Ime="Zoran",
           Prezime="Misic",
           Email="zoran67real@gmail.com",
           Password="Antonije1",
           Tip="Korisnik",
           Username="Zoran67Real"
        };

        var result = await KorisnikController.IzmeniKorisnika(userID, user);
        if (result is OkObjectResult okResult)
        {
            Assert.NotNull(okResult.Value);
            var u = okResult.Value as Korisnik;
            Console.WriteLine($"Izmenjen korisnik: {u.Username}");
            var dbKorisnik = await Context.Korisnici.FindAsync(u.ID);
            Assert.NotNull(dbKorisnik);
        }
        else
        {
            Console.WriteLine($"Neuspešno menjanje korisnika. Rezultat: {result}");
            Assert.Fail();
        }
    }
    [Test]
    [TestCase(10)] //korisnik ga nema u bazi
    public async Task IzmeniKorisnika_Returns_NotFound(int userID)
    {
        var user = new Korisnik
        {
           Ime="Antonije",
           Prezime="Misic",
           Email="antonije@gmail.com",
           Password="Antonije1",
           Tip="Korisnik",
           Username="Entoni"
        };

        var result = await KorisnikController.IzmeniKorisnika(userID, user);
        if (result is NotFoundObjectResult)
        {
            Assert.That(result is NotFoundObjectResult, "I treba da izbaci NotFound");
            Console.WriteLine($"Not found je vracen");
            Assert.Pass("Vracen je NotFound");
        }
        else
        {
            Console.WriteLine($"Neuspešno menjanje korisnika. Rezultat: {result}");
            Assert.Fail("Nije vratio NotFound");
        }
    }
    [Test]
    [TestCase(1)] 
    public async Task IzmeniKorisnika_Returns_BadRequest(int userID)
    {
        //var v = await Context.Knjizara.FindAsync(knjizaraId);

       var user = new Korisnik
        {
           Ime=String.Empty,
           Prezime=String.Empty,
           Email="antonije@gmail.com",
           Password="Antonije1",
           Tip="Korisnik",
           Username="Entoni"
        };


        var result = await KorisnikController.IzmeniKorisnika(userID, user);
        if (result is BadRequestObjectResult)
        {
            Assert.That(result is BadRequestObjectResult, "I treba da izbaci BadRequest");
            Console.WriteLine($"Uneti podaci nisu korektni");
            Assert.Pass("Vracen je BadRequest");
        }
        else
        {
            Console.WriteLine($"Neuspešno menjanje korisnika. Rezultat: {result}");
            Assert.Fail("Nije vratio BadRequest");
        }
    }
    #endregion
    #region ObrisiKorisnikaTest
    [Test]
    [TestCase(1, 13)] //prvi je korisnik koji  brise a drugi je  onaj koji se brise
    [TestCase(11, 11)] //e sad fazon je taj sto ce taj user kad se izvrsi prvi test case biti obrisan tako da ce morati neki drugi
    public async Task ObrisiKorisnika_Returns_Ok(int korisnikBriseId, int userID)
    {

        var result = await KorisnikController.ObrisiKorisnika(korisnikBriseId, userID);
        if (result is OkObjectResult)
        {
            Assert.That(result is OkObjectResult, "Izbacen je OK");
            Console.WriteLine($"Korisnik je izbrisan");
            Assert.Pass("Vracen je OK");
        }
        else
        {
            Console.WriteLine($"Neuspešno brisanje korisnika. Rezultat: {result}");
            Assert.Fail();
        }
    }
    [Test]
    [TestCase(1, 10)] //svakako id korisnika koji se brise ce biti not found jer nepostoji
    [TestCase(10, 10)]
    public async Task ObrisiKorisnika_Returns_NotFound(int korisnikBriseId, int userID)
    {

        var result = await KorisnikController.ObrisiKorisnika(korisnikBriseId, userID);
        if (result is NotFoundObjectResult)
        {
            Assert.That(result is NotFoundObjectResult, "I treba da izbaci NotFound");
            Console.WriteLine($"Not found je vracen");
            Assert.Pass("Vracen je NotFound");
        }
        else
        {
            Console.WriteLine($"Neuspešno brisanje korisnika. Rezultat: {result}");
            Assert.Fail("Nije vratio NotFound");
        }
    }
    [Test]
    [TestCase(2, 1)] //korisnik koji nije admin nece moci da brise
    public async Task ObrisiKorisnika_Returns_Unauthorized(int korisnikBriseId, int userID)
    {

        var result = await KorisnikController.ObrisiKorisnika(korisnikBriseId, userID);
        if (result is UnauthorizedObjectResult)
        {
            Assert.That(result is UnauthorizedObjectResult, "I treba da izbaci Unauthorized");
            Console.WriteLine($"Korisnik nema privilegiju brisanja");
            Assert.Pass("Vracen je Unauthorized");
        }
        else
        {
            Console.WriteLine($"Neuspešno brisanje korisnika. Rezultat: {result}");
            Assert.Fail("Nije vratio Unauthorized");
        }
    }
    #endregion
    
    [TearDown]
    public void Dispose()
    {
        Context?.Dispose();
    }
}
