/* eslint-disable @typescript-eslint/no-explicit-any */
import { test, expect } from "@playwright/test";

test.describe("input calculation by proportion", () => {
  test("token inputs are updated based on proportion", async ({ page }) => {
    await page.addInitScript(() => {
      (window as any).isPlaywrightTest = true;
    });

    await page.goto("/vault/0x4ca9fb1f302b6bd8421bad9debd22198eb6ab723");

    const token0Input = page.locator('[data-testid="token0"]');
    const token1Input = page.locator('[data-testid="token1"]');

    await token0Input.fill("50");

    const expectedToken1Value = (50 * 2).toFixed(8);

    await expect(token1Input).toHaveValue(expectedToken1Value);

    await token1Input.fill("100");

    const expectedToken0Value = (100 / 2).toFixed(8);
    await expect(token0Input).toHaveValue(expectedToken0Value);
  });
});

test.describe("Button states", () => {
  test("wallet connect button is visible if account is not connected", async ({
    page,
  }) => {
    await page.goto("/vault/0x4ca9fb1f302b6bd8421bad9debd22198eb6ab723");

    const walletConnectButton = page.locator(
      '[data-testid="connect-wallet-button"]'
    );

    await expect(walletConnectButton).toBeVisible();

    await expect(walletConnectButton).toHaveText("Connect Wallet");
  });

  test("confirm button is visible if account is connected", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      (window as any).useMockAccount = true;
      (window as any).useBalances = true;
    });
    await page.goto("/vault/0x4ca9fb1f302b6bd8421bad9debd22198eb6ab723");

    const confirmButton = page.locator('[data-testid="confirm-button"]');

    await expect(confirmButton).toBeVisible();

    await expect(confirmButton).toHaveText("Confirm");
    await expect(confirmButton).toBeDisabled();
  });

  test("disable confirm button for invalid input", async ({ page }) => {
    await page.addInitScript(() => {
      (window as any).useMockAccount = true;
      (window as any).useBalances = true;
    });
    await page.goto("/vault/0x4ca9fb1f302b6bd8421bad9debd22198eb6ab723");

    const token0Input = page.locator('[data-testid="token0"]');
    const confirmButton = page.locator('[data-testid="confirm-button"]');

    await token0Input.fill("0");

    await expect(confirmButton).toBeDisabled();
  });

  test("disables the confirm button when funds are insufficient", async ({
    page,
  }) => {
    await page.goto("/vault/0x4ca9fb1f302b6bd8421bad9debd22198eb6ab723");

    await page.evaluate(() => {
      (window as any).useMockAccount = true;
      (window as any).useBalances = true;
    });

    const token0Input = page.locator('[data-testid="token0"]');
    const confirmButton = page.locator('[data-testid="confirm-button"]');
    await token0Input.fill("150");

    await expect(confirmButton).toBeDisabled();
    await expect(confirmButton).toHaveText("Insufficient Funds");
  });
});

test.describe("Set Max token Balance", () => {
  test("MAX button sets the maximum balance", async ({ page }) => {
    await page.addInitScript(() => {
      (window as any).useMockAccount = true;
      (window as any).useBalances = true;
    });
    await page.goto("/vault/0x4ca9fb1f302b6bd8421bad9debd22198eb6ab723");

    const token0Input = page.locator('[data-testid="token0"]');
    const maxButton = page.locator('[data-testid="token0-max"]');

    await maxButton.click();

    await expect(token0Input).toHaveValue("100");
  });
});
