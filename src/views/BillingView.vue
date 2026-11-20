<script setup>
import { invoices } from "../data/invoices.js";
import { computed, ref } from "vue";
import {
  ArrowDownToLine,
  CreditCard,
  CheckCheck,
  Clock3,
  FileText,
} from "lucide-vue-next";
const query = ref(""),
  status = ref("All statuses"),
  selected = ref(null);
const money = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(amount);
const filtered = computed(() =>
  invoices.filter(
    (i) =>
      (status.value === "All statuses" || i.status === status.value) &&
      `${i.client} ${i.id} ${i.project}`
        .toLowerCase()
        .includes(query.value.toLowerCase()),
  ),
);
const headers = [
  { title: "Invoice", key: "id" },
  { title: "Client / project", key: "client" },
  { title: "Due date", key: "due" },
  { title: "Amount (CLP)", key: "amount" },
  { title: "Status", key: "status" },
  { title: "", key: "actions", sortable: false },
];
const tone = (s) =>
  s === "Paid" ? "success" : s === "Overdue" ? "error" : "warning";
function download(invoice) {
  const text = `DEMO INVOICE — SAMPLE DATA\n${invoice.id}\n\nClient: ${invoice.client}\nProject: ${invoice.project}\nIssued: ${invoice.date}\nDue: ${invoice.due}\nTotal: ${money(invoice.amount)} CLP\nStatus: ${invoice.status}\n\nFor demonstration only. This is not a tax invoice or payment request.\n`;
  const url = URL.createObjectURL(
    new Blob([text], { type: "text/plain;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = `${invoice.id}-demo.txt`;
  a.click();
  URL.revokeObjectURL(url);
}
</script>
<template>
  <div class="billing-notice">
    <FileText :size="17" /><span
      >Sample invoices to explore the experience. No payments are
      processed.</span
    >
  </div>
  <section class="billing-stats">
    <article
      v-for="stat in [
        {
          label: 'Total invoiced',
          status: null,
          icon: CreditCard,
          color: 'violet',
        },
        {
          label: 'Payments received',
          status: 'Paid',
          icon: CheckCheck,
          color: 'green',
        },
        {
          label: 'Awaiting payment',
          status: 'Pending',
          icon: Clock3,
          color: 'orange',
        },
      ]"
      :key="stat.label"
      class="card billing-stat"
    >
      <span class="stat-icon" :class="stat.color"
        ><component :is="stat.icon" :size="20"
      /></span>
      <p>{{ stat.label }}</p>
      <strong>{{
        money(
          invoices
            .filter((i) => !stat.status || i.status === stat.status)
            .reduce((sum, i) => sum + i.amount, 0),
        )
      }}</strong
      ><small>CLP · Sample data</small>
    </article>
  </section>
  <section class="card billing-table">
    <div class="card-header">
      <div>
        <span class="panel-kicker">BILLING CENTER</span>
        <h2>Invoices</h2>
        <p>A clear picture of every client payment.</p>
      </div>
      <span class="count-pill">{{ invoices.length }}</span>
    </div>
    <div class="module-toolbar">
      <v-text-field
        v-model="query"
        label="Search invoices"
        hide-details
        clearable
        @click:clear="query = ''"
      /><v-select
        v-model="status"
        :items="['All statuses', 'Paid', 'Pending', 'Overdue']"
        label="Status"
        hide-details
      />
    </div>
    <v-data-table
      :headers="headers"
      :items="filtered"
      :items-per-page="5"
      no-data-text="No invoices match your filters."
      class="invoice-data"
    >
      <template #item.id="{ item }"
        ><button class="invoice-link" @click="selected = item">
          {{ item.id }}
        </button></template
      >
      <template #item.client="{ item }"
        ><div class="invoice-client">
          <strong>{{ item.client }}</strong
          ><small>{{ item.project }}</small>
        </div></template
      >
      <template #item.amount="{ item }"
        ><strong>{{ money(item.amount) }}</strong></template
      >
      <template #item.status="{ item }"
        ><v-chip :color="tone(item.status)" size="small" variant="tonal">{{
          item.status
        }}</v-chip></template
      >
      <template #item.actions="{ item }"
        ><v-btn
          size="small"
          variant="text"
          color="primary"
          @click="selected = item"
          >View</v-btn
        ></template
      >
    </v-data-table>
  </section>
  <v-dialog
    :model-value="!!selected"
    max-width="540"
    @update:model-value="
      (value) => {
        if (!value) selected = null;
      }
    "
  >
    <v-card v-if="selected" class="invoice-dialog" title="Invoice details"
      ><v-card-text
        ><div class="invoice-heading">
          <div>
            <span class="panel-kicker">SAMPLE INVOICE</span>
            <h2>{{ selected.id }}</h2>
          </div>
          <v-chip :color="tone(selected.status)">{{ selected.status }}</v-chip>
        </div>
        <dl class="invoice-details">
          <div>
            <dt>Client</dt>
            <dd>{{ selected.client }}</dd>
          </div>
          <div>
            <dt>Project</dt>
            <dd>{{ selected.project }}</dd>
          </div>
          <div>
            <dt>Issued</dt>
            <dd>{{ selected.date }}</dd>
          </div>
          <div>
            <dt>Due date</dt>
            <dd>{{ selected.due }}</dd>
          </div>
          <div>
            <dt>Total (CLP)</dt>
            <dd class="invoice-total">{{ money(selected.amount) }}</dd>
          </div>
        </dl>
        <p class="settings-note">
          For demonstration only. This is not a tax invoice or payment request.
        </p>
        <div class="dialog-actions">
          <v-btn variant="text" @click="selected = null">Close</v-btn
          ><v-btn color="primary" @click="download(selected)"
            ><ArrowDownToLine :size="16" class="mr-2" />Download sample</v-btn
          >
        </div></v-card-text
      ></v-card
    >
  </v-dialog>
</template>
