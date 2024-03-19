import { test, expect } from '@playwright/test';

test("UserOkRegisterTest", async ({ page }) => {

    await page.goto("http://localhost:4200/home");
    await page.getByRole('button', { name: 'Prijavi se' }).click();
    await page.getByRole('link', { name: 'napravite svoj ovde' }).click();
    await page.getByPlaceholder('Ime', { exact: true }).click();
    await page.getByPlaceholder('Ime', { exact: true }).fill('Mihajlo');
    await page.getByPlaceholder('Prezime').click();
    await page.getByPlaceholder('Prezime').fill('Misic');
    await page.getByPlaceholder('Username').click();
    await page.getByPlaceholder('Username').fill('Skemi10'); //username mora da bude jedinstveno tj da nije u bazi
    await page.getByPlaceholder('Email').click();
    await page.getByPlaceholder('Email').fill('skemi10@gmail.com'); //email mora da bude jedinstven
    await page.getByPlaceholder('Password', { exact: true }).click();
    await page.getByPlaceholder('Password', { exact: true }).fill('Antonije1');
    await page.getByPlaceholder('Confirm password').click();
    await page.getByPlaceholder('Confirm password').fill('Antonije1');
    await page.getByRole('button', { name: 'Registrujte se' }).click();
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL("http://localhost:4200/login");
    await page.waitForTimeout(2000);
})
test("PasswordsNotMatchingRegisterTest", async ({ page }) => {

    await page.goto("http://localhost:4200/home");
    await page.getByRole('button', { name: 'Prijavi se' }).click();
    await page.getByRole('link', { name: 'napravite svoj ovde' }).click();
    await page.getByPlaceholder('Ime', { exact: true }).click();
    await page.getByPlaceholder('Ime', { exact: true }).fill('Mihajlo');
    await page.getByPlaceholder('Prezime').click();
    await page.getByPlaceholder('Prezime').fill('Misic');
    await page.getByPlaceholder('Username').click();
    await page.getByPlaceholder('Username').fill('Skemi123');
    await page.getByPlaceholder('Email').click();
    await page.getByPlaceholder('Email').fill('skemi@gmail.com');
    await page.getByPlaceholder('Password', { exact: true }).click();
    await page.getByPlaceholder('Password', { exact: true }).fill('Antonjie1');
    await page.getByPlaceholder('Confirm password').click();
    await page.getByPlaceholder('Confirm password').fill('Antonije2');
    await page.getByRole('button', { name: 'Registrujte se' }).click();

    await page.waitForSelector('.mat-mdc-simple-snack-bar', { state: 'visible', timeout: 5000 });

    const snackbarText = await page.innerText('.mat-mdc-simple-snack-bar');
    expect(snackbarText).toContain('Lozinke nisu iste!');
})

test("InvalidInputsRegisterTest", async ({ page }) => {

    await page.goto("http://localhost:4200/home");
    await page.getByRole('button', { name: 'Prijavi se' }).click();
    await page.getByRole('link', { name: 'napravite svoj ovde' }).click();
    await page.getByPlaceholder('Ime', { exact: true }).click();
    await page.getByPlaceholder('Ime', { exact: true }).fill('');
    await page.getByPlaceholder('Prezime').click();
    await page.getByPlaceholder('Prezime').fill('');
    await page.getByPlaceholder('Username').click();
    await page.getByPlaceholder('Username').fill('');
    await page.getByPlaceholder('Email').click();
    await page.getByPlaceholder('Email').fill('');
    await page.getByPlaceholder('Password', { exact: true }).click();
    await page.getByPlaceholder('Password', { exact: true }).fill('');
    await page.getByPlaceholder('Confirm password').click();
    await page.getByPlaceholder('Confirm password').fill('');
    await page.getByRole('button', { name: 'Registrujte se' }).click();

    const labelIme = await page.locator('small[id="imeSmall"]');
    const labelPrezime = await page.locator('small[id="prezimeSmall"]');
    const labelUsername = await page.locator('small[id="usernameSmall"]');
    const labelEmail = await page.locator('small[id="emailSmall"]');
    const labelPassword = await page.locator('small[id="passwordSmall"]');
    const labelRepPassword = await page.locator('small[id="repPasswordSmall"]');

    const expectedText1 = '*Ime je obavezno polje';
    const expectedText2 = '*Prezime je obavezno polje';
    const expectedText3 = '*Username je obavezno polje';
    const expectedText4 = '*Email je obavezno polje';
    const expectedText5 = '*Password je obavezno polje';
    const expectedText6 = '*Confirm password je obavezno polje';

    await expect(labelIme).toHaveText(expectedText1);
    await expect(labelPrezime).toHaveText(expectedText2);
    await expect(labelUsername).toHaveText(expectedText3);
    await expect(labelEmail).toHaveText(expectedText4);
    await expect(labelPassword).toHaveText(expectedText5);
    await expect(labelRepPassword).toHaveText(expectedText6);
    
})
