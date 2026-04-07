import { expect, test } from "@playwright/test";

import type { BrowserContext, Page } from "@playwright/test";

async function loginAsSeededRole(
  context: BrowserContext,
  page: Page,
  role: "admin" | "manager" | "user",
) {
  const credentials = {
    admin: { email: "admin@example.com", password: "ValidPass123!" },
    manager: { email: "manager@example.com", password: "ValidPass123!" },
    user: { email: "user@example.com", password: "ValidPass123!" },
  }[role];

  await page.goto("/login");
  await page.getByLabel("Email").fill(credentials.email);
  await page.getByLabel("Password").fill(credentials.password);
  const loginResponsePromise = page.waitForResponse(
    (response) => response.url().includes("/api/auth/login") && response.request().method() === "POST",
  );
  await page.getByRole("button", { name: "Sign in" }).click();
  const loginResponse = await loginResponsePromise;

  if (!loginResponse.ok()) {
    const body = await loginResponse.json().catch(() => null);
    throw new Error(
      `Seeded login failed for ${credentials.email} with status ${loginResponse.status()}: ${JSON.stringify(body)}`,
    );
  }

  await expect(page).not.toHaveURL(/\/login$/);
}

test.describe("auth role-based dashboard access", () => {
  test.describe.configure({ mode: "serial" });
  test("user role cannot access dashboard", async ({ context, page }) => {
    await loginAsSeededRole(context, page, "user");
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/unauthorized$/);
  });

  test("admin role can access dashboard", async ({ context, page }) => {
    await loginAsSeededRole(context, page, "admin");
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test("manager role can access dashboard", async ({ context, page }) => {
    await loginAsSeededRole(context, page, "manager");
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/dashboard$/);
  });
});
