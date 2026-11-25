<script setup>
import { computed, reactive, ref } from "vue";
import {
  Search,
  Users,
  UserRoundCheck,
  Wallet,
  Download,
  X,
  Pencil,
  Mail,
  MapPin,
  ArrowUpRight,
} from "lucide-vue-next";
import { useCommerce } from "./store.js";
import { orderTotal, initials, exportCsv } from "./data.js";
import { money } from "../utils/currency.js";
import OrderTable from "./OrderTable.vue";
const emit = defineEmits(["order", "notify"]);
const { state, saveCustomer } = useCommerce();
const query = ref(""),
  filter = ref("All customers"),
  selected = ref(null),
  editing = ref(false),
  error = ref("");
const form = reactive({});
const orders = (id) =>
  state.orders.filter((o) => o.customerId === id && o.status !== "Cancelled");
const spend = (id) =>
  orders(id)
    .filter((o) => o.payment === "Paid")
    .reduce((s, o) => s + orderTotal(o), 0);
const returning = computed(() =>
  state.customers.filter((c) => orders(c.id).length > 1),
);
const filtered = computed(() =>
  state.customers.filter(
    (c) =>
      `${c.name} ${c.email} ${c.city}`
        .toLowerCase()
        .includes(query.value.trim().toLowerCase()) &&
      (filter.value === "All customers" ||
        (filter.value === "Returning" && orders(c.id).length > 1) ||
        (filter.value === "First-time" && orders(c.id).length === 1) ||
        (filter.value === "No orders" && orders(c.id).length === 0)),
  ),
);
function create() {
  Object.assign(form, {
    id: undefined,
    name: "",
    email: "",
    city: "",
    country: "United States",
    address: "",
  });
  error.value = "";
  editing.value = true;
}
function edit() {
  Object.assign(form, selected.value);
  selected.value = null;
  error.value = "";
  editing.value = true;
}
function submit() {
  try {
    const c = saveCustomer(form);
    editing.value = false;
    selected.value = c;
    emit("notify", "Customer saved");
  } catch (e) {
    error.value = e.message;
  }
}
function openOrder(order) {
  selected.value = null;
  emit("order", order);
}
function download() {
  exportCsv("hlquery-customers.csv", [
    ["Customer", "Email", "City", "Country", "Orders", "Total spent USD"],
    ...filtered.value.map((c) => [
      c.name,
      c.email,
      c.city,
      c.country,
      orders(c.id).length,
      spend(c.id).toFixed(2),
    ]),
  ]);
}
defineExpose({ create });
</script>
<template>
  <section class="c-catalog-summary">
    <article>
      <span class="c-summary-icon"><Users :size="20" /></span>
      <div>
        <span>Total customers</span
        ><strong>{{ state.customers.length }}</strong>
      </div>
      <small>Your growing community</small>
    </article>
    <article>
      <span class="c-summary-icon green"><UserRoundCheck :size="20" /></span>
      <div>
        <span>Returning customers</span><strong>{{ returning.length }}</strong>
      </div>
      <small>More than one order</small>
    </article>
    <article>
      <span class="c-summary-icon amber"><Wallet :size="20" /></span>
      <div>
        <span>Customer lifetime sales</span
        ><strong>{{
          money(state.customers.reduce((s, c) => s + spend(c.id), 0))
        }}</strong>
      </div>
      <small>Paid orders · USD</small>
    </article>
  </section>
  <section class="card">
    <div class="c-table-toolbar">
      <label class="c-search"
        ><Search :size="16" /><input
          v-model="query"
          type="search"
          aria-label="Search customers"
          placeholder="Search customers or email…" /></label
      ><select v-model="filter" class="c-select" aria-label="Customer segment">
        <option>All customers</option>
        <option>Returning</option>
        <option>First-time</option>
        <option>No orders</option></select
      ><button class="button" @click="download">
        <Download :size="15" />Export customers
      </button>
    </div>
    <div class="c-table-scroll">
      <table class="c-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Location</th>
            <th>Segment</th>
            <th class="c-number">Orders</th>
            <th class="c-number">Total spent (USD)</th>
            <th><span class="sr-only">Details</span></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in filtered" :key="c.id">
            <td>
              <button class="c-person c-customer-link" @click="selected = c">
                <span class="c-avatar">{{ initials(c.name) }}</span
                ><span
                  ><strong>{{ c.name }}</strong
                  ><small>{{ c.email }}</small></span
                >
              </button>
            </td>
            <td>
              {{ c.city || "—" }}<small>{{ c.country }}</small>
            </td>
            <td>
              <span
                class="c-status"
                :class="orders(c.id).length > 1 ? 'paid' : 'draft'"
                >{{
                  orders(c.id).length > 1
                    ? "Returning"
                    : orders(c.id).length === 1
                      ? "First-time"
                      : "No orders"
                }}</span
              >
            </td>
            <td class="c-number">{{ orders(c.id).length }}</td>
            <td class="c-number c-amount">{{ money(spend(c.id)) }}</td>
            <td>
              <button
                class="c-icon-button"
                :aria-label="`View customer ${c.name}`"
                @click="selected = c"
              >
                <ArrowUpRight :size="16" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="!filtered.length" class="c-empty">
      <Users :size="28" />
      <h3>No customers found</h3>
      <p>Try another search or add a customer.</p>
    </div>
    <div class="c-catalog-footer">
      <span>{{ filtered.length }} customers</span
      ><span>Cancelled orders are excluded from customer totals.</span>
    </div>
  </section>
  <v-dialog
    :model-value="!!selected"
    max-width="850"
    aria-label="Customer details"
    @update:model-value="!$event && (selected = null)"
    ><v-card v-if="selected" class="c-dialog"
      ><header class="c-dialog-heading">
        <div class="c-person">
          <span class="c-avatar c-avatar-large">{{
            initials(selected.name)
          }}</span>
          <div>
            <span class="panel-kicker">CUSTOMER PROFILE</span>
            <h2>{{ selected.name }}</h2>
            <p>{{ selected.email }}</p>
          </div>
        </div>
        <button
          class="c-icon-button"
          aria-label="Close customer details"
          @click="selected = null"
        >
          <X :size="20" />
        </button>
      </header>
      <div class="c-dialog-content">
        <div class="c-customer-profile">
          <div>
            <span>Total spent</span
            ><strong>{{ money(spend(selected.id)) }}</strong>
          </div>
          <div>
            <span>Orders</span><strong>{{ orders(selected.id).length }}</strong>
          </div>
          <div>
            <span>Location</span
            ><strong>{{ selected.city || "Not provided" }}</strong>
          </div>
        </div>
        <p class="c-address">
          <MapPin :size="15" />{{ selected.address || "No address provided" }}
        </p>
        <h3 class="c-section-title">Order history</h3>
      </div>
      <OrderTable
        :orders="state.orders.filter((o) => o.customerId === selected.id)"
        @order="openOrder"
      />
      <footer class="c-dialog-footer">
        <button class="button" @click="edit">
          <Pencil :size="15" />Edit customer</button
        ><button class="button primary" @click="selected = null">Done</button>
      </footer></v-card
    ></v-dialog
  >
  <v-dialog v-model="editing" max-width="600" aria-label="Customer editor"
    ><v-card class="c-dialog"
      ><form @submit.prevent="submit">
        <header class="c-dialog-heading">
          <div>
            <span class="panel-kicker">YOUR CUSTOMER COMMUNITY</span>
            <h2>{{ form.id ? "Edit customer" : "Add customer" }}</h2>
          </div>
          <button
            type="button"
            class="c-icon-button"
            aria-label="Close customer editor"
            @click="editing = false"
          >
            <X :size="20" />
          </button>
        </header>
        <div class="c-dialog-content">
          <label class="c-field"
            >Customer name<input
              v-model="form.name"
              required
              maxlength="80" /></label
          ><label class="c-field"
            >Email<input
              v-model="form.email"
              type="email"
              required
              maxlength="120"
          /></label>
          <div class="c-form-grid">
            <label class="c-field"
              >City<input v-model="form.city" maxlength="80" /></label
            ><label class="c-field"
              >Country<input v-model="form.country" maxlength="80"
            /></label>
          </div>
          <label class="c-field"
            >Shipping address<textarea
              v-model="form.address"
              rows="2"
              maxlength="250"
            ></textarea>
          </label>
          <p class="c-demo-note">
            Customer details are stored in this browser. No email is sent.
          </p>
          <p v-if="error" class="c-form-error" role="alert">{{ error }}</p>
        </div>
        <footer class="c-dialog-footer">
          <button type="button" class="button" @click="editing = false">
            Cancel</button
          ><button type="submit" class="button primary">Save customer</button>
        </footer>
      </form></v-card
    ></v-dialog
  >
</template>
