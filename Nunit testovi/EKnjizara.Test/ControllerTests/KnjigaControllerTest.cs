using Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;

namespace EKnjizara.Test;

public class KnjigaControllerTest
{
    public EKnjizaraContext Context { get; set; }
    public KnjigaController KnjigaController { get; set; }
    public static string connectionString = "Server=(localdb)\\eKnjizara;Database=eKnjizara";

    [SetUp]
    public void SetUp()
    {
        //koristio sam posebnu bazu za testiranje sajta
        var optionsBuilder = new DbContextOptionsBuilder().UseSqlServer(connectionString);
        Context = new EKnjizaraContext(optionsBuilder.Options);

        KnjigaController = new KnjigaController(Context);
    }

    #region PrikaziKnjiguByIDTest

    [Test]
    [TestCase(1)]
    public async Task PrikaziKnjiguById_Return_OkResult(int knjigaId)
    {

        //Act  
        var data = await KnjigaController.PrikaziKnjigu(knjigaId);
        var result = data as OkObjectResult;

        //Assert
        if (result is OkObjectResult)
        {
            Assert.NotNull(result.Value);
            var book = result.Value as Knjiga;
            Console.WriteLine($"Nadjena je knjiga: {book.Naslov}");
            Assert.Pass();
        }
        else
        {
            Console.WriteLine("Nije nadjena trazena knjiga");
            Assert.Fail();
        }
    }
    [Test]
    [TestCase(2)]
    public async Task PrikaziKnjiguById_Return_NotFoundResult(int knjigaId)
    {

        //Act  
        var data = await KnjigaController.PrikaziKnjigu(knjigaId);
        var result = data as NotFoundObjectResult;

        //Assert
        if (result is NotFoundObjectResult)
        {

            Assert.That(result is NotFoundObjectResult, "I treba da izbaci NotFound u ovom testu");
            Console.WriteLine($"Nije nadjena knjiga sa id-jem: {knjigaId}");
            Assert.Pass();
        }
        else
        {
            Assert.Fail();
        }
    }
    [Test]
    public async Task PrikaziKnjiguById_Return_BadRequest()
    {
        //Arrange  
        int? knjigaId = null;

        //Act  
        var data = await KnjigaController.PrikaziKnjigu(knjigaId);
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
    #region PrikaziKnjigeByKnjizaraIdTest
    [Test]
    [TestCase(1)]
    public async Task PrikaziKnjigeByKnjizaraId_Return_OkResult(int knjizaraId)
    {

        //Act  
        var data = await KnjigaController.PrikaziKnjige(knjizaraId);
        var result = data as OkObjectResult;

        //Assert
        if (result is OkObjectResult)
        {
            var knjige = result.Value as IEnumerable<Knjiga>;
            //var book = result.Value as Knjiga;
            Assert.NotNull(knjige);
            Assert.True(knjige.Count() > 0, "Treba da postoji barem jedna knjiga!");
            Console.WriteLine($"Nadjene su knjige");
            Assert.Pass();
        }
        else
        {
            Console.WriteLine("Nisu nadjene knjige");
            Assert.Fail();
        }
    }
    [Test]
    [TestCase(3)] //slucaj kada knjizara nije nadjena
    [TestCase(2)] //slucaj kada je broj knjiga u knjizari 0 
    public async Task PrikaziKnjigeByKnjizaraId_Return_NotFoundResult(int knjizaraId)
    {

        //Act  
        var data = await KnjigaController.PrikaziKnjige(knjizaraId);
        var result = data as NotFoundObjectResult;

        //Assert
        if (result is NotFoundObjectResult)
        {

            Assert.That(result is NotFoundObjectResult, "I treba da izbaci NotFound u ovom testu");
            Console.WriteLine($"Nisu nadjene knjige");
            Assert.Pass();
        }
        else
        {
            Assert.Fail();
        }
    }
    [Test]
    public async Task PrikaziKnjigeByKnjizaraId_Return_BadRequest()
    {
        //Arrange  
        int? knjizaraId = null;

        //Act  
        var data = await KnjigaController.PrikaziKnjige(knjizaraId);
        var result = data as BadRequestObjectResult;

        //Assert
        if (result is BadRequestObjectResult)
        {
            Assert.That(result is BadRequestObjectResult, "I treba da izbaci BadRequest u ovom testu");
            Console.WriteLine($"Nisu nadjena knjige za knjizaru sa id-jem koji je null");
            Assert.Pass();
        }
        else
        {
            Assert.Fail();
        }
    }
    #endregion
    #region PrikaziSveKnjigeTest
    [Test]
    public async Task PrikaziSveKnjigeTest()
    {
        var result = await KnjigaController.PrikaziSveKnjige();

        if (result is OkObjectResult okResult)
        {
            var knjige = okResult.Value as IEnumerable<Knjiga>;

            Assert.True(knjige.Count() > 0, "Treba da postoji barem jedna knjiga!");
            Console.WriteLine("Postoje knjige");
        }
        else
        {
            Assert.Fail("PrikaziSveKnjige funkcija nije vratila OkObjectResult!");
        }
    }
    [Ignore("Ignorisan jer nema nacina da dobijemo NotFound za sad")]
    [Test]
    public async Task PrikaziSveKnjige_Returns_NotFound()
    {
        // Act
        var data = await KnjigaController.PrikaziSveKnjige();

        // Assert
        Assert.That(data, Is.TypeOf<NotFoundObjectResult>(), "U ovom slucaju je ocekivano da bude NotFound");
        Console.WriteLine("Nije nadjena nijedna knjiga u bazi.");
    }
    [Ignore("Ignorisan jer nema nacina da dobijemo BadRequest za sad")]
    [Test]
    public async Task PrikaziSveKnjige_Returns_BadRequest()
    {

        // Act
        var data = await KnjigaController.PrikaziSveKnjige();

        // Assert
        Assert.That(data, Is.TypeOf<BadRequestObjectResult>(), "U ovom slucaju je ocekivano da dobijemo BadRequest");
        Console.WriteLine("Bad Request");
    }
    #endregion
    #region UnesiKnjiguTest
    [Test]
    [TestCase(1, 1)] //knjizara u kojoj zelimo da unesemo knjigu i korisnik koji je admin
    public async Task UnesiKnjigu_Returns_Ok(int knjizaraId, int userID)
    {

        var knjiga = new Knjiga
        {
            Naslov = "Knjiga1",
            Autor = "Ja",
            Cena = 300,
            GodinaIzdavanja = 2024,
            ISBN = "ISBN neki",
            Izdavac = "Ja",
            Zanr = "Zabava",
            Slika = "string"
        };

        var result = await KnjigaController.UnesiKnjigu(knjiga, knjizaraId, userID);
        if (result is OkObjectResult okResult)
        {
            Assert.NotNull(okResult.Value);
            var book = okResult.Value as Knjiga;
            Console.WriteLine($"Dodata knjiga: {book.Naslov}");
            Assert.That(book.Naslov, Is.EqualTo("Knjiga1"));
            var dbKnjiga = await Context.Knjige.FindAsync(book.ID);
            Assert.NotNull(dbKnjiga);
        }
        else
        {
            Console.WriteLine($"Neuspešno dodavanje knjige. Rezultat: {result}");
            Assert.Fail();
        }
    }
    [Test]
    [TestCase(10, 1)] //knjizara koja nepostoji
    [TestCase(1, 10)] //korisnik koji nepostoji
    public async Task UnesiKnjigu_Returns_NotFound(int knjizaraId, int userID)
    {

        var knjiga = new Knjiga
        {
            Naslov = "Knjiga1",
            Autor = "Ja",
            Cena = 300,
            GodinaIzdavanja = 2024,
            ISBN = "ISBN neki",
            Izdavac = "Ja",
            Zanr = "Zabava",
            Slika = "string"
        };

        var result = await KnjigaController.UnesiKnjigu(knjiga, knjizaraId, userID);
        if (result is NotFoundObjectResult)
        {
            Assert.That(result is NotFoundObjectResult, "I treba da izbaci NotFound u ovom testu jer user ili knjizara ne postoji");
            Console.WriteLine($"Vratio je NotFound");
            Assert.Pass();
        }
        else
        {
            Console.WriteLine($"Neuspešno dodavanje knjige. Rezultat: {result}");
            Assert.Fail();
        }
    }
    [Test]
    [TestCase(1, 2)]
    public async Task UnesiKnjigu_Returns_UnauthorizedUser(int knjizaraId, int userID)
    {

        var knjiga = new Knjiga
        {
            Naslov = "Knjiga1",
            Autor = "Ja",
            Cena = 300,
            GodinaIzdavanja = 2024,
            ISBN = "ISBN neki",
            Izdavac = "Ja",
            Zanr = "Zabava",
            Slika = "string"
        };

        var result = await KnjigaController.UnesiKnjigu(knjiga, knjizaraId, userID);
        if (result is UnauthorizedObjectResult)
        {
            Assert.That(result is UnauthorizedObjectResult, "I treba da izbaci Unauthorized u ovom testu jer user nije Admin");
            Console.WriteLine($"User sa tim id-jem nije Admin");
            Assert.Pass();
        }
        else
        {
            Console.WriteLine($"Neuspešno dodavanje knjige. Rezultat: {result}");
            Assert.Fail();
        }
    }
    [Test]
    [TestCase(1, 1)]
    public async Task UnesiKnjigu_Returns_BadRequest(int knjizaraId, int userID)
    {

        var knjiga = new Knjiga
        {
            Naslov = String.Empty,
            Autor = "Ja",
            Cena = 300,
            GodinaIzdavanja = 2024,
            ISBN = "ISBN neki",
            Izdavac = "Ja",
            Zanr = "Zabava",
            Slika = "string"
        };

        var result = await KnjigaController.UnesiKnjigu(knjiga, knjizaraId, userID);
        if (result is BadRequestObjectResult)
        {
            Assert.That(result is BadRequestObjectResult, "I treba da izbaci BadRequest u ovom testu jer nije dobar unos");
            Console.WriteLine($"Los unos podataka");
            Assert.Pass();
        }
        else
        {
            Console.WriteLine($"Neuspešno dodavanje knjige. Rezultat: {result}");
            Assert.Fail();
        }
    }
    #endregion
    #region IzmeniKnjiguTest
    [Test]
    [TestCase(18, 1)]
    public async Task IzmeniKnjigu_Returns_Ok(int knjigaId, int userID)
    {

        var knjiga = new Knjiga
        {
            Naslov = "PunPUn",
            Autor = "Ja",
            Cena = 300,
            GodinaIzdavanja = 2024,
            ISBN = "ISBN neki",
            Izdavac = "Ja",
            Zanr = "Zabava",
            Slika = "string"
        };

        var result = await KnjigaController.IzmeniKnjigu(knjiga, knjigaId, userID);
        if (result is OkObjectResult okResult)
        {
            Assert.NotNull(okResult.Value);
            var book = okResult.Value as Knjiga;
            Console.WriteLine($"Izmenjena knjiga: {book.Naslov}");
            var dbKnjiga = await Context.Knjige.FindAsync(book.ID);
            Assert.NotNull(dbKnjiga);
        }
        else
        {
            Console.WriteLine($"Neuspešno menjanje knjige. Rezultat: {result}");
            Assert.Fail();
        }
    }
    [Test]
    [TestCase(10, 1)]
    [TestCase(2, 10)]
    public async Task IzmeniKnjigu_Returns_NotFound(int knjigaId, int userID)
    {
        var knjiga = new Knjiga
        {
            Naslov = "Knjiga1",
            Autor = "Ja",
            Cena = 300,
            GodinaIzdavanja = 2024,
            ISBN = "ISBN neki",
            Izdavac = "Ja",
            Zanr = "Zabava",
            Slika = "string"
        };

        var result = await KnjigaController.IzmeniKnjigu(knjiga, knjigaId, userID);
        if (result is NotFoundObjectResult okResult)
        {
            Assert.That(result is NotFoundObjectResult, "I treba da izbaci NotFound");
            Console.WriteLine($"Not found je vracen");
            Assert.Pass("Vracen je NotFound");
        }
        else
        {
            Console.WriteLine($"Neuspešno menjanje knjige. Rezultat: {result}");
            Assert.Fail("Nije vratio NotFound");
        }
    }
    [Test]
    [TestCase(1, 2)]
    public async Task IzmeniKnjigu_Returns_Unauthorized(int knjigaId, int userID)
    {
      

        var knjiga = new Knjiga
        {
            Naslov = "Knjiga1",
            Autor = "Ja",
            Cena = 300,
            GodinaIzdavanja = 2024,
            ISBN = "ISBN neki",
            Izdavac = "Ja",
            Zanr = "Zabava",
            Slika = "string"
        };

        var result = await KnjigaController.IzmeniKnjigu(knjiga, knjigaId, userID);
        if (result is UnauthorizedObjectResult)
        {
            Assert.That(result is UnauthorizedObjectResult, "I treba da izbaci Unauthorized");
            Console.WriteLine($"Korisnik nije Admin");
            Assert.Pass("Vracen je Unauthorized");
        }
        else
        {
            Console.WriteLine($"Neuspešno menjanje knjige. Rezultat: {result}");
            Assert.Fail("Nije vratio Unauthorized");
        }
    }
    [Test]
    [TestCase(4, 1)]
    public async Task IzmeniKnjigu_Returns_BadRequest(int knjigaId, int userID)
    {


       var knjiga = new Knjiga
        {
            Naslov = String.Empty,
            Autor = "Ja",
            Cena = 300,
            GodinaIzdavanja = 2024,
            ISBN = "ISBN neki",
            Izdavac = "Ja",
            Zanr = "Zabava",
            Slika = "string"
        };

        var result = await KnjigaController.IzmeniKnjigu(knjiga, knjigaId, userID);
        if (result is BadRequestObjectResult)
        {
            Assert.That(result is BadRequestObjectResult, "I treba da izbaci BadRequest");
            Console.WriteLine($"Uneti podaci nisu korektni");
            Assert.Pass("Vracen je BadRequest");
        }
        else
        {
            Console.WriteLine($"Neuspešno menjanje knjige. Rezultat: {result}");
            Assert.Fail("Nije vratio BadRequest");
        }
    }
    #endregion
    #region ObrisiKnjiguTest
    [Test]
    [TestCase(18, 1)]
    public async Task ObrisiKnjigu_Returns_Ok(int knjigaId, int userID)
    {

        var result = await KnjigaController.ObrisiKnjigu(knjigaId, userID);
        if (result is OkObjectResult okResult)
        {
            Assert.That(result is OkObjectResult, "Izbacen je OK");
            Console.WriteLine($"Knjiga je izbrisana");
            Assert.Pass("Vracen je OK");
        }
        else
        {
            Console.WriteLine($"Neuspešno brisanje knjige. Rezultat: {result}");
            Assert.Fail();
        }
    }
    [Test]
    [TestCase(18, 1)] //id knjige koji nije nadjen
    [TestCase(4, 10)] //id korisnika koji nije nadjen
    public async Task ObrisiKnjigu_Returns_NotFound(int knjigaId, int userID)
    {
        var result = await KnjigaController.ObrisiKnjigu(knjigaId, userID);
        if (result is NotFoundObjectResult)
        {
            Assert.That(result is NotFoundObjectResult, "I treba da izbaci NotFound");
            Console.WriteLine($"Not found je vracen");
            Assert.Pass("Vracen je NotFound");
        }
        else
        {
            Console.WriteLine($"Neuspešno brisanje knjige. Rezultat: {result}");
            Assert.Fail("Nije vratio NotFound");
        }
    }
    [Test]
    [TestCase(4, 2)]
    public async Task ObrisiKnjigu_Returns_Unauthorized(int knjigaId, int userID)
    {

        var result = await KnjigaController.ObrisiKnjigu(knjigaId, userID);
        if (result is UnauthorizedObjectResult)
        {
            Assert.That(result is UnauthorizedObjectResult, "I treba da izbaci Unauthorized");
            Console.WriteLine($"Korisnik nije Admin");
            Assert.Pass("Vracen je Unauthorized");
        }
        else
        {
            Console.WriteLine($"Neuspešno brisanje knjige. Rezultat: {result}");
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
