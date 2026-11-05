import { expect } from '@playwright/test';

export async function login(page) {
  await page.goto('https://www.saucedemo.com');
  await page.getByLabel('Username').fill('standard_user');
  await page.getByLabel('Password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/inventory\.html/);
}
