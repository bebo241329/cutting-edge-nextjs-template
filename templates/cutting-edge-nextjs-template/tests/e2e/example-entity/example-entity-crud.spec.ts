import { expect, test, type APIRequestContext, type Page } from "@playwright/test";

type SessionBody = {
  session?: {
    userId: string;
    email: string;
    role?: "admin" | "manager" | "user";
  };
  error?: string;
};

async function loginAsRole(
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
  expect(loginResponse.ok()).toBeTruthy();

  const loginBody = (await loginResponse.json().catch(() => null)) as
    | { session?: { role?: "admin" | "manager" | "user" } }
    | null;

  expect(loginBody?.session?.role).toBe(role);
  await expect(page).not.toHaveURL(/\/login$/);
}

type ExampleEntityBody = {
  id: string;
  title: string;
  body: string;
};

const CRUD_REQUEST_TIMEOUT_MS = 10000;
const FIRESTORE_SETUP_HINT =
  "If using Firebase, verify Firestore is enabled and has write access for this project.";

function buildUsername(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

async function loginAsFreshUser(page: Page, request: APIRequestContext) {
  const email = `e2e-example-entity-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;
  const password = "ValidPass123!";
  const fullName = "E2E Example Entity User";

  const registerResponse = await request.post("/api/auth/register", {
    data: { fullName, username: buildUsername("e2e_entity"), email, password },
  });

  const registerBody = (await registerResponse.json()) as SessionBody;

  if (!registerResponse.ok()) {
    throw new Error(
      `Register failed with status ${registerResponse.status()}: ${JSON.stringify(registerBody)}`,
    );
  }

  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/dashboard$/, { timeout: 10000 });
}

async function createEntityViaApi(page: Page, title: string, body: string) {
  const response = await page.request.post("/api/example-entities", {
    data: { title, body },
    timeout: CRUD_REQUEST_TIMEOUT_MS,
  });

  const responseBody = (await response.json()) as ExampleEntityBody | { error?: string };

  if (!response.ok() || !("id" in responseBody)) {
    throw new Error(
      `Create example entity failed with status ${response.status()}: ${JSON.stringify(responseBody)}. ${FIRESTORE_SETUP_HINT}`,
    );
  }

  return responseBody;
}

test.describe("example entity CRUD integration", () => {
  test.describe.configure({ mode: "serial" });

  test("user role gets permission denied on create example entity", async ({
    page,
  }) => {
    await loginAsRole(page, "user");

    const response = await page.request.post("/api/example-entities", {
      data: { title: "X", body: "Y" },
    });

    expect(response.status()).toBe(403);
    await expect(response.json()).resolves.toEqual(
      expect.objectContaining({ error: "permission_denied" }),
    );
  });

  test("admin role can create example entity", async ({ page }) => {
    await loginAsRole(page, "admin");

    const response = await page.request.post("/api/example-entities", {
      data: { title: `Admin Create ${Date.now()}`, body: "Allowed" },
    });

    if (!response.ok()) {
      const body = await response.json().catch(() => null);
      throw new Error(
        `Admin create failed with status ${response.status()}: ${JSON.stringify(body)}`,
      );
    }
  });

  test("manager role can create example entity", async ({ page }) => {
    await loginAsRole(page, "manager");

    const response = await page.request.post("/api/example-entities", {
      data: { title: `Manager Create ${Date.now()}`, body: "Allowed" },
    });

    if (!response.ok()) {
      const body = await response.json().catch(() => null);
      throw new Error(
        `Manager create failed with status ${response.status()}: ${JSON.stringify(body)}`,
      );
    }
  });

  test("deactivated user is rejected by login", async ({ request }) => {
    const loginResponse = await request.post("/api/auth/login", {
      data: {
        email: "deactivated@example.com",
        password: "ValidPass123!",
      },
    });

    expect(loginResponse.status()).toBe(403);
    await expect(loginResponse.json()).resolves.toEqual({
      error: "account_deactivated",
    });
  });

  test("create works and redirects to detail page", async ({ page, request }) => {
    await loginAsFreshUser(page, request);

    const title = `Entity Create ${Date.now()}`;
    const body = `Entity body create ${Date.now()}`;

    await page.goto("/dashboard/example-entities/new");
    await page.getByLabel("Title").fill(title);
    await page.getByLabel("Body").fill(body);

    const createRequestPromise = request
      .post("/api/example-entities", {
        data: { title, body },
        timeout: CRUD_REQUEST_TIMEOUT_MS,
      })
      .catch(() => null);

    await page.getByRole("button", { name: "Create Example Entity" }).click();

    const createResponse = await createRequestPromise;
    if (!createResponse) {
      throw new Error(`Create example entity request timed out. ${FIRESTORE_SETUP_HINT}`);
    }

    const createBody = (await createResponse.json()) as ExampleEntityBody | { error?: string };

    if (!createResponse.ok() || !("id" in createBody)) {
      throw new Error(
        `Create example entity failed with status ${createResponse.status()}: ${JSON.stringify(createBody)}. ${FIRESTORE_SETUP_HINT}`,
      );
    }

    await expect(page).toHaveURL(new RegExp(`/dashboard/example-entities/${createBody.id}$`), {
      timeout: 10000,
    });
    await expect(page.getByRole("heading", { name: title })).toBeVisible();
    await expect(page.getByText(body)).toBeVisible();
  });

  test("read works from list to detail", async ({ page, request }) => {
    await loginAsFreshUser(page, request);

    const title = `Entity Read ${Date.now()}`;
    const body = `Entity body read ${Date.now()}`;
    const created = await createEntityViaApi(page, title, body);

    await page.goto("/dashboard/example-entities");
    const row = page.locator("tr", { hasText: title });
    await expect(row).toBeVisible();
    await row.getByRole("link", { name: "View" }).click();

    await expect(page).toHaveURL(new RegExp(`/dashboard/example-entities/${created.id}$`));
    await expect(page.getByRole("heading", { name: title })).toBeVisible();
    await expect(page.getByText(body)).toBeVisible();
  });

  test("update works from edit screen", async ({ page, request }) => {
    await loginAsFreshUser(page, request);

    const title = `Entity Update ${Date.now()}`;
    const body = `Entity body update ${Date.now()}`;
    const created = await createEntityViaApi(page, title, body);

    const updatedTitle = `${title} Updated`;
    const updatedBody = `${body} Updated`;

    await page.goto(`/dashboard/example-entities/${created.id}/edit`);
    await page.getByLabel("Title").fill(updatedTitle);
    await page.getByLabel("Body").fill(updatedBody);
    await page.getByRole("button", { name: "Save changes" }).click();

    await expect(page).toHaveURL(new RegExp(`/dashboard/example-entities/${created.id}$`));
    await expect(page.getByRole("heading", { name: updatedTitle })).toBeVisible();
    await expect(page.getByText(updatedBody)).toBeVisible();
  });

  test("delete works from list modal flow", async ({ page, request }) => {
    await loginAsFreshUser(page, request);

    const title = `Entity Delete List ${Date.now()}`;
    const body = `Entity body delete list ${Date.now()}`;
    await createEntityViaApi(request, title, body);

    await page.goto("/dashboard/example-entities");

    const row = page.locator("tr", { hasText: title });
    await expect(row).toBeVisible();
    await row.getByRole("button", { name: "Delete" }).click();

    const dialog = page.getByRole("dialog");
    await expect(dialog.getByRole("heading", { name: "Delete example entity?" })).toBeVisible();
    await dialog.getByRole("button", { name: "Delete" }).click();

    await expect(page.locator("tr", { hasText: title })).toHaveCount(0);
  });

  test("delete works from detail confirm flow", async ({ page, request }) => {
    await loginAsFreshUser(page, request);

    const title = `Entity Delete Detail ${Date.now()}`;
    const body = `Entity body delete detail ${Date.now()}`;
    const created = await createEntityViaApi(page, title, body);

    await page.goto(`/dashboard/example-entities/${created.id}`);

    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "Delete" }).click();

    await expect(page).toHaveURL(/\/dashboard\/example-entities$/, {
      timeout: 10000,
    });
    await expect(page.locator("tr", { hasText: title })).toHaveCount(0);
  });
});
