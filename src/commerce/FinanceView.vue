<script setup>
import { computed, ref } from "vue";
import {
  Wallet,
  Clock3,
  RotateCcw,
  Download,
  Search,
  Receipt,
  ArrowUpRight,
} from "lucide-vue-next";
import { useCommerce } from "./store.js";
import { money } from "../utils/currency.js";
import { orderTotal, dateLabel, downloadInvoice, exportCsv } from "./data.js";
const props = defineProps({ page: String });
const emit = defineEmits(["order", "notify"]);
const { state, customer, paid } = useCommerce();
const query = ref(""),
  filter = ref("All payments");
const total = (type) =>
  state.orders
    .filter(
      (o) =>
        o.payment === type && (type !== "Pending" || o.status !== "Cancelled"),
    )
    .reduce((s, o) => s + orderTotal(o), 0);
const filtered = computed(() =>
  state.orders.filter(
    (o) =>
      (filter.value === "All payments" || o.payment === filter.value) &&
      `${o.id} ${customer(o.customerId)?.name}`
        .toLowerCase()
        .includes(query.value.trim().toLowerCase()),
  ),
);
function download() {
  exportCsv(`hlquery-${props.page.toLowerCase()}.csv`, [
    ["Order", "Date", "Customer", "Amount USD", "Payment", "Channel"],
    ...filtered.value.map((o) => [
      o.id,
      o.date,
      customer(o.customerId)?.name,
      orderTotal(o).toFixed(2),
      o.payment,
      o.channel,
    ]),
  ]);
  emit("notify", "Financial report exported in USD");
}
</script>
<template>
  <section class="c-finance-metrics">
    <article
      v-for="[label, value, icon, tone] in [
        ['Payments received', total('Paid'), Wallet, 'blue'],
        ['Awaiting payment', total('Pending'), Clock3, 'amber'],
        ['Refunded', total('Refunded'), RotateCcw, 'green'],
      ]"
      :key="label"
      class="card"
    >
      <span class="c-metric-icon" :class="tone"
        ><component :is="icon" :size="21"
      /></span>
      <p>{{ label }}</p>
      <strong>{{ money(value) }}</strong
      ><small>USD · Sample order data</small>
    </article>
  </section>
  <section class="card">
    <header class="c-panel-heading">
      <div>
        <span class="panel-kicker">{{
          page === "Invoices" ? "YOUR PAPER TRAIL" : "FOLLOW THE MONEY"
        }}</span>
        <h2>
          {{ page === "Invoices" ? "Order invoices" : "Payment activity" }}
        </h2>
        <p>
          {{
            page === "Invoices"
              ? "Download an itemized sample invoice for any order."
              : "Review payment status and open an order to update it."
          }}
        </p>
      </div>
      <button class="button" @click="download">
        <Download :size="15" />Export CSV
      </button>
    </header>
    <div class="c-table-toolbar">
      <label class="c-search"
        ><Search :size="16" /><input
          v-model="query"
          type="search"
          :aria-label="`Search ${page.toLowerCase()}`"
          placeholder="Search by order or customer…" /></label
      ><select v-model="filter" class="c-select" aria-label="Filter payments">
        <option>All payments</option>
        <option>Paid</option>
        <option>Pending</option>
        <option>Refunded</option>
        <option>Voided</option>
      </select>
    </div>
    <div class="c-table-scroll">
      <table class="c-table">
        <thead>
          <tr>
            <th>Order / invoice</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Payment</th>
            <th class="c-number">Amount (USD)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="o in filtered" :key="o.id">
            <td>
              <button class="c-order-link" @click="emit('order', o)">
                {{ o.id }}</button
              ><small>{{ o.channel }}</small>
            </td>
            <td>{{ customer(o.customerId)?.name }}</td>
            <td>{{ dateLabel(o.date) }}</td>
            <td>
              <span class="c-status" :class="o.payment.toLowerCase()"
                ><i></i>{{ o.payment }}</span
              >
            </td>
            <td class="c-number c-amount">{{ money(orderTotal(o)) }}</td>
            <td>
              <button
                v-if="page === 'Invoices'"
                class="c-text-button"
                :aria-label="`Download invoice ${o.id}`"
                @click="downloadInvoice(o, customer(o.customerId))"
              >
                <Download :size="15" />Download</button
              ><button
                v-else
                class="c-text-button"
                :aria-label="`View payment ${o.id}`"
                @click="emit('order', o)"
              >
                Details <ArrowUpRight :size="14" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="!filtered.length" class="c-empty">
      <Receipt :size="28" />
      <h3>No records found</h3>
      <p>Try a different search or payment status.</p>
    </div>
    <div class="c-catalog-footer">
      <span>{{ filtered.length }} records</span
      ><span>Demo data. No payment processing, payouts, or tax invoices.</span>
    </div>
  </section>
</template>
