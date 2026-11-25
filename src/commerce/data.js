export const demoDate = "2026-11-23";
export const productSeed = [
  {
    id: "p1",
    name: "Everyday Canvas Tote",
    sku: "BAG-001",
    category: "Accessories",
    price: 48,
    cost: 18,
    stock: 42,
    status: "Active",
    art: "bag",
    color: "#d7bba1",
    description: "A durable cotton canvas tote with room for the everyday.",
  },
  {
    id: "p2",
    name: "Studio Headphones",
    sku: "AUD-002",
    category: "Electronics",
    price: 129,
    cost: 62,
    stock: 18,
    status: "Active",
    art: "headphones",
    color: "#8fa6bc",
    description: "Wireless over-ear headphones with a comfortable, quiet fit.",
  },
  {
    id: "p3",
    name: "Terra Ceramic Mug",
    sku: "HOM-003",
    category: "Home & living",
    price: 24,
    cost: 8,
    stock: 7,
    status: "Active",
    art: "mug",
    color: "#be896e",
    description: "A softly rounded ceramic mug for your daily coffee ritual.",
  },
  {
    id: "p4",
    name: "Essential Cotton Tee",
    sku: "APP-004",
    category: "Apparel",
    price: 36,
    cost: 12,
    stock: 64,
    status: "Active",
    art: "shirt",
    color: "#95a692",
    description: "An easy everyday tee in soft, breathable cotton.",
  },
  {
    id: "p5",
    name: "Arc Desk Lamp",
    sku: "HOM-005",
    category: "Home & living",
    price: 89,
    cost: 34,
    stock: 5,
    status: "Active",
    art: "lamp",
    color: "#c7a678",
    description: "Warm task lighting with a simple, adjustable silhouette.",
  },
  {
    id: "p6",
    name: "Weekend Backpack",
    sku: "BAG-006",
    category: "Accessories",
    price: 96,
    cost: 38,
    stock: 23,
    status: "Active",
    art: "backpack",
    color: "#829d98",
    description: "A lightweight pack for your commute and everything after.",
  },
  {
    id: "p7",
    name: "Daily Water Bottle",
    sku: "ACC-007",
    category: "Accessories",
    price: 32,
    cost: 10,
    stock: 0,
    status: "Active",
    art: "bottle",
    color: "#94a9c5",
    description:
      "An insulated stainless steel bottle, made to go wherever you go.",
  },
  {
    id: "p8",
    name: "Linen Cushion",
    sku: "HOM-008",
    category: "Home & living",
    price: 42,
    cost: 15,
    stock: 12,
    status: "Draft",
    art: "cushion",
    color: "#d8ab92",
    description: "Natural texture and a little extra comfort for your home.",
  },
];
export const customerSeed = [
  {
    id: "c1",
    name: "Olivia Martin",
    email: "olivia.martin@example.com",
    city: "Portland",
    country: "United States",
    address: "218 Maple Street, Portland, OR 97205",
  },
  {
    id: "c2",
    name: "James Wilson",
    email: "james.wilson@example.com",
    city: "Austin",
    country: "United States",
    address: "47 Cedar Lane, Austin, TX 78701",
  },
  {
    id: "c3",
    name: "Sophia Chen",
    email: "sophia.chen@example.com",
    city: "Seattle",
    country: "United States",
    address: "630 Pine Avenue, Seattle, WA 98101",
  },
  {
    id: "c4",
    name: "Noah Williams",
    email: "noah.williams@example.com",
    city: "Denver",
    country: "United States",
    address: "84 Oak Drive, Denver, CO 80202",
  },
  {
    id: "c5",
    name: "Emma Davis",
    email: "emma.davis@example.com",
    city: "Brooklyn",
    country: "United States",
    address: "325 Court Street, Brooklyn, NY 11201",
  },
  {
    id: "c6",
    name: "Liam Garcia",
    email: "liam.garcia@example.com",
    city: "San Diego",
    country: "United States",
    address: "15 Coast Road, San Diego, CA 92101",
  },
  {
    id: "c7",
    name: "Ava Thompson",
    email: "ava.thompson@example.com",
    city: "Boston",
    country: "United States",
    address: "92 Beacon Street, Boston, MA 02108",
  },
  {
    id: "c8",
    name: "Ethan Lee",
    email: "ethan.lee@example.com",
    city: "Chicago",
    country: "United States",
    address: "48 Lake Street, Chicago, IL 60601",
  },
];
const examples = [
  [
    "c1",
    23,
    "Unfulfilled",
    "Paid",
    [
      ["p1", 2],
      ["p3", 1],
    ],
    "Online store",
  ],
  [
    "c2",
    23,
    "Processing",
    "Paid",
    [
      ["p2", 1],
      ["p4", 2],
    ],
    "Instagram",
  ],
  ["c3", 23, "Shipped", "Paid", [["p6", 1]], "Online store"],
  [
    "c4",
    22,
    "Delivered",
    "Paid",
    [
      ["p5", 1],
      ["p3", 2],
    ],
    "Online store",
  ],
  ["c5", 22, "Unfulfilled", "Pending", [["p4", 1]], "Online store"],
  [
    "c6",
    21,
    "Delivered",
    "Paid",
    [
      ["p2", 2],
      ["p1", 1],
    ],
    "Instagram",
  ],
  ["c7", 21, "Processing", "Paid", [["p5", 2]], "Online store"],
  [
    "c8",
    20,
    "Delivered",
    "Paid",
    [
      ["p6", 1],
      ["p4", 1],
    ],
    "Online store",
  ],
  [
    "c1",
    19,
    "Delivered",
    "Paid",
    [
      ["p3", 4],
      ["p1", 1],
    ],
    "Instagram",
  ],
  ["c3", 18, "Delivered", "Paid", [["p4", 3]], "Online store"],
  ["c2", 17, "Cancelled", "Refunded", [["p2", 1]], "Online store"],
  [
    "c5",
    17,
    "Delivered",
    "Paid",
    [
      ["p1", 1],
      ["p5", 1],
    ],
    "Online store",
  ],
  ["c6", 15, "Delivered", "Paid", [["p6", 2]], "Instagram"],
  [
    "c7",
    12,
    "Delivered",
    "Paid",
    [
      ["p2", 1],
      ["p3", 2],
    ],
    "Online store",
  ],
  [
    "c8",
    8,
    "Delivered",
    "Paid",
    [
      ["p4", 2],
      ["p1", 1],
    ],
    "Online store",
  ],
  [
    "c4",
    4,
    "Delivered",
    "Paid",
    [
      ["p5", 1],
      ["p6", 1],
    ],
    "Online store",
  ],
];
export const orderSeed = examples.map(
  ([customerId, day, status, payment, items, channel], i) => ({
    id: `ORD-${1048 - i}`,
    customerId,
    date: `2026-11-${String(day).padStart(2, "0")}`,
    status,
    payment,
    channel,
    items: items.map(([productId, quantity]) => {
      const p = productSeed.find((p) => p.id === productId);
      return {
        productId,
        name: p.name,
        price: p.price,
        cost: p.cost,
        quantity,
      };
    }),
    discountCode: "",
    discount: 0,
    shipping: 0,
    note: "",
  }),
);
export const discountSeed = [
  { id: "d1", code: "WELCOME10", percent: 10, minimum: 50, active: true },
  { id: "d2", code: "WEEKEND15", percent: 15, minimum: 100, active: false },
];
export const categories = [
  "Accessories",
  "Electronics",
  "Home & living",
  "Apparel",
];
export const orderTotal = (order) =>
  Math.round(
    (order.items.reduce((sum, line) => sum + line.price * line.quantity, 0) -
      (order.discount || 0) +
      (order.shipping || 0)) *
      100,
  ) / 100;
export const initials = (name) =>
  name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
export const dateLabel = (value) =>
  new Date(value + "T12:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
export function exportCsv(filename, rows) {
  const csv =
    "\uFEFF" +
    rows
      .map((row) =>
        row
          .map((value) => '"' + String(value ?? "").replaceAll('"', '""') + '"')
          .join(","),
      )
      .join("\r\n");
  downloadFile(filename, csv, "text/csv;charset=utf-8");
}
export function downloadFile(
  filename,
  text,
  type = "text/plain;charset=utf-8",
) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function downloadInvoice(order, customer) {
  const usd = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  const lines = order.items
    .map(
      (l) =>
        `${l.quantity} × ${l.name} @ ${usd(l.price)} = ${usd(l.price * l.quantity)}`,
    )
    .join("\n");
  downloadFile(
    `${order.id}-invoice.txt`,
    `HLQUERY STORE — DEMO INVOICE\nOrder: ${order.id}\nDate: ${order.date}\nCustomer: ${customer?.name}\nEmail: ${customer?.email}\n\n${lines}\n\nDiscount: ${usd(order.discount)}\nShipping: ${usd(order.shipping)}\nTotal (USD): ${usd(orderTotal(order))}\nPayment: ${order.payment}\nFulfillment: ${order.status}\n\nSample data only. No payment is processed. This is not a tax invoice.\n`,
  );
}
