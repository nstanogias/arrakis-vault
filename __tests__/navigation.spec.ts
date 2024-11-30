import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("navigate to vault page from homepage when clicking go to vault button", async ({
    page,
  }) => {
    await page.goto("/");

    const goToVaultButton = page.locator('[data-testid="go-to-vault"]');
    await goToVaultButton.first().click();

    await expect(page).toHaveURL(
      "vault/0x4ca9fb1f302b6bd8421bad9debd22198eb6ab723"
    );
  });

  test("navigate to home page from vault when clicking Back to vaults button", async ({
    page,
  }) => {
    await page.goto("/vault/0x4ca9fb1f302b6bd8421bad9debd22198eb6ab723");

    const backToVaultsButton = page.locator('[data-testid="back-to-vaults"]');
    await backToVaultsButton.first().click();

    await expect(page).toHaveURL("/");
  });
});
