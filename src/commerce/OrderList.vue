<script setup>
import { computed, ref, watch } from "vue";
import {
  Search,
  Download,
  ShoppingBag,
  PackageCheck,
  Truck,
  Clock3,
  ChevronLeft,
  ChevronRight,
} from "lucide-vue-next";
import { useCommerce } from "./store.js";
import OrderTable from "./OrderTable.vue";
const props = defineProps({ fulfillment: Boolean });
defineEmits(["order", "create"]);
const { state, customer, exportOrders } = useCommerce();
const query = ref(""),
  filter = ref("All orders"),
  payment = ref("All payments"),
  page = ref(1);
const base = computed(() =>
  props.fulfillment
    ? state.orders.filter(
        (o) =>
          o.payment === "Paid" &&
          ["Unfulfilled", "Processing", "Shipped"].includes(o.status),
      )
    : state.orders,
);
const filters = computed(() =>
  props.fulfillment
    ? ["All orders", "Unfulfilled", "Processing", "Shipped"]
    : [
        "All orders",
        "Unfulfilled",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
);
const filtered = computed(() =>
  base.value.filter(
    (o) =>
      (filter.value === "All orders" || o.status === filter.value) &&
      (payment.value === "All payments" || o.payment === payment.value) &&
      `${o.id} ${customer(o.customerId)?.name} ${customer(o.customerId)?.email} ${o.items.map((l) => l.name).join(" ")}`
        .toLowerCase()
        .includes(query.value.trim().toLowerCase()),
  ),
);
const pages = computed(() => Math.max(1, Math.ceil(filtered.value.length / 8)));
const rows = computed(() =>
  filtered.value.slice((page.value - 1) * 8, page.value * 8),
);
watch([query, filter, payment], () => (page.value = 1));
watch(pages, (value) => (page.value = Math.min(page.value, value)));
</script>
<template>
  <section class="c-order-summary">
    <article
      v-for="[label, icon, status] in [
        ['All orders', ShoppingBag, null],
        ['To prepare', Clock3, 'Unfulfilled'],
        ['Packing', PackageCheck, 'Processing'],
        ['On the way', Truck, 'Shipped'],
      ]"
      :key="label"
    >
      <span class="c-summary-icon"><component :is="icon" :size="20" /></span>
      <div>
        <span>{{ label }}</span
        ><strong>{{
          base.filter((o) => !status || o.status === status).length
        }}</strong>
      </div>
    </article>
  </section>
  <section class="card c-order-list">
    <div class="c-filter-tabs" aria-label="Filter by fulfillment">
      <button
        v-for="status in filters"
        :key="status"
        :class="{ active: filter === status }"
        :aria-pressed="filter === status"
        @click="filter = status"
      >
        {{ status
        }}<span>{{
          base.filter((o) => status === "All orders" || o.status === status)
            .length
        }}</span>
      </button>
    </div>
    <div class="c-table-toolbar">
      <label class="c-search"
        ><Search :size="16" /><input
          v-model="query"
          type="search"
          aria-label="Search orders"
          placeholder="Search orders or customers…" /></label
      ><select
        v-if="!fulfillment"
        v-model="payment"
        class="c-select"
        aria-label="Payment status"
      >
        <option>All payments</option>
        <option>Paid</option>
        <option>Pending</option>
        <option>Refunded</option>
        <option>Voided</option></select
      ><button class="button c-export-button" @click="exportOrders(filtered)">
        <Download :size="15" />Export filtered
      </button>
    </div>
    <OrderTable :orders="rows" @order="$emit('order', $event)" />
    <div v-if="!base.length" class="c-empty">
      <h3>
        {{ fulfillment ? "All caught up!" : "Your first order starts here." }}
      </h3>
      <p>
        {{
          fulfillment
            ? "No paid orders are waiting for fulfillment."
            : "Create an order to see it here."
        }}
      </p>
      <button class="button primary" @click="$emit('create')">
        Create order
      </button>
    </div>
    <div class="c-pagination">
      <span
        >{{ filtered.length ? (page - 1) * 8 + 1 : 0 }}–{{
          Math.min(page * 8, filtered.length)
        }}
        of {{ filtered.length }} orders</span
      >
      <div>
        <button
          :disabled="page <= 1"
          aria-label="Previous page"
          @click="page--"
        >
          <ChevronLeft :size="16" /></button
        ><span>{{ page }} / {{ pages }}</span
        ><button
          :disabled="page >= pages"
          aria-label="Next page"
          @click="page++"
        >
          <ChevronRight :size="16" />
        </button>
      </div>
    </div>
  </section>
</template>
