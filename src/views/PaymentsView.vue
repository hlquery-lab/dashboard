<script setup>
import { computed } from "vue";
import {
  ArrowDownLeft,
  Download,
  ArrowUpRight,
  Wallet,
  Check,
} from "lucide-vue-next";
import { invoices } from "../data/invoices.js";
const emit = defineEmits(["invoices"]);
const paid = invoices.filter((i) => i.status === "Paid");
const total = computed(() => paid.reduce((sum, i) => sum + i.amount, 0));
const money = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(amount);
function download() {
  const rows = [
    ["Invoice", "Client", "Amount CLP", "Status"],
    ...paid.map((i) => [i.id, i.client, i.amount, i.status]),
  ];
  const csv = rows
    .map((row) =>
      row.map((v) => '"' + String(v).replaceAll('"', '""') + '"').join(","),
    )
    .join("\r\n");
  const url = URL.createObjectURL(
    new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = "hlquery-payments.csv";
  a.click();
  URL.revokeObjectURL(url);
}
</script>
<template>
  <div class="payments-layout">
    <article class="payment-balance-card">
      <span class="balance-icon"><Wallet :size="25" /></span
      ><span class="balance-eyebrow">PAYMENTS RECEIVED</span>
      <h2>{{ money(total) }}</h2>
      <p>CLP · Sample billing data</p>
      <div class="balance-bottom">
        <span><Check :size="15" />{{ paid.length }} sample invoices paid</span
        ><button @click="emit('invoices')">
          View invoices <ArrowUpRight :size="16" />
        </button>
      </div>
      <div class="balance-decoration" aria-hidden="true"></div>
    </article>
    <article class="card payment-insight">
      <span class="panel-kicker">A CLEARER PICTURE</span>
      <h2>Every payment,<br />in its place.</h2>
      <p>
        This view reflects the paid invoices in the demo. Explore billing for
        pending and overdue amounts.
      </p>
      <span class="payment-insight-label"
        >Average payment<strong>{{ money(total / paid.length) }}</strong></span
      >
    </article>
  </div>
  <section class="card payment-transactions">
    <div class="card-header">
      <div>
        <span class="panel-kicker">MONEY IN</span>
        <h2>Payment history</h2>
        <p>Sample transactions for exploring the dashboard.</p>
      </div>
      <v-btn color="primary" variant="tonal" size="small" @click="download"
        ><Download :size="14" class="mr-2" />Export CSV</v-btn
      >
    </div>
    <div v-for="invoice in paid" :key="invoice.id" class="payment-transaction">
      <span class="payment-direction"><ArrowDownLeft :size="21" /></span>
      <div>
        <h3>{{ invoice.client }}</h3>
        <p>{{ invoice.project }} <span>·</span> {{ invoice.id }}</p>
      </div>
      <div class="transaction-total">
        <strong>+{{ money(invoice.amount) }}</strong
        ><span>Received · CLP</span>
      </div>
    </div>
    <div class="payment-sample-note">
      Demo data only. No payments are collected or processed here.
    </div>
  </section>
</template>
