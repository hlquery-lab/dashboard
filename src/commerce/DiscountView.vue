<script setup>
import { computed, reactive, ref } from "vue";
import { TicketPercent, Plus, X, Search, ArrowUpRight } from "lucide-vue-next";
import { useCommerce } from "./store.js";
import { money } from "../utils/currency.js";
const emit = defineEmits(["notify"]);
const { state, saveDiscount, log } = useCommerce();
const editing = ref(false),
  error = ref(""),
  query = ref("");
const form = reactive({ code: "", percent: 10, minimum: 0 });
const filtered = computed(() =>
  state.discounts.filter((d) =>
    d.code.toLowerCase().includes(query.value.trim().toLowerCase()),
  ),
);
const usage = (code) =>
  state.orders.filter(
    (o) => o.discountCode === code && o.status !== "Cancelled",
  ).length;
function create() {
  Object.assign(form, { code: "", percent: 10, minimum: 0 });
  error.value = "";
  editing.value = true;
}
function submit() {
  try {
    saveDiscount(form);
    editing.value = false;
    emit("notify", "Discount code created");
  } catch (e) {
    error.value = e.message;
  }
}
function toggle(d) {
  d.active = !d.active;
  log(d.active ? "Discount activated" : "Discount paused", d.code);
  emit("notify", d.active ? "Discount activated" : "Discount paused");
}
defineExpose({ create });
</script>
<template>
  <section class="c-discount-banner">
    <span class="c-discount-banner-icon"><TicketPercent :size="30" /></span>
    <div>
      <span class="panel-kicker">GIVE THEM A REASON TO COME BACK</span>
      <h2>A good offer goes a long way.</h2>
      <p>
        Create percentage discounts for your customers. Apply an active code
        when creating an order.
      </p>
    </div>
    <div>
      <strong>{{ state.discounts.filter((d) => d.active).length }}</strong
      ><span>active promotions</span>
    </div>
  </section>
  <section class="card">
    <div class="c-table-toolbar">
      <label class="c-search"
        ><Search :size="16" /><input
          v-model="query"
          aria-label="Search discounts"
          type="search"
          placeholder="Search discount codes…" /></label
      ><span class="c-empty-note">One code per order · USD minimums</span>
    </div>
    <div class="c-table-scroll">
      <table class="c-table">
        <thead>
          <tr>
            <th>Discount code</th>
            <th>Offer</th>
            <th>Minimum order</th>
            <th>Uses</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="d in filtered" :key="d.id">
            <td>
              <span class="c-discount-code"
                ><TicketPercent :size="16" />{{ d.code }}</span
              >
            </td>
            <td class="c-amount">{{ d.percent }}% off</td>
            <td>{{ d.minimum ? money(d.minimum) : "No minimum" }}</td>
            <td>{{ usage(d.code) }} orders</td>
            <td>
              <span class="c-status" :class="d.active ? 'paid' : 'draft'">{{
                d.active ? "Active" : "Paused"
              }}</span>
            </td>
            <td>
              <button
                class="c-text-button"
                :aria-label="`${d.active ? 'Pause' : 'Activate'} ${d.code}`"
                @click="toggle(d)"
              >
                {{ d.active ? "Pause" : "Activate" }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="!filtered.length" class="c-empty">
      <TicketPercent :size="28" />
      <h3>No discounts found</h3>
      <p>Create a new code to give customers a little extra.</p>
      <button class="button primary" @click="create">Create discount</button>
    </div>
  </section>
  <v-dialog v-model="editing" max-width="520" aria-label="Create discount"
    ><v-card class="c-dialog"
      ><form @submit.prevent="submit">
        <header class="c-dialog-heading">
          <div>
            <span class="panel-kicker">A LITTLE SOMETHING EXTRA</span>
            <h2>Create discount</h2>
          </div>
          <button
            type="button"
            class="c-icon-button"
            aria-label="Close discount editor"
            @click="editing = false"
          >
            <X :size="20" />
          </button>
        </header>
        <div class="c-dialog-content">
          <label class="c-field"
            >Discount code<input
              v-model="form.code"
              required
              minlength="3"
              maxlength="24"
              pattern="[A-Za-z0-9_-]{3,24}"
              placeholder="e.g. HELLO20"
          /></label>
          <div class="c-form-grid">
            <label class="c-field"
              >Percentage off<input
                v-model.number="form.percent"
                required
                type="number"
                min="1"
                max="100"
                step="1" /></label
            ><label class="c-field"
              >Minimum order (USD)<input
                v-model.number="form.minimum"
                required
                type="number"
                min="0"
                max="999999"
                step="0.01"
            /></label>
          </div>
          <div class="c-discount-preview">
            <TicketPercent :size="24" /><strong
              >{{ form.percent || 0 }}% off</strong
            ><span>{{
              form.minimum
                ? "on orders from " + money(form.minimum)
                : "on any order"
            }}</span>
          </div>
          <p class="c-demo-note">
            This code becomes active immediately. It applies to the product
            subtotal before shipping.
          </p>
          <p v-if="error" class="c-form-error" role="alert">{{ error }}</p>
        </div>
        <footer class="c-dialog-footer">
          <button type="button" class="button" @click="editing = false">
            Cancel</button
          ><button type="submit" class="button primary">Create discount</button>
        </footer>
      </form></v-card
    ></v-dialog
  >
</template>
