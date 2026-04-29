import { expect, test } from "@playwright/test";

test("homepage renders the core proposition", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /Replace vague loading/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Run playground/i })).toBeVisible();
});

test("playground updates the visible scenario", async ({ page }) => {
  await page.goto("/playground");

  await page.getByRole("button", { name: /Deep Research/i }).click();
  await expect(page.getByText(/A multi-source research flow/i)).toBeVisible();
  await expect(page.getByText("Visible event count", { exact: true })).toBeVisible();
});

test("example routes render evidence-heavy workbenches", async ({ page }) => {
  await page.goto("/examples/agent");

  await expect(page.getByRole("heading", { name: /Agent Workbench/i })).toBeVisible();
  await expect(page.getByText(/Full event feed/i)).toBeVisible();
});
