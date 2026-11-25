<script setup>
import { computed } from "vue";
import {
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  ShoppingBag,
  ShoppingCart,
  Wallet,
  Package,
  AlertTriangle,
  Truck,
  CalendarDays,
} from "lucide-vue-next";
import { useCommerce } from "./store.js";
import { demoDate, orderTotal, dateLabel } from "./data.js";
import { money } from "../utils/currency.js";
import WorkspaceChart from "../components/WorkspaceChart.vue";
import ProductArt from "./ProductArt.vue";
import OrderTable from "./OrderTable.vue";
const props = defineProps({
  analytics: Boolean,
  period: Number,
  dark: Boolean,
});
const emit = defineEmits(["navigate", "order"]);
const { state, paid, lowStock, unfulfilled, product } = useCommerce();
const dayMs = 86400000;
const end = new Date(demoDate + "T12:00:00").getTime();
const within = (order, offset = 0) => {
  const age = Math.round(
    (end - new Date(order.date + "T12:00:00").getTime()) / dayMs,
  );
  return age >= offset && age < offset + props.period;
};
const periodOrders = computed(() => state.orders.filter((o) => within(o)));
const current = computed(() => paid.value.filter((o) => within(o)));
const previous = computed(() =>
  paid.value.filter((o) => within(o, props.period)),
);
const sum = (orders) => orders.reduce((s, o) => s + orderTotal(o), 0);
const units = (orders) =>
  orders.reduce((s, o) => s + o.items.reduce((n, l) => n + l.quantity, 0), 0);
const total = computed(() => sum(current.value));
const stats = computed(() => [
  {
    label: "Total sales",
    value: money(total.value),
    old: sum(previous.value),
    now: total.value,
    icon: Wallet,
    tone: "blue",
    detail: "Paid orders · USD",
  },
  {
    label: "Orders",
    value: periodOrders.value.filter((o) => o.status !== "Cancelled").length,
    old: state.orders.filter(
      (o) => within(o, props.period) && o.status !== "Cancelled",
    ).length,
    now: periodOrders.value.filter((o) => o.status !== "Cancelled").length,
    icon: ShoppingBag,
    tone: "green",
    detail: "Excludes cancelled orders",
  },
  {
    label: "Average order value",
    value: money(current.value.length ? total.value / current.value.length : 0),
    old: previous.value.length
      ? sum(previous.value) / previous.value.length
      : 0,
    now: current.value.length ? total.value / current.value.length : 0,
    icon: ShoppingCart,
    tone: "amber",
    detail: "Across paid orders · USD",
  },
  {
    label: "Items sold",
    value: units(current.value),
    old: units(previous.value),
    now: units(current.value),
    icon: Package,
    tone: "violet",
    detail: "Units in paid orders",
  },
]);
function change(stat) {
  if (!stat.old) return "No previous data";
  const value = ((stat.now - stat.old) / stat.old) * 100;
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}
const dates = computed(() =>
  Array.from({ length: props.period }, (_, i) =>
    new Date(end - (props.period - 1 - i) * dayMs).toISOString().slice(0, 10),
  ),
);
const labels = computed(() =>
  dates.value.map((d) =>
    new Date(d + "T12:00:00").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  ),
);
const datasets = computed(() => [
  {
    label: "Sales",
    data: dates.value.map((d) =>
      sum(current.value.filter((o) => o.date === d)),
    ),
    borderColor: "#1976d3",
    backgroundColor: "#1976d314",
    fill: true,
  },
  {
    label: "Previous period",
    data: dates.value.map((d) => {
      const prior = new Date(
        new Date(d + "T12:00:00").getTime() - props.period * dayMs,
      )
        .toISOString()
        .slice(0, 10);
      return sum(previous.value.filter((o) => o.date === prior));
    }),
    borderColor: "#b4c2d2",
    borderDash: [4, 5],
  },
]);
const bestSellers = computed(() => {
  const map = new Map();
  for (const o of current.value) {
    const subtotal = o.items.reduce((s, l) => s + l.price * l.quantity, 0);
    for (const l of o.items) {
      const entry = map.get(l.productId) || {
        ...product(l.productId),
        id: l.productId,
        name: l.name,
        units: 0,
        revenue: 0,
      };
      entry.units += l.quantity;
      entry.revenue +=
        l.price *
        l.quantity *
        (subtotal ? (subtotal - o.discount) / subtotal : 1);
      map.set(l.productId, entry);
    }
  }
  return [...map.values()].sort((a, b) => b.revenue - a.revenue);
});
const channels = computed(() => {
  const map = new Map();
  for (const o of current.value)
    map.set(o.channel, (map.get(o.channel) || 0) + orderTotal(o));
  return [...map].sort((a, b) => b[1] - a[1]);
});
const categorySales = computed(() => {
  const map = new Map();
  for (const p of bestSellers.value)
    map.set(p.category, (map.get(p.category) || 0) + p.revenue);
  return [...map].sort((a, b) => b[1] - a[1]);
});
const startLabel = computed(() => dateLabel(dates.value[0]));
</script>
<template>
  <div class="c-dashboard-tabs">
    <div>
      <button
        :class="{ active: !analytics }"
        @click="emit('navigate', 'Overview')"
      >
        Overview</button
      ><button
        :class="{ active: analytics }"
        @click="emit('navigate', 'Analytics')"
      >
        Sales analytics <ArrowUpRight :size="13" />
      </button>
    </div>
    <span
      ><CalendarDays :size="14" />{{ startLabel }} –
      {{ dateLabel(demoDate) }}</span
    >
  </div>
  <section v-if="!analytics" class="c-store-banner">
    <div>
      <span class="c-banner-kicker"
        ><span></span> A LITTLE EVERYDAY, A LOT TO LOVE.</span
      >
      <h2>Good things,<br />on their way.</h2>
      <p>
        You have <strong>{{ unfulfilled.length }} paid orders</strong> to get
        out the door.<br />Let’s give your customers something to look forward
        to.
      </p>
      <button class="c-banner-button" @click="emit('navigate', 'Fulfillment')">
        View fulfillment queue <ArrowRight :size="15" />
      </button>
    </div>
    <div class="c-banner-products" aria-hidden="true">
      <span class="c-banner-circle"></span
      ><ProductArt
        :product="
          state.products.find((p) => p.art === 'bag') || state.products[0]
        "
      /><ProductArt
        :product="
          state.products.find((p) => p.art === 'mug') || state.products[0]
        "
      /><span class="c-banner-sticker"
        ><Truck :size="17" /><span
          >Carefully packed.<br /><strong>Happily delivered.</strong></span
        ></span
      >
    </div>
    <span class="c-banner-label">CURATED ESSENTIALS / COLLECTION 2026</span>
  </section>
  <section class="c-metric-grid" aria-label="Store metrics">
    <article v-for="stat in stats" :key="stat.label" class="card c-metric">
      <div class="c-metric-heading">
        <span>{{ stat.label }}</span
        ><span class="c-metric-icon" :class="stat.tone"
          ><component :is="stat.icon" :size="17"
        /></span>
      </div>
      <strong>{{ stat.value }}</strong>
      <div class="c-metric-comparison">
        <span :class="stat.now >= stat.old ? 'positive' : 'negative'"
          ><component
            :is="stat.now >= stat.old ? ArrowUpRight : ArrowDownRight"
            :size="13"
          />{{ change(stat) }}</span
        ><small>{{ stat.old ? "vs. previous period" : stat.detail }}</small>
      </div>
    </article>
  </section>
  <div class="c-dashboard-grid">
    <section class="card c-sales-card">
      <header class="c-panel-heading">
        <div>
          <span class="panel-kicker">THE BIG PICTURE</span>
          <h2>Sales overview</h2>
          <p>Paid order revenue over the selected period.</p>
        </div>
        <span class="c-currency-label">USD</span>
      </header>
      <div class="c-sales-total">
        <strong>{{ money(total) }}</strong
        ><span>{{ current.length }} paid orders</span>
      </div>
      <WorkspaceChart
        :labels="labels"
        :datasets="datasets"
        :dark="dark"
        currency
        :height="260"
        label="Daily sales and previous period, in USD"
      />
    </section>
    <section class="card c-channel-card">
      <header class="c-panel-heading">
        <div>
          <span class="panel-kicker">WHERE THEY FIND YOU</span>
          <h2>Sales by channel</h2>
        </div>
        <ShoppingBag :size="18" />
      </header>
      <div class="c-channel-total">
        <strong>{{ money(total) }}</strong
        ><span>across {{ channels.length }} channels</span>
      </div>
      <div class="c-channel-bar" aria-hidden="true">
        <span
          v-for="([name, value], i) in channels"
          :key="name"
          :style="{
            width: (total ? (value / total) * 100 : 0) + '%',
            background: ['#1976d3', '#79b3e9', '#c8dff4'][i % 3],
          }"
        ></span>
      </div>
      <div
        v-for="([name, value], i) in channels"
        :key="name"
        class="c-channel-row"
      >
        <span
          class="c-channel-dot"
          :style="{ background: ['#1976d3', '#79b3e9', '#c8dff4'][i % 3] }"
        ></span
        ><span>{{ name }}</span
        ><strong>{{ money(value) }}</strong
        ><small>{{ total ? Math.round((value / total) * 100) : 0 }}%</small>
      </div>
      <p v-if="!channels.length" class="c-empty-note">
        No paid orders in this period.
      </p>
      <div class="c-channel-note">
        <span>One store. Every opportunity.</span>
        <p>Channel totals update as new orders are paid.</p>
      </div>
    </section>
  </div>
  <div class="c-dashboard-grid c-lower-grid">
    <section class="card c-best-sellers">
      <header class="c-panel-heading">
        <div>
          <span class="panel-kicker">CUSTOMER FAVORITES</span>
          <h2>Best-selling products</h2>
        </div>
        <button class="c-text-button" @click="emit('navigate', 'Products')">
          View products <ArrowUpRight :size="14" />
        </button>
      </header>
      <div class="c-table-scroll">
        <table class="c-table">
          <thead>
            <tr>
              <th>Product</th>
              <th class="c-number">Sold</th>
              <th class="c-number">Sales (USD)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in bestSellers.slice(0, 5)" :key="p.id">
              <td>
                <button
                  class="c-product-cell"
                  @click="emit('navigate', 'Products')"
                >
                  <ProductArt :product="p" /><span
                    ><strong>{{ p.name }}</strong
                    ><small>{{ p.category }}</small></span
                  >
                </button>
              </td>
              <td class="c-number">
                {{ p.units }} <span class="muted">units</span>
              </td>
              <td class="c-number c-amount">{{ money(p.revenue) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="!bestSellers.length" class="c-empty">
        <Package :size="26" />
        <p>No product sales in this period.</p>
      </div>
    </section>
    <section v-if="!analytics" class="card c-stock-card">
      <header class="c-panel-heading">
        <div>
          <span class="panel-kicker">A HEADS-UP</span>
          <h2>Inventory alerts</h2>
        </div>
        <span class="c-alert-icon"><AlertTriangle :size="18" /></span>
      </header>
      <p>{{ lowStock.length }} active products could use a top-up.</p>
      <div v-for="p in lowStock.slice(0, 4)" :key="p.id" class="c-stock-alert">
        <ProductArt :product="p" />
        <div>
          <strong>{{ p.name }}</strong
          ><small>{{ p.sku }}</small>
        </div>
        <span
          class="c-status"
          :class="p.stock === 0 ? 'cancelled' : 'pending'"
          >{{ p.stock === 0 ? "Out of stock" : p.stock + " left" }}</span
        >
      </div>
      <button class="c-stock-button" @click="emit('navigate', 'Inventory')">
        Manage inventory <ArrowRight :size="14" />
      </button>
    </section>
    <section v-else class="card c-category-card">
      <header class="c-panel-heading">
        <div>
          <span class="panel-kicker">THE RIGHT MIX</span>
          <h2>Sales by category</h2>
        </div>
      </header>
      <div
        v-for="[name, value] in categorySales"
        :key="name"
        class="c-category-row"
      >
        <div>
          <span>{{ name }}</span
          ><strong>{{ money(value) }}</strong>
        </div>
        <div class="c-progress">
          <i :style="{ width: (total ? (value / total) * 100 : 0) + '%' }"></i>
        </div>
        <small
          >{{ total ? ((value / total) * 100).toFixed(1) : 0 }}% of sales</small
        >
      </div>
      <p class="c-empty-note">
        Product sales include discounts. Shipping is excluded.
      </p>
    </section>
  </div>
  <section class="card c-recent-orders">
    <header class="c-panel-heading">
      <div>
        <span class="panel-kicker">FRESH FROM CHECKOUT</span>
        <h2>{{ analytics ? "Orders in this period" : "Recent orders" }}</h2>
        <p>Real people. Good choices. The next step is yours.</p>
      </div>
      <button class="c-text-button" @click="emit('navigate', 'Orders')">
        View all orders <ArrowUpRight :size="14" />
      </button>
    </header>
    <OrderTable
      :orders="periodOrders.slice(0, analytics ? 12 : 5)"
      @order="emit('order', $event)"
    />
  </section>
</template>
