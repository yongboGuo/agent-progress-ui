import { expect, test } from "@playwright/test";

test("homepage renders the core proposition", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /Build agent workbenches/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Open reference app/i }).first()).toBeVisible();
});

test("playground updates the visible scenario", async ({ page }) => {
  await page.goto("/playground");

  await page.getByRole("button", { name: /Live store inspector/i }).click();
  await expect(page.getByText(/Incremental store replay/i)).toBeVisible();
  await expect(page.getByText(/Play replay/i)).toBeVisible();
});

test("example routes render evidence-heavy workbenches", async ({ page }) => {
  await page.goto("/examples/code-agent");

  await expect(page.getByRole("heading", { name: /Code Agent/i })).toBeVisible();
  await expect(page.getByText(/Full runtime transcript/i)).toBeVisible();
});
