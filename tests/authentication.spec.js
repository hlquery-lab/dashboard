import { test, expect } from "@playwright/test";

for (const variant of ["Login 01", "Login 02", "Sign up 01", "Sign up 02"]) {
  test(`${variant}: navigation, validation, and demo confirmation`, async ({ page }) => {
    await page.goto("/");
    const sidebar = page.locator(".sidebar");
    await sidebar.getByRole("button", { name: "Authentication", exact: true }).click();
    await sidebar.getByRole("link", { name: variant, exact: true }).click();
    await expect(sidebar).toHaveCount(0);
    await expect(page.locator(".topbar, .page-heading, .c-footer")).toHaveCount(0);
    await expect(page).toHaveTitle(`${variant} · Open Source Dashboard · HLQuery`);
    const preview = page.getByRole("region", { name: "Authentication demo" });
    const signup = variant.startsWith("Sign up");
    const submit = preview.getByRole("button", { name: signup ? "Create account" : "Sign in", exact: true });
    await submit.click();
    await expect(preview.getByText("Enter a valid email address.")).toBeVisible();
    await preview.getByLabel("Email address", { exact: true }).fill("alex@example.com");
    await preview.getByLabel("Password", { exact: true }).fill("demo-password");
    await preview.getByRole("button", { name: "Show password", exact: true }).click();
    await expect(preview.getByLabel("Password", { exact: true })).toHaveAttribute("type", "text");
    if (signup) {
      await preview.getByLabel("Full name", { exact: true }).fill("Alex Morgan");
      await preview.getByLabel("Confirm password", { exact: true }).fill("different-password");
      await submit.click();
      await expect(preview.getByText("Your passwords don’t match.")).toBeVisible();
      await preview.getByLabel("Confirm password", { exact: true }).fill("demo-password");
    }
    await submit.click();
    await expect(preview.getByRole("status")).toContainText("Your form passed validation.");
    await preview.getByRole("button", { name: "Try the form again" }).click();
    await expect(preview.getByLabel("Password", { exact: true })).toHaveValue("");
    await page.reload();
    await expect(preview.getByLabel("Email address", { exact: true })).toHaveValue("");
    await preview.getByRole("link", { name: signup ? "Sign in" : "Create a business account", exact: true }).click();
    await expect(page.locator("h1")).toHaveText(signup ? "Welcome back" : "Create your account");
    await preview.getByRole("link", { name: "Back to dashboard" }).click();
    await expect(sidebar).toBeVisible();
    await expect(page.locator("h1")).toHaveText("Dashboard");
  });
}

test("recovery is clearly a demo and all variants fit a mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const variant of ["Login 01", "Login 02", "Sign up 01", "Sign up 02"]) {
    await page.goto(`/#${encodeURIComponent(variant)}`);
    await expect(page.locator(".auth-submit")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.goto("/#Login%2002");
  await page.getByRole("button", { name: "Forgot password?" }).click();
  await page.getByLabel("Email address", { exact: true }).fill("alex@example.com");
  await page.getByRole("button", { name: "Preview password recovery" }).click();
  await expect(page.locator(".auth-success")).toContainText("No email was sent.");
});
