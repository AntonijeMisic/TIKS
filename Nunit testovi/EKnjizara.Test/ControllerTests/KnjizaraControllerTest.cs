using NUnit.Framework;
using Controllers;
using Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.InMemory;
using FakeItEasy;
using Microsoft.AspNetCore.Mvc;

namespace EKnjizara.Test;
public class KnjizaraControllerTest
{
    public EKnjizaraContext Context { get; set; }
    public KnjizaraController KnjizaraController { get; set; }
    public static string connectionString = "Server=(localdb)\\eKnjizara;Database=eKnjizara";

    [SetUp]
    public void SetUp()
    {
        var optionsBuilder = new DbContextOptionsBuilder().UseSqlServer(connectionString);
        Context = new EKnjizaraContext(optionsBuilder.Options);

        KnjizaraController = new KnjizaraController(Context);
    }

    #region PrikaziKnjizaruTest
    [Test]
    [TestCase(2)]
    public async Task PrikaziKnjizaryById_Return_OkResult(int knjizaraId)
    {
        //Arrange  

        //Act  
        var data = await KnjizaraController.PrikaziKnjizaru(knjizaraId);
        var result = data as OkObjectResult;

        //Assert
        if (result is OkObjectResult)
        {
            Assert.NotNull(result.Value);
            var bookstore = result.Value as Knjizara;
            Console.WriteLine($"Nadjena je knjizara: {bookstore.Naziv}");
            Assert.Pass();
        }
        else
        {
            Console.WriteLine("Nije nadjena trazena knjizara");
            Assert.Fail();
        }
    }
    [Test]
    [TestCase(3)]
    public async Task PrikaziKnjizaryById_Return_NotFoundResult(int knjizaraId)
    {

        //Act  
        var data = await KnjizaraController.PrikaziKnjizaru(knjizaraId);
        var result = data as NotFoundObjectResult;

        //Assert
        if (result is NotFoundObjectResult)
        {

            Assert.That(result is NotFoundObjectResult, "I treba da izbaci NotFound u ovom testu");
            Console.WriteLine($"Nije nadjena knjizara sa id-jem: {knjizaraId}");
            Assert.Pass();
        }
        else
        {
            Assert.Fail();
        }
    }
    [Test]
    public async Task PrikaziKnjizaryById_Return_BadRequest()
    {
        //Arrange  
        int? knjizaraId = null;

        //Act  
        var data = await KnjizaraController.PrikaziKnjizaru(knjizaraId);
        var result = data as BadRequestObjectResult;

        //Assert
        if (result is BadRequestObjectResult)
        {
            Assert.That(result is BadRequestObjectResult, "I treba da izbaci BadRequest u ovom testu");
            Console.WriteLine($"Nije nadjena knjizara sa id-jem koji je null");
            Assert.Pass();
        }
        else
        {
            Assert.Fail();
        }
    }

    #endregion
    #region PrikaziSveKnjizareTest
    [Test]
    public async Task PrikaziSveKnjizareTest()
    {
        var result = await KnjizaraController.PrikaziSveKnjizare();

        if (result is OkObjectResult okResult)
        {
            var knjiizare = okResult.Value as IEnumerable<Knjizara>;

            Assert.True(knjiizare.Count() > 0, "Treba da postoji barem jedna knjižara!");

            // Proverite da li su uključene Recenzije i Knjige
            foreach (var knjižara in knjiizare)
            {
                Assert.NotNull(knjižara.Knjige);
            }
        }
        else
        {
            Assert.Fail("PrikaziSveKnjizare funkcija nije vratila OkObjectResult!");
        }
    }
    [Ignore("Ignorisan jer nema nacina da dobijemo NotFound za sad")]
    [Test]
    public async Task PrikaziSveKnjizare_Returns_NotFound()
    {

        // Act
        var data = await KnjizaraController.PrikaziSveKnjizare();

        // Assert
        Assert.That(data, Is.TypeOf<NotFoundObjectResult>(), "U ovom slucaju je ocekivano da bude NotFound");
        Console.WriteLine("Nije nadjena nijedna knjizara u bazi.");
    }
    [Ignore("Ignorisan jer nema nacina da dobijemo BadRequest za sad")]
    [Test]
    public async Task PrikaziSveKnjizare_Returns_BadRequest()
    {

        // Act
        var data = await KnjizaraController.PrikaziSveKnjizare();

        // Assert
        Assert.That(data, Is.TypeOf<BadRequestObjectResult>(), "U ovom slucaju je ocekivano da dobijemo BadRequest");
        Console.WriteLine("Bad Request");
    }
    #endregion
    #region UnesiKnjizaruTest
    [Test]
    [TestCase(1)] //korisnik mora biti admin
    public async Task UnesiKnjizaru_Returns_Ok(int userID)
    {

        var knjizara = new Knjizara
        {
            Naziv = "Lagunica",
            Adresa = "delta",
            Email = "lagunica@gmail.com",
            Telefon = "0616512593",
            Knjige = [],
            Slika = "string"
        };

        var result = await KnjizaraController.UnesiKnjizaru(knjizara, userID);
        if (result is OkObjectResult okResult)
        {
            Assert.NotNull(okResult.Value);
            var bookstore = okResult.Value as Knjizara;
            Console.WriteLine($"Dodata knjizara: {bookstore.Naziv}");
            Assert.That(knjizara!.Naziv, Is.EqualTo("Lagunica"));
            var dbKnjizara = await Context.Knjizara.FindAsync(bookstore.ID);
            Assert.NotNull(dbKnjizara);
        }
        else
        {
            Console.WriteLine($"Neuspešno dodavanje knjižare. Rezultat: {result}");
            Assert.Fail();
        }
    }
    [Test]
    [TestCase(3)]
    public async Task UnesiKnjizaru_Returns_NotFoundUser(int userID)
    {

        var knjizara = new Knjizara
        {
            Naziv = "Lagunica",
            Adresa = "delta",
            Email = "lagunica@gmail.com",
            Telefon = "0616512593",
            Knjige = [],
            Slika = "string"
        };

        var result = await KnjizaraController.UnesiKnjizaru(knjizara, userID);
        if (result is NotFoundObjectResult)
        {
            Assert.That(result is NotFoundObjectResult, "I treba da izbaci NotFound u ovom testu jer user ne postoji");
            Console.WriteLine($"User sa tim id-jem ne postoji");
            Assert.Pass();
        }
        else
        {
            Console.WriteLine($"Neuspešno dodavanje knjižare. Rezultat: {result}");
            Assert.Fail();
        }
    }
    [Test]
    [TestCase(2)]
    public async Task UnesiKnjizaru_Returns_UnauthorizedUser(int userID)
    {

        var knjizara = new Knjizara
        {
            Naziv = "Lagunica",
            Adresa = "delta",
            Email = "lagunica@gmail.com",
            Telefon = "0616512593",
            Knjige = [],
            Slika = "string"
        };

        var result = await KnjizaraController.UnesiKnjizaru(knjizara, userID);
        if (result is UnauthorizedObjectResult)
        {
            Assert.That(result is UnauthorizedObjectResult, "I treba da izbaci Unauthorized u ovom testu jer user nije Admin");
            Console.WriteLine($"User sa tim id-jem nije Admin");
            Assert.Pass();
        }
        else
        {
            Console.WriteLine($"Neuspešno dodavanje knjižare. Rezultat: {result}");
            Assert.Fail();
        }
    }
    [Test]
    [TestCase(1)]
    public async Task UnesiKnjizaru_Returns_BadRequest(int userID)
    {

        var knjizara = new Knjizara
        {
            Naziv = String.Empty,
            Adresa = String.Empty,
            Email = String.Empty,
            Telefon = "0616512593",
            Knjige = [],
            Slika = "string"
        };

        var result = await KnjizaraController.UnesiKnjizaru(knjizara, userID);
        if (result is BadRequestObjectResult)
        {
            Assert.That(result is BadRequestObjectResult, "I treba da izbaci BadRequest u ovom testu jer user nije dobar unos");
            Console.WriteLine($"Los unos podataka");
            Assert.Pass();
        }
        else
        {
            Console.WriteLine($"Neuspešno dodavanje knjižare. Rezultat: {result}");
            Assert.Fail();
        }
    }
    #endregion
    #region IzmeniKnjizaruTest
    [Test]
    [TestCase(24, 1)] //id je onaj id koji ima uneta knjizara tokom tog testa a posle ce biti izbrisana
    public async Task IzmeniKnjizaru_Returns_Ok(int knjizaraId, int userID)
    {

        var knjizara = new Knjizara
        {
            Naziv = "Knjizarica",
            Adresa = "Delta",
            Email = "knjizarica@gmail.com",
            Telefon = "0616512593",
            Knjige = [],
            Slika = "string"
        };

        var result = await KnjizaraController.IzmeniKnjizaru(knjizara, knjizaraId, userID);
        if (result is OkObjectResult okResult)
        {
            Assert.NotNull(okResult.Value);
            var bookstore = okResult.Value as Knjizara;
            Console.WriteLine($"Izmenjena knjizara: {bookstore.Naziv}");
            //Assert.That(knjizara!.Naziv, Is.EqualTo("Lagunica"));
            var dbKnjizara = await Context.Knjizara.FindAsync(bookstore.ID);
            Assert.NotNull(dbKnjizara);
        }
        else
        {
            Console.WriteLine($"Neuspešno menjanje knjižare. Rezultat: {result}");
            Assert.Fail();
        }
    }
    [Test]
    [TestCase(3, 1)] //ovo je za knjizaru koja nepostoji
    [TestCase(4, 3)] //ovo je za usera koji nepostoji
    public async Task IzmeniKnjizaru_Returns_NotFound(int knjizaraId, int userID)
    {

        var knjizara = new Knjizara
        {
            Naziv = "Lagunica",
            Adresa = "Delta",
            Email = "lagunica@gmail.com",
            Telefon = "0616512593",
            Knjige = [],
            Slika = "string"
        };

        var result = await KnjizaraController.IzmeniKnjizaru(knjizara, knjizaraId, userID);
        if (result is NotFoundObjectResult okResult)
        {
            Assert.That(result is NotFoundObjectResult, "I treba da izbaci NotFound");
            Console.WriteLine($"Not found je vracen");
            Assert.Pass("Vracen je NotFound");
        }
        else
        {
            Console.WriteLine($"Neuspešno menjanje knjižare. Rezultat: {result}");
            Assert.Fail("Nije vratio NotFound");
        }
    }
    [Test]
    [TestCase(4, 2)] //user koji nije admin
    public async Task IzmeniKnjizaru_Returns_Unauthorized(int knjizaraId, int userID)
    {

        var knjizara = new Knjizara
        {
            Naziv = "Lagunica",
            Adresa = "Delta",
            Email = "lagunica@gmail.com",
            Telefon = "0616512593",
            Knjige = [],
            Slika = "string"
        };

        var result = await KnjizaraController.IzmeniKnjizaru(knjizara, knjizaraId, userID);
        if (result is UnauthorizedObjectResult)
        {
            Assert.That(result is UnauthorizedObjectResult, "I treba da izbaci Unauthorized");
            Console.WriteLine($"Korisnik nije Admin");
            Assert.Pass("Vracen je Unauthorized");
        }
        else
        {
            Console.WriteLine($"Neuspešno menjanje knjižare. Rezultat: {result}");
            Assert.Fail("Nije vratio Unauthorized");
        }
    }
    [Test]
    [TestCase(4, 1)]
    public async Task IzmeniKnjizaru_Returns_BadRequest(int knjizaraId, int userID)
    {

        var knjizara = new Knjizara
        {
            Naziv = String.Empty,
            Adresa = "Delta",
            Email = "lagunica@gmail.com",
            Telefon = "0616512593",
            Knjige = [],
            Slika = "string"
        };

        var result = await KnjizaraController.IzmeniKnjizaru(knjizara, knjizaraId, userID);
        if (result is BadRequestObjectResult)
        {
            Assert.That(result is BadRequestObjectResult, "I treba da izbaci BadRequest");
            Console.WriteLine($"Uneti podaci nisu korektni");
            Assert.Pass("Vracen je BadRequest");
        }
        else
        {
            Console.WriteLine($"Neuspešno menjanje knjižare. Rezultat: {result}");
            Assert.Fail("Nije vratio BadRequest");
        }
    }
    #endregion
    #region ObrisiKnjizaruTest
    [Test]
    [TestCase(24, 1)] //id knjizare koju brisemo se menja 
    public async Task ObrisiKnjizaru_Returns_Ok(int knjizaraId, int userID)
    {

        var result = await KnjizaraController.ObrisiKnjizaru(knjizaraId, userID);
        if (result is OkObjectResult okResult)
        {
            Assert.That(result is OkObjectResult, "Izbacen je OK");
            Console.WriteLine($"Knjizara je izbrisana");
            Assert.Pass("Vracen je OK");
        }
        else
        {
            Console.WriteLine($"Neuspešno brisanje knjižare. Rezultat: {result}");
            Assert.Fail();
        }
    }
    [Test]
    [TestCase(3, 1)]
    [TestCase(4, 3)]
    public async Task ObrisiKnjizaru_Returns_NotFound(int knjizaraId, int userID)
    {
        var result = await KnjizaraController.ObrisiKnjizaru(knjizaraId, userID);
        if (result is NotFoundObjectResult okResult)
        {
            Assert.That(result is NotFoundObjectResult, "I treba da izbaci NotFound");
            Console.WriteLine($"Not found je vracen");
            Assert.Pass("Vracen je NotFound");
        }
        else
        {
            Console.WriteLine($"Neuspešno brisanje knjižare. Rezultat: {result}");
            Assert.Fail("Nije vratio NotFound");
        }
    }
    [Test]
    [TestCase(4, 2)]
    public async Task ObrisiKnjizaru_Returns_Unauthorized(int knjizaraId, int userID)
    {

        var result = await KnjizaraController.ObrisiKnjizaru(knjizaraId, userID);
        if (result is UnauthorizedObjectResult)
        {
            Assert.That(result is UnauthorizedObjectResult, "I treba da izbaci Unauthorized");
            Console.WriteLine($"Korisnik nije Admin");
            Assert.Pass("Vracen je Unauthorized");
        }
        else
        {
            Console.WriteLine($"Neuspešno brisanje knjižare. Rezultat: {result}");
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
