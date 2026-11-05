import { test, expect } from '@playwright/test';
import { login } from './helpers/auth.js';

test.beforeEach(async ({ page }) => {
  await login(page);
});

test('adds and removes a product from the cart', async ({ page }) => {
  await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

  await page.getByTestId('shopping-cart-link').click();
  await expect(page).toHaveURL(/cart\.html/);
  await expect(page.locator('.cart_item')).toHaveCount(1);
  await expect(page.getByText('Sauce Labs Backpack', { exact: true })).toBeVisible();

  await page.getByTestId('remove-sauce-labs-backpack').click();
  await expect(page.locator('.cart_item')).toHaveCount(0);
  await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
});
