import { test, expect } from '@playwright/test';
import { login } from './helpers/auth.js';

test.beforeEach(async ({ page }) => {
  await login(page);
});

test('sorts products from lowest to highest price', async ({ page }) => {
  await page.getByTestId('product-sort-container').selectOption('lohi');

  const prices = await page.locator('.inventory_item_price').allTextContents();
  const numericPrices = prices.map((price) => Number(price.replace('$', '')));

  expect(numericPrices).toEqual([...numericPrices].sort((a, b) => a - b));
});

test('opens a product detail page and returns to the inventory', async ({ page }) => {
  await page.getByText('Sauce Labs Backpack', { exact: true }).click();

  await expect(page).toHaveURL(/inventory-item\.html/);
  await expect(page.getByText('Sauce Labs Backpack', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Back to products' }).click();
  await expect(page).toHaveURL(/inventory\.html/);
});
