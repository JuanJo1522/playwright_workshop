import { test, expect } from '@playwright/test';
import { login } from './helpers/auth.js';

test('allows a standard user to log in', async ({ page }) => {
  await login(page);

  await expect(page.getByText('Products', { exact: true })).toBeVisible();
  await expect(page.locator('.inventory_item')).toHaveCount(6);
});

test('shows an error when the password is incorrect', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await page.getByLabel('Username').fill('standard_user');
  await page.getByLabel('Password').fill('wrong_password');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL('https://www.saucedemo.com/');
  await expect(page.locator('[data-test="error"]')).toContainText(
    'Username and password do not match',
  );
});
