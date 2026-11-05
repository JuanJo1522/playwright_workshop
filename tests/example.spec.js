import { test, expect } from '@playwright/test';

test('Add three products, verify cart and complete checkout @test1', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  await page.getByLabel('Username').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/inventory\.html/);

  const productsToBuy = [
    'sauce-labs-backpack',
    'sauce-labs-bike-light',
    'sauce-labs-bolt-t-shirt',
  ];
  const expectedProducts = [];

  for (const productId of productsToBuy) {
    const productCard = page.locator('.inventory_item').filter({
      has: page.locator(`[data-test="add-to-cart-${productId}"]`),
    });
    const name = (await productCard.locator('.inventory_item_name').innerText()).trim();
    const priceText = (await productCard.locator('.inventory_item_price').innerText()).trim();
    expectedProducts.push({ name, priceText });

    await page.locator(`[data-test="add-to-cart-${productId}"]`).click();
  }

  await expect(page.locator('.shopping_cart_badge')).toHaveText('3');

  await page.locator('//*[@data-test="shopping-cart-link"]').click();
  await expect(page).toHaveURL(/cart\.html/);

  const cartItems = page.locator('.cart_item');
  await expect(cartItems).toHaveCount(3);
  for (const product of expectedProducts) {
    const cartItem = cartItems.filter({ hasText: product.name });
    await expect(cartItem).toHaveCount(1);
    await expect(cartItem.getByText(product.name, { exact: true })).toBeVisible();
    await expect(cartItem.locator('.inventory_item_price')).toHaveText(product.priceText);
  }

  await page.locator('[data-test="remove-sauce-labs-bike-light"]').click();
  await expect(cartItems).toHaveCount(2);
  await expect(page.getByText('Sauce Labs Bike Light', { exact: true })).toHaveCount(0);

  const checkoutButton = page.getByRole('button', { name: 'Checkout', exact: true });
  await expect(checkoutButton).toBeVisible();
  await checkoutButton.click();
  await page.getByLabel('First Name').fill('Juan');
  await page.getByLabel('Last Name').fill('Perez');
  await page.getByLabel('Zip/Postal Code').fill('12345');
  await page.getByRole('button', { name: 'Continue' }).click();

  const overviewItems = page.locator('.cart_item');
  await expect(overviewItems).toHaveCount(2);
  for (const product of expectedProducts.filter((item) => item.name !== 'Sauce Labs Bike Light')) {
    const overviewItem = overviewItems.filter({ hasText: product.name });
    await expect(overviewItem).toHaveCount(1);
    await expect(overviewItem.locator('.inventory_item_price')).toHaveText(product.priceText);
  }

  const finishButton = page.getByRole('button', { name: 'Finish', exact: true });
  await expect(finishButton).toBeVisible();
  await finishButton.click();
  await expect(page.getByRole('heading', { name: 'Thank you for your order!' })).toBeVisible();
  await expect(page.getByText('Your order has been dispatched', { exact: false })).toBeVisible();
});
