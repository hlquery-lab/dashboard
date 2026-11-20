export async function openPage(page, name) {
  const parents = {
    Projects: "Projects",
    Board: "Projects",
    Calendar: "Projects",
    Reports: "Analytics",
    Charts: "Analytics",
    Team: "Workspace",
    Activity: "Workspace",
    Billing: "Billing",
    Payments: "Billing",
    Settings: "Settings",
    Appearance: "Settings",
  };
  const labels = {
    Projects: "All projects",
    Board: "Board view",
    Reports: "Performance report",
    Charts: "Chart gallery",
    Team: "Team members",
    Activity: "Activity feed",
    Billing: "Invoices",
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
