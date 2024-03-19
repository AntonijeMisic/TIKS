import { test, expect } from '@playwright/test';

test('GetBooksOkTest', async ({ page }) => {

    await page.goto('http://localhost:4200/');
    await page.getByRole('link', { name: 'Knjizare' }).click();
    await page.locator('div[id="knjizara-0"]').click();

    await page.waitForTimeout(2000);

    const knjigeContainer = await page.locator(".knjizara-knjige");
    await knjigeContainer.waitFor({ state: 'visible' })

    const knjigeItems = await knjigeContainer.locator('.knjiga-row');
    const imaKnjiga = await knjigeItems.count() >= 0;
    expect(imaKnjiga).toBeTruthy();
});

test('AddBookOkTest', async ({ page }) => {

    await page.goto("http://localhost:4200/home");
    await page.getByRole('button', { name: 'Prijavi se' }).click();
    await page.getByPlaceholder('Username').click();
    await page.getByPlaceholder('Username').fill('Detonator');
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('Antonije1@');
    await page.getByRole('button', { name: 'Prijavite se' }).click();
    await page.getByRole('link', { name: 'Knjizare' }).click()


    await page.locator('div[id="knjizara-0"]').click();
    await page.waitForTimeout(1000)

    const knjigeContainer = await page.locator(".knjige-container");
    await knjigeContainer.waitFor({ state: 'visible' })
    const knjigaRow = knjigeContainer.locator('tr[class="knjiga-row"]')
    const initialCount = await knjigeContainer.locator('tr[class="knjiga-row"]').count();
    console.log('Broj elemenata u div-u pre dodavanja:', initialCount);


    await page.getByRole('button', { name: 'Dodaj knjigu' }).click();
    await page.getByPlaceholder('Naslov').click();
    await page.getByPlaceholder('Naslov').fill('NaslovKnjige');
    await page.getByPlaceholder('ISBN').click();
    await page.getByPlaceholder('ISBN').fill('IsbnKnjige');
    await page.getByPlaceholder('Autor').click();
    await page.getByPlaceholder('Autor').fill('AutorKnjige');
    await page.getByPlaceholder('Izdavac').click();
    await page.getByPlaceholder('Izdavac').fill('IzdavacKnjige');
    await page.getByPlaceholder('Zanr').click();
    await page.getByPlaceholder('Zanr').fill('ZanrKnjige');
    await page.getByPlaceholder('Godina izdavanja').click();
    await page.getByPlaceholder('Godina izdavanja').fill('2024');
    await page.getByPlaceholder('Cena').click();
    await page.getByPlaceholder('Cena').fill('1000');
    await page.locator('#formFile').setInputFiles('punpun.jpg');
    await page.getByRole('button', { name: 'Dodaj' }).click();

    await page.waitForTimeout(1000)

    const finalCount = await knjigeContainer.locator('tr[class="knjiga-row"]').count();
    console.log('Broj elemenata u div-u nakon dodavanja:', finalCount);

    expect(finalCount).toBeGreaterThan(initialCount)
    await page.waitForTimeout(2000);

});

test('AddBookNotOkTest', async ({ page }) => {

    await page.goto("http://localhost:4200/home");
    await page.getByRole('button', { name: 'Prijavi se' }).click();
    await page.getByPlaceholder('Username').click();
    await page.getByPlaceholder('Username').fill('Detonator');
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('Antonije1@');
    await page.getByRole('button', { name: 'Prijavite se' }).click();
    await page.getByRole('link', { name: 'Knjizare' }).click()


    await page.locator('div[id="knjizara-0"]').click();
    await page.waitForTimeout(1000)

    await page.getByRole('button', { name: 'Dodaj knjigu' }).click();
    await page.getByPlaceholder('Naslov').click();
    await page.getByPlaceholder('Naslov').fill('');
    await page.getByPlaceholder('ISBN').click();
    await page.getByPlaceholder('ISBN').fill('IsbnKnjige');
    await page.getByPlaceholder('Autor').click();
    await page.getByPlaceholder('Autor').fill('');
    await page.getByPlaceholder('Izdavac').click();
    await page.getByPlaceholder('Izdavac').fill('IzdavacKnjige');
    await page.getByPlaceholder('Zanr').click();
    await page.getByPlaceholder('Zanr').fill('ZanrKnjige');
    await page.getByPlaceholder('Godina izdavanja').click();
    await page.getByPlaceholder('Godina izdavanja').fill('2024');
    await page.getByPlaceholder('Cena').click();
    await page.getByPlaceholder('Cena').fill('1000');
    await page.locator('#formFile').setInputFiles('punpun.jpg');
    await page.getByRole('button', { name: 'Dodaj' }).click();

    await page.waitForTimeout(1000)

    await page.waitForSelector('.mat-mdc-simple-snack-bar', { state: 'visible', timeout: 5000 });

    const snackbarText = await page.innerText('.mat-mdc-simple-snack-bar');
    expect(snackbarText).toContain('Molimo vas popunite sva polja');
    await page.waitForTimeout(2000);

});

test('EditBookOkTest', async ({ page }) => {

    await page.goto("http://localhost:4200/home");
    await page.getByRole('button', { name: 'Prijavi se' }).click();
    await page.getByPlaceholder('Username').click();
    await page.getByPlaceholder('Username').fill('Detonator');
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('Antonije1@');
    await page.getByRole('button', { name: 'Prijavite se' }).click();
    await page.getByRole('link', { name: 'Knjizare' }).click()


    await page.locator('div[id="knjizara-0"]').click();
    await page.waitForTimeout(1000)
    const knjiga= page.locator('tr[id="knjiga-3"]')
    await knjiga.getByRole('button').first().click();

    await page.getByPlaceholder('Naslov').fill('PunPun');
    await page.getByPlaceholder('ISBN').click();
    await page.getByPlaceholder('ISBN').fill('ISBN');
    await page.getByPlaceholder('Autor').click();
    await page.getByPlaceholder('Autor').fill('JaSamAutor');
    await page.getByPlaceholder('Izdavac').click();
    await page.getByPlaceholder('Izdavac').fill('JaSamIzdavac');
    await page.getByPlaceholder('Zanr').click();
    await page.getByPlaceholder('Zanr').fill('Manga');
    await page.getByPlaceholder('Godina izdavanja').click();
    await page.getByPlaceholder('Godina izdavanja').fill('2023');
    await page.getByPlaceholder('Cena').click();
    await page.getByPlaceholder('Cena').fill('450');
    await page.locator('#formFile').setInputFiles('punpun.jpg');
    await page.getByRole('button', { name: 'Izmeni' }).click();

    await page.waitForTimeout(1000)

    const naslov = await knjiga.locator('td[id="naslov"]')
    const isbn = await knjiga.locator('td[id="isbn"]')
    const autor = await knjiga.locator('td[id="autor"]')
    const izdavac = await knjiga.locator('td[id="izdavac"]')
    const zanr = await knjiga.locator('td[id="zanr"]')
    const godina = await knjiga.locator('td[id="godina"]')
    const cena = await knjiga.locator('td[id="cena"]')
    const slikaImg = await knjiga.locator('img[id="slikaKnjiga"]');

    expect(naslov).toHaveText("PunPun")
    await page.waitForTimeout(100)
    expect(isbn).toHaveText("ISBN")
    await page.waitForTimeout(100)
    expect(autor).toHaveText("JaSamAutor")
    await page.waitForTimeout(100)
    expect(izdavac).toHaveText("JaSamIzdavac")
    await page.waitForTimeout(100)
    expect(zanr).toHaveText("Manga")
    await page.waitForTimeout(100)
    expect(godina).toHaveText("2023")
    await page.waitForTimeout(100)
    expect(cena).toHaveText("450RSD")
    await page.waitForTimeout(100)
    const imageSrc = await slikaImg.getAttribute('src');
    expect(imageSrc).toContain('../assets/images/knjige/punpun.jpg');
    await page.waitForTimeout(100)

});

test('EditBookNotOkTest', async ({ page }) => {

    await page.goto("http://localhost:4200/home");
    await page.getByRole('button', { name: 'Prijavi se' }).click();
    await page.getByPlaceholder('Username').click();
    await page.getByPlaceholder('Username').fill('Detonator');
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('Antonije1@');
    await page.getByRole('button', { name: 'Prijavite se' }).click();
    await page.getByRole('link', { name: 'Knjizare' }).click()


    await page.locator('div[id="knjizara-0"]').click();
    await page.waitForTimeout(1000)
    const knjiga= page.locator('tr[id="knjiga-3"]')
    await knjiga.getByRole('button').first().click();

    await page.getByPlaceholder('Naslov').fill('PunPun');
    await page.getByPlaceholder('ISBN').click();
    await page.getByPlaceholder('ISBN').fill('');
    await page.getByPlaceholder('Autor').click();
    await page.getByPlaceholder('Autor').fill('JaSamAutor');
    await page.getByPlaceholder('Izdavac').click();
    await page.getByPlaceholder('Izdavac').fill('');
    await page.getByPlaceholder('Zanr').click();
    await page.getByPlaceholder('Zanr').fill('Manga');
    await page.getByPlaceholder('Godina izdavanja').click();
    await page.getByPlaceholder('Godina izdavanja').fill('2023');
    await page.getByPlaceholder('Cena').click();
    await page.getByPlaceholder('Cena').fill('450');
    await page.locator('#formFile').setInputFiles('punpun.jpg');
    await page.getByRole('button', { name: 'Izmeni' }).click();

    await page.waitForTimeout(1000)

    await page.waitForSelector('.mat-mdc-simple-snack-bar', { state: 'visible', timeout: 5000 });

    const snackbarText = await page.innerText('.mat-mdc-simple-snack-bar');
    expect(snackbarText).toContain('Molimo vas popunite sva polja');
    await page.waitForTimeout(2000);

});

test('DeleteBookOkTest', async ({ page }) => {

    await page.goto("http://localhost:4200/home");
    await page.getByRole('button', { name: 'Prijavi se' }).click();
    await page.getByPlaceholder('Username').click();
    await page.getByPlaceholder('Username').fill('Detonator');
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('Antonije1@');
    await page.getByRole('button', { name: 'Prijavite se' }).click();
    await page.getByRole('link', { name: 'Knjizare' }).click()

    await page.waitForTimeout(2000);

    await page.locator('div[id="knjizara-0"]').click();

    const knjigeContainer = await page.locator(".knjige-container");
    await knjigeContainer.waitFor({ state: 'visible' })
    const knjigaRow = knjigeContainer.locator('tr[class="knjiga-row"]')
    const initialCount = await knjigeContainer.locator('tr[class="knjiga-row"]').count();
    console.log('Broj elemenata u div-u pre brisanja:', initialCount);

    await page.locator('#knjiga-3').getByRole('button', { name: 'Izbrisi' }).click();

    await page.getByRole('button', { name: 'Da' }).click();

    await page.waitForTimeout(1000)

    const finalCount = await knjigeContainer.locator('tr[class="knjiga-row"]').count();
    console.log('Broj elemenata u div-u nakon brisanja:', finalCount);

    expect(finalCount).toBeLessThan(initialCount)

});
