export async function openPage(page, name) {
  const parents = {
    Orders: "Orders",
    Fulfillment: "Orders",
    Products: "Catalog",
    Inventory: "Catalog",
    Settings: "Settings",
    Appearance: "Settings",
  };
  const labels = {
    Orders: "All orders",
    Settings: "General",
    Help: "Help center",
  };
  const sidebar = page.locator(".sidebar");
  if (parents[name]) {
    const parent = sidebar.getByRole("button", {
      name: parents[name],
      exact: true,
    });
    if ((await parent.getAttribute("aria-expanded")) !== "true")
      await parent.click();
  }
  await sidebar
    .getByRole("link", { name: labels[name] || name, exact: true })
    .click();
}
export async function downloadText(download) {
  const stream = await download.createReadStream();
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}
export async function createOrder(
  page,
  { quantity = "2", payment = "Paid", discount = "" } = {},
) {
  await page
    .getByRole("button", { name: "Create order", exact: true })
    .first()
    .click();
  const dialog = page.getByRole("dialog", { name: "Create order" });
  await dialog.getByLabel("Customer", { exact: true }).selectOption("c1");
  await dialog.getByLabel("Qty", { exact: true }).fill(quantity);
  await dialog
    .getByLabel("Payment status", { exact: true })
    .selectOption(payment);
  if (discount)
    await dialog.getByLabel("Discount code", { exact: true }).fill(discount);
  await dialog
    .getByRole("button", { name: "Create order", exact: true })
    .click();
}
