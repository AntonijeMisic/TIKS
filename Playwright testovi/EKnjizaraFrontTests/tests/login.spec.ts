import { test, expect } from '@playwright/test';

test("UserOkLoginTest", async ({ page }) => {

    await page.goto("http://localhost:4200/home");
    await page.getByRole('button', { name: 'Prijavi se' }).click();
    await page.getByPlaceholder('Username').click();
    await page.getByPlaceholder('Username').fill('Detonator');
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('Antonije1@');
    await page.getByRole('button', { name: 'Prijavite se' }).click();
    await expect(page).toHaveURL("http://localhost:4200/home");
    await expect(page.locator('button[id="dropdownMenuButton1"]')).toHaveText('Antonije Misic');
})

test("InputsEmptyLoginTest", async ({ page }) => {

    await page.goto("http://localhost:4200/home");
    await page.getByRole('button', { name: 'Prijavi se' }).click();
    await page.getByPlaceholder('Username').click();
    await page.getByPlaceholder('Username').fill('');
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('');
    await page.getByRole('button', { name: 'Prijavite se' }).click();

    const label1 = await page.locator('small[id="usernameNotFound"]');
    const label2 = await page.locator('small[id="passwordNotFound"]');

    const expectedText1 = '*Username je obavezno polje';
    const expectedText2 = '*Password je obavezno polje';

    await expect(label1).toHaveText(expectedText1);
    await expect(label2).toHaveText(expectedText2);
})
test("InputsNotValidLoginTest", async ({ page }) => {

    await page.goto("http://localhost:4200/home");
    await page.getByRole('button', { name: 'Prijavi se' }).click();
    await page.getByPlaceholder('Username').click();
    await page.getByPlaceholder('Username').fill('asdas');
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('asasfa');
    await page.getByRole('button', { name: 'Prijavite se' }).click();


    await page.waitForSelector('.mat-mdc-simple-snack-bar', { state: 'visible', timeout: 5000 });

    const snackbarText = await page.innerText('.mat-mdc-simple-snack-bar');
    expect(snackbarText).toContain('Korisnik nije pronadjen!');
})
test("UsernameNotValidLoginTest", async ({ page }) => {

    await page.goto("http://localhost:4200/home");
    await page.getByRole('button', { name: 'Prijavi se' }).click();
    await page.getByPlaceholder('Username').click();
    await page.getByPlaceholder('Username').fill('');
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('');
    await page.getByRole('button', { name: 'Prijavite se' }).click();

    const label1 = await page.locator('small[id="usernameNotFound"]');

    const expectedText1 = '*Username je obavezno polje';

    await expect(label1).toHaveText(expectedText1);
})
test("PasswordNotValidLoginTest", async ({ page }) => {

    await page.goto("http://localhost:4200/home");
    await page.getByRole('button', { name: 'Prijavi se' }).click();
    await page.getByPlaceholder('Username').click();
    await page.getByPlaceholder('Username').fill('');
    await page.getByPlaceholder('Password').click();
    await page.getByPlaceholder('Password').fill('');
    await page.getByRole('button', { name: 'Prijavite se' }).click();

    const label2 = await page.locator('small[id="passwordNotFound"]');
    const expectedText2 = '*Password je obavezno polje';

    await expect(label2).toHaveText(expectedText2);
})