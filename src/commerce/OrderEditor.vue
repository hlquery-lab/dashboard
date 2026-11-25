<script setup>
import { computed, reactive, ref, watch } from "vue";
import { Plus, Trash2, X, ShoppingBag } from "lucide-vue-next";
import { useCommerce } from "./store.js";
import { money } from "../utils/currency.js";
const props = defineProps({ modelValue: Boolean });
const emit = defineEmits(["update:modelValue", "created"]);
const { state, product, createOrder } = useCommerce();
const form = reactive({
  customerId: "",
  items: [],
  payment: "Paid",
  discountCode: "",
  note: "",
});
const error = ref("");
const available = computed(() =>
  state.products.filter((p) => p.status === "Active" && p.stock > 0),
);
watch(
  () => props.modelValue,
  (value) => {
    if (value) {
      Object.assign(form, {
        customerId: "",
        items: available.value.length
          ? [{ productId: available.value[0].id, quantity: 1 }]
          : [],
        payment: "Paid",
        discountCode: "",
        note: "",
      });
      error.value = "";
    }
  },
);
const subtotal = computed(() =>
  form.items.reduce(
    (s, l) => s + (product(l.productId)?.price || 0) * Number(l.quantity || 0),
    0,
  ),
);
const discount = computed(() =>
  state.discounts.find(
    (d) =>
      d.code === form.discountCode.trim().toUpperCase() &&
      d.active &&
      subtotal.value >= d.minimum,
  ),
);
const discountAmount = computed(() =>
  discount.value
    ? Math.round(subtotal.value * discount.value.percent) / 100
    : 0,
);
function add() {
  const next = available.value.find(
    (p) => !form.items.some((l) => l.productId === p.id),
  );
  if (next) form.items.push({ productId: next.id, quantity: 1 });
}
function submit() {
  try {
    const order = createOrder(form);
    emit("update:modelValue", false);
    emit("created", order);
  } catch (e) {
    error.value = e.message;
  }
}
</script>
<template>
  <v-dialog
    :model-value="modelValue"
    max-width="720"
    aria-label="Create order"
    @update:model-value="emit('update:modelValue', $event)"
    ><v-card class="c-dialog"
      ><form @submit.prevent="submit">
        <header class="c-dialog-heading">
          <div>
            <span class="panel-kicker">A NEW CHECKOUT</span>
            <h2>Create order</h2>
            <p>Add a customer and the things they’ll love.</p>
          </div>
          <button
            type="button"
            class="c-icon-button"
            aria-label="Close create order"
            @click="emit('update:modelValue', false)"
          >
            <X :size="20" />
          </button>
        </header>
        <div class="c-dialog-content">
          <label class="c-field"
            >Customer<select
              v-model="form.customerId"
              aria-label="Customer"
              required
            >
              <option value="" disabled>Select a customer</option>
              <option v-for="c in state.customers" :key="c.id" :value="c.id">
                {{ c.name }} · {{ c.email }}
              </option>
            </select></label
          >
          <div class="c-form-section-heading">
            <h3>Order items</h3>
            <button
              type="button"
              class="c-text-button"
              :disabled="form.items.length >= available.length"
              @click="add"
            >
              <Plus :size="15" />Add item
            </button>
          </div>
          <div
            v-for="(line, i) in form.items"
            :key="i"
            class="c-order-item-editor"
          >
            <label class="c-field"
              >Product<select
                v-model="line.productId"
                required
                @change="line.quantity = 1"
              >
                <option
                  v-for="p in available"
                  :key="p.id"
                  :value="p.id"
                  :disabled="
                    form.items.some((l, n) => n !== i && l.productId === p.id)
                  "
                >
                  {{ p.name }} · {{ money(p.price) }}
                </option>
              </select></label
            ><label class="c-field c-quantity"
              >Qty<input
                v-model.number="line.quantity"
                type="number"
                min="1"
                step="1"
                :max="product(line.productId)?.stock"
                required /></label
            ><strong>{{
              money(
                (product(line.productId)?.price || 0) * (line.quantity || 0),
              )
            }}</strong
            ><button
              type="button"
              class="c-icon-button c-danger"
              :aria-label="`Remove item ${i + 1}`"
              @click="form.items.splice(i, 1)"
            >
              <Trash2 :size="16" /></button
            ><small>{{ product(line.productId)?.stock }} units available</small>
          </div>
          <p v-if="!available.length" class="c-form-error">
            No products are available. Publish a product and restock it first.
          </p>
          <p v-else-if="!form.items.length" class="c-empty-note">
            Add at least one product to create an order.
          </p>
          <div class="c-form-grid">
            <label class="c-field"
              >Payment status<select
                v-model="form.payment"
                aria-label="Payment status"
              >
                <option>Paid</option>
                <option>Pending</option>
              </select></label
            ><label class="c-field"
              >Discount code<input
                v-model="form.discountCode"
                placeholder="e.g. WELCOME10"
                maxlength="24"
            /></label>
          </div>
          <label class="c-field"
            >Order note <span class="muted">(optional)</span
            ><textarea
              v-model="form.note"
              rows="2"
              maxlength="500"
              placeholder="Delivery instructions or a note for your team"
            ></textarea>
          </label>
          <dl class="c-order-totals">
            <div>
              <dt>Subtotal</dt>
              <dd>{{ money(subtotal) }}</dd>
            </div>
            <div>
              <dt>Discount</dt>
              <dd>−{{ money(discountAmount) }}</dd>
            </div>
            <div>
              <dt>Shipping</dt>
              <dd>Free</dd>
            </div>
            <div class="c-total-row">
              <dt>Total (USD)</dt>
              <dd>{{ money(subtotal - discountAmount) }}</dd>
            </div>
          </dl>
          <p class="c-demo-note">
            Sample order only. Stock is reserved when you create the order. No
            card is charged.
          </p>
          <p v-if="error" class="c-form-error" role="alert">{{ error }}</p>
        </div>
        <footer class="c-dialog-footer">
          <button
            type="button"
            class="button"
            @click="emit('update:modelValue', false)"
          >
            Cancel</button
          ><button
            type="submit"
            class="button primary"
            :disabled="!form.items.length"
          >
            <ShoppingBag :size="16" />Create order
          </button>
        </footer>
      </form></v-card
    ></v-dialog
  >
</template>
