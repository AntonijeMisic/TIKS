import { test, expect } from '@playwright/test';

test('GetBookstoresOkTest', async ({ page }) => {

    await page.goto('http://localhost:4200/knjizare');

    const knjizareContainer = await page.locator(".knjizare-container");
    await knjizareContainer.waitFor({ state: 'visible' })

    const knjizareItems = await knjizareContainer.locator('.knjizara-item-container');
    const imaKnjizara = await knjizareItems.count() > 0;
    expect(imaKnjizara).toBeTruthy();
});
test('GetBookstoreWithIdOkTest', async ({ page }) => {

    await page.goto('http://localhost:4200/knjizare');
    await page.locator('div[id="knjizara-0"]').click();
  
    const knjizaraContainer = await page.locator('div[class="knjizara-container"]');
    await knjizaraContainer.waitFor({ state: 'visible' })

    const naziv = await knjizaraContainer.locator('div[id="naziv"]');
    const adresa = await knjizaraContainer.locator('div[id="adresa"]');
    const email = await knjizaraContainer.locator('div[id="email"]');
    const telefon = await knjizaraContainer.locator('div[id="telefon"]');
    const slikaDiv = await knjizaraContainer.locator('div[class="knjizara-slika"]');

    expect(naziv).toHaveText("Laguna")
    await page.waitForTimeout(100)
    expect(adresa).toHaveText("Adresa: Bulevar Nemanjica 11b")
    await page.waitForTimeout(100)
    expect(telefon).toHaveText("Telefon: 018/35-04-770")
    await page.waitForTimeout(100)
    expect(email).toHaveText("Email: lagunadelta@gmail.com")
    await page.waitForTimeout(100)

    const imageElement = await slikaDiv.locator('img[id="knjizaraSlicka"]');

    const imageSrc = await imageElement.getAttribute('src');
    expect(imageSrc).toContain('../../../../assets/images/knjizare/laguna_delta.jpg');
    await page.waitForTimeout(100)       
});

test('AddBookstoreOkTest', async ({ page }) => {

    await page.goto("http://localhost:4200/home");
    await page.getByRole('button', { name: 'Prijavi se' }).click();
    await page.getByPlaceholder('Username').click();
    await page.getByPlaceholder('Username').fill('Detonator');
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('Antonije1@');
    await page.getByRole('button', { name: 'Prijavite se' }).click();
    await page.getByRole('link', { name: 'Knjizare' }).click()

    await page.waitForTimeout(2000);

    const initialCount = await page.locator('div[class="knjizara-item-container"]').count();
    console.log('Broj elemenata u div-u pre dodavanja:', initialCount);

    await page.getByRole('button', { name: 'Dodaj knjizaru' }).click();
    await page.getByPlaceholder('Naziv').click();
    await page.getByPlaceholder('Naziv').fill('NazivKnjizare');
    await page.getByPlaceholder('Adresa').click();
    await page.getByPlaceholder('Adresa').fill('AdresaKnjizare');
    await page.getByPlaceholder('Email').click();
    await page.getByPlaceholder('Email').fill('EmailKnjizare');
    await page.getByPlaceholder('Telefon').click();
    await page.getByPlaceholder('Telefon').fill('018 277 777');
    await page.locator('#formFile').click();
    await page.locator('#formFile').setInputFiles('laguna_delta.jpg');
    await page.getByRole('button', { name: 'Dodaj' }).click();

    await page.waitForTimeout(2000);

    const finalCount = await page.locator('div[class="knjizara-item-container"]').count();
    console.log('Broj elemenata u div-u nakon dodavanja:', finalCount);

    expect(finalCount).toBeGreaterThan(initialCount)
    await page.waitForTimeout(2000);

});
test('AddBookstoreNotOkTest', async ({ page }) => {

    await page.goto("http://localhost:4200/home");
    await page.getByRole('button', { name: 'Prijavi se' }).click();
    await page.getByPlaceholder('Username').click();
    await page.getByPlaceholder('Username').fill('Detonator');
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('Antonije1@');
    await page.getByRole('button', { name: 'Prijavite se' }).click();
    await page.getByRole('link', { name: 'Knjizare' }).click()

    await page.waitForTimeout(2000);

    //const initialCount = await page.locator('div[class="knjizara-item-container"]').count();
    //console.log('Broj elemenata u div-u pre dodavanja:', initialCount);

    await page.getByRole('button', { name: 'Dodaj knjizaru' }).click();
    await page.getByPlaceholder('Naziv').click();
    await page.getByPlaceholder('Naziv').fill('Naziv');
    await page.getByPlaceholder('Adresa').click();
    await page.getByPlaceholder('Adresa').fill('');
    await page.getByPlaceholder('Email').click();
    await page.getByPlaceholder('Email').fill('EmailKnjizare');
    await page.getByPlaceholder('Telefon').click();
    await page.getByPlaceholder('Telefon').fill('018 277 777');
    await page.locator('#formFile').click();
    await page.locator('#formFile').setInputFiles('laguna_delta.jpg');
    await page.getByRole('button', { name: 'Dodaj' }).click();

    await page.waitForTimeout(2000);

    //const finalCount = await page.locator('div[class="knjizara-item-container"]').count();
    //console.log('Broj elemenata u div-u nakon dodavanja:', finalCount);

    //expect(finalCount).toBeGreaterThan(initialCount)
    await page.waitForSelector('.mat-mdc-simple-snack-bar', { state: 'visible', timeout: 5000 });

    const snackbarText = await page.innerText('.mat-mdc-simple-snack-bar');
    expect(snackbarText).toContain('Molimo vas popunite sva polja');
    await page.waitForTimeout(2000);

});

test('EditBookstoresOkTest', async ({ page }) => {

    await page.goto("http://localhost:4200/home");
    await page.getByRole('button', { name: 'Prijavi se' }).click();
    await page.getByPlaceholder('Username').click();
    await page.getByPlaceholder('Username').fill('Detonator');
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('Antonije1@');
    await page.getByRole('button', { name: 'Prijavite se' }).click();
    await page.getByRole('link', { name: 'Knjizare' }).click();
    await page.locator('div[id="knjizara-3"]').click();
    await page.getByRole('button', { name: 'Izmeni' }).first().click();
    await page.getByPlaceholder('Naziv').click();
    await page.getByPlaceholder('Naziv').fill('LagunaKnjizara');
    await page.getByPlaceholder('Adresa').click();
    await page.getByPlaceholder('Adresa').fill('Bulevar Nemanjica 11a');
    await page.getByPlaceholder('Email').click();
    await page.getByPlaceholder('Email').fill('lagunadelta@gmail.com');
    await page.getByPlaceholder('Telefon').click();
    await page.getByPlaceholder('Telefon').fill('018/35-04-771');
    await page.locator('#formFile').setInputFiles('laguna_delta.jpg');
    await page.getByRole('button', { name: 'Izmeni' }).click();

    const knjizaraInfo = await page.locator('div[class="knjizara-info"]');
    knjizaraInfo.waitFor({ state: 'visible'})
    const knjizaraPodaci = await page.locator('div[class="knjizara-podaci"]');
    knjizaraPodaci.waitFor({ state: 'visible'})


    const naziv = await knjizaraPodaci.locator('div[id="naziv"]');
    const adresa = await knjizaraPodaci.locator('div[id="adresa"]');
    const email = await knjizaraPodaci.locator('div[id="email"]');
    const telefon = await knjizaraPodaci.locator('div[id="telefon"]');
    const slikaDiv = await knjizaraInfo.locator('div[class="knjizara-slika"]');

    expect(naziv).toHaveText("LagunaKnjizara")
    await page.waitForTimeout(100)
    expect(adresa).toHaveText("Adresa: Bulevar Nemanjica 11a")
    await page.waitForTimeout(100)
    expect(telefon).toHaveText("Telefon: 018/35-04-771")
    await page.waitForTimeout(100)
    expect(email).toHaveText("Email: lagunadelta@gmail.com")
    await page.waitForTimeout(100)

    const imageElement = await slikaDiv.locator('img[id="knjizaraSlicka"]');

    const imageSrc = await imageElement.getAttribute('src');
    expect(imageSrc).toContain('../assets/images/knjizare/laguna_delta.jpg'); //mora proveris da li ima ili tu ili unetu sliku
    await page.waitForTimeout(100)

});

test('EditBookstoresNotOkTest', async ({ page }) => {

    await page.goto("http://localhost:4200/home");
    await page.getByRole('button', { name: 'Prijavi se' }).click();
    await page.getByPlaceholder('Username').click();
    await page.getByPlaceholder('Username').fill('Detonator');
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('Antonije1@');
    await page.getByRole('button', { name: 'Prijavite se' }).click();
    await page.getByRole('link', { name: 'Knjizare' }).click();
    await page.locator('div[id="knjizara-3"]').click();
    await page.getByRole('button', { name: 'Izmeni' }).first().click();

    await page.getByPlaceholder('Naziv').click();
    await page.getByPlaceholder('Naziv').fill('');
    await page.getByPlaceholder('Adresa').click();
    await page.getByPlaceholder('Adresa').fill('Bulevar Nemanjica 11a');
    await page.getByPlaceholder('Email').click();
    await page.getByPlaceholder('Email').fill('');
    await page.getByPlaceholder('Telefon').click();
    await page.getByPlaceholder('Telefon').fill('018/35-04-771');
    await page.locator('#formFile').setInputFiles('laguna_delta.jpg');
    await page.getByRole('button', { name: 'Izmeni' }).click();

    await page.waitForTimeout(2000);

    await page.waitForSelector('.mat-mdc-simple-snack-bar', { state: 'visible', timeout: 5000 });

    const snackbarText = await page.innerText('.mat-mdc-simple-snack-bar');
    expect(snackbarText).toContain('Molimo vas popunite sva polja');
    await page.waitForTimeout(2000);

});

test('DeleteBookstoreOkTest', async ({ page }) => {

    await page.goto("http://localhost:4200/home");
    await page.getByRole('button', { name: 'Prijavi se' }).click();
    await page.getByPlaceholder('Username').click();
    await page.getByPlaceholder('Username').fill('Detonator');
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('Antonije1@');
    await page.getByRole('button', { name: 'Prijavite se' }).click();
    await page.getByRole('link', { name: 'Knjizare' }).click()

    await page.waitForTimeout(2000);

    const initialCount = await page.locator('div[class="knjizara-item-container"]').count();
    console.log('Broj elemenata u div-u pre brisanja:', initialCount);

    await page.locator('div[id="knjizara-3"]').click();

    await page.getByRole('button', { name: 'Izbrisi' }).click();
    await page.getByRole('button', { name: 'Da' }).click();

    await page.waitForTimeout(2000);

    const finalCount = await page.locator('div[class="knjizara-item-container"]').count();
    console.log('Broj elemenata u div-u nakon brisanja:', finalCount);

    expect(finalCount).toBeLessThan(initialCount)
    await page.waitForTimeout(2000);

});


