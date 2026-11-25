import { computed, reactive, watch, provide, inject } from "vue";
import {
  productSeed,
  customerSeed,
  orderSeed,
  discountSeed,
  demoDate,
  orderTotal,
  exportCsv,
} from "./data.js";
const key = "hlquery-commerce-v1";
const round = (value) => Math.round(value * 100) / 100;
export function createCommerce() {
  let saved;
  try {
    saved = JSON.parse(localStorage.getItem(key));
  } catch {
    /* Start with demo data if storage is unavailable. */
  }
  const state = reactive({
    products: saved?.products || structuredClone(productSeed),
    customers: saved?.customers || structuredClone(customerSeed),
    orders: saved?.orders || structuredClone(orderSeed),
    discounts: saved?.discounts || structuredClone(discountSeed),
    activity: saved?.activity || [
      {
        id: "a1",
        title: "Order ORD-1048 received",
        detail: "Olivia Martin · Online store",
        date: demoDate,
      },
      {
        id: "a2",
        title: "Arc Desk Lamp is running low",
        detail: "5 units available · Consider restocking",
        date: demoDate,
      },
    ],
  });
  watch(state, () => localStorage.setItem(key, JSON.stringify(state)), {
    deep: true,
    flush: "sync",
  });
  const customer = (id) => state.customers.find((c) => c.id === id);
  const product = (id) => state.products.find((p) => p.id === id);
  const paid = computed(() =>
    state.orders.filter(
      (o) => o.payment === "Paid" && o.status !== "Cancelled",
    ),
  );
  const lowStock = computed(() =>
    state.products.filter((p) => p.stock <= 10 && p.status === "Active"),
  );
  const unfulfilled = computed(() =>
    state.orders.filter(
      (o) =>
        o.payment === "Paid" &&
        ["Unfulfilled", "Processing"].includes(o.status),
    ),
  );
  const sales = computed(() =>
    round(paid.value.reduce((s, o) => s + orderTotal(o), 0)),
  );
  function log(title, detail) {
    state.activity.unshift({
      id: crypto.randomUUID(),
      title,
      detail,
      date: demoDate,
    });
  }
  function saveProduct(draft) {
    const price = Number(draft.price),
      cost = Number(draft.cost),
      stock = Number(draft.stock);
    if (
      !draft.name?.trim() ||
      !draft.sku?.trim() ||
      !Number.isFinite(price) ||
      price <= 0 ||
      !Number.isFinite(cost) ||
      cost < 0 ||
      !Number.isInteger(stock) ||
      stock < 0
    )
      throw new Error(
        "Enter a name, SKU, positive price, and valid cost and stock.",
      );
    if (
      state.products.some(
        (p) =>
          p.id !== draft.id &&
          p.sku.toLowerCase() === draft.sku.trim().toLowerCase(),
      )
    )
      throw new Error("This SKU already exists. Use a unique SKU.");
    const existing = product(draft.id);
    const item = {
      ...draft,
      id: draft.id || crypto.randomUUID(),
      name: draft.name.trim(),
      sku: draft.sku.trim().toUpperCase(),
      price: round(price),
      cost: round(cost),
      stock,
    };
    if (existing) Object.assign(existing, item);
    else state.products.unshift(item);
    log(existing ? "Product updated" : "Product added", item.name);
    return item;
  }
  function restock(id, quantity) {
    const p = product(id);
    if (!p || !Number.isInteger(quantity) || quantity < 1)
      throw new Error("Enter a whole number greater than zero.");
    p.stock += quantity;
    log("Inventory restocked", `${p.name} · +${quantity} units`);
  }
  function saveCustomer(draft) {
    if (!draft.name?.trim() || !/^\S+@\S+\.\S+$/.test(draft.email?.trim()))
      throw new Error("Enter a customer name and valid email.");
    if (
      state.customers.some(
        (c) =>
          c.id !== draft.id &&
          c.email.toLowerCase() === draft.email.trim().toLowerCase(),
      )
    )
      throw new Error("A customer with this email already exists.");
    const item = {
      ...draft,
      id: draft.id || crypto.randomUUID(),
      name: draft.name.trim(),
      email: draft.email.trim().toLowerCase(),
    };
    const existing = customer(item.id);
    if (existing) Object.assign(existing, item);
    else state.customers.unshift(item);
    log(existing ? "Customer updated" : "Customer added", item.name);
    return item;
  }
  function createOrder(draft) {
    if (!customer(draft.customerId)) throw new Error("Select a customer.");
    const quantities = new Map();
    for (const line of draft.items || [])
      quantities.set(
        line.productId,
        (quantities.get(line.productId) || 0) + Number(line.quantity),
      );
    if (!quantities.size) throw new Error("Add at least one product.");
    const items = [...quantities].map(([id, quantity]) => {
      const p = product(id);
      if (
        !p ||
        p.status !== "Active" ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > p.stock
      )
        throw new Error(
          `${p?.name || "Product"} does not have enough available stock.`,
        );
      return {
        productId: id,
        name: p.name,
        price: p.price,
        cost: p.cost,
        quantity,
      };
    });
    const subtotal = round(items.reduce((s, l) => s + l.price * l.quantity, 0));
    const code = draft.discountCode?.trim().toUpperCase() || "";
    const discount = state.discounts.find((d) => d.code === code && d.active);
    if (code && (!discount || subtotal < discount.minimum))
      throw new Error(
        discount
          ? `This code requires a subtotal of at least $${discount.minimum.toFixed(2)}.`
          : "This discount code is unavailable.",
      );
    const next =
      Math.max(1048, ...state.orders.map((o) => Number(o.id.split("-")[1]))) +
      1;
    const order = {
      id: `ORD-${next}`,
      customerId: draft.customerId,
      date: demoDate,
      items,
      status: "Unfulfilled",
      payment: draft.payment === "Pending" ? "Pending" : "Paid",
      channel: "Manual order",
      discountCode: code,
      discount: discount ? round((subtotal * discount.percent) / 100) : 0,
      shipping: 0,
      note: draft.note?.trim() || "",
    };
    for (const item of items) product(item.productId).stock -= item.quantity;
    state.orders.unshift(order);
    log("Order created", `${order.id} · ${customer(order.customerId).name}`);
    return order;
  }
  function updateOrder(id, action) {
    const o = state.orders.find((o) => o.id === id);
    if (!o) throw new Error("Order not found.");
    if (
      action === "paid" &&
      o.payment === "Pending" &&
      o.status !== "Cancelled"
    )
      o.payment = "Paid";
    else if (
      action === "process" &&
      o.payment === "Paid" &&
      o.status === "Unfulfilled"
    )
      o.status = "Processing";
    else if (
      action === "ship" &&
      o.payment === "Paid" &&
      o.status === "Processing"
    )
      o.status = "Shipped";
    else if (action === "deliver" && o.status === "Shipped")
      o.status = "Delivered";
    else if (
      action === "cancel" &&
      ["Unfulfilled", "Processing"].includes(o.status)
    ) {
      o.status = "Cancelled";
      o.payment = o.payment === "Paid" ? "Refunded" : "Voided";
      for (const line of o.items) {
        const p = product(line.productId);
        if (p) p.stock += line.quantity;
      }
    } else
      throw new Error(
        "This action is unavailable for the current order status.",
      );
    log("Order updated", `${o.id} · ${o.status} · ${o.payment}`);
  }
  function saveDiscount(draft) {
    const code = draft.code?.trim().toUpperCase();
    const percent = Number(draft.percent),
      minimum = Number(draft.minimum);
    if (
      !code ||
      !/^[A-Z0-9_-]{3,24}$/.test(code) ||
      !Number.isFinite(percent) ||
      percent <= 0 ||
      percent > 100 ||
      !Number.isFinite(minimum) ||
      minimum < 0
    )
      throw new Error(
        "Use a 3–24 character code, a percentage from 1 to 100, and a valid minimum.",
      );
    if (state.discounts.some((d) => d.code === code))
      throw new Error("This discount code already exists.");
    state.discounts.unshift({
      id: crypto.randomUUID(),
      code,
      percent,
      minimum: round(minimum),
      active: true,
    });
    log("Discount created", code);
  }
  function exportOrders(orders = state.orders) {
    exportCsv("hlquery-orders.csv", [
      [
        "Order",
        "Date",
        "Customer",
        "Payment",
        "Fulfillment",
        "Total USD",
        "Discount USD",
      ],
      ...orders.map((o) => [
        o.id,
        o.date,
        customer(o.customerId)?.name,
        o.payment,
        o.status,
        orderTotal(o).toFixed(2),
        o.discount.toFixed(2),
      ]),
    ]);
  }
  const api = {
    state,
    customer,
    product,
    paid,
    lowStock,
    unfulfilled,
    sales,
    log,
    saveProduct,
    restock,
    saveCustomer,
    createOrder,
    updateOrder,
    saveDiscount,
    exportOrders,
  };
  provide("commerce", api);
  return api;
}
export const useCommerce = () => inject("commerce");
