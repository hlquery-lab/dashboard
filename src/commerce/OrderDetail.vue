<script setup>
import { computed, ref, watch } from "vue";
import {
  X,
  Download,
  Truck,
  Package,
  MapPin,
  Mail,
  Check,
  ArrowRight,
} from "lucide-vue-next";
import { useCommerce } from "./store.js";
import { money } from "../utils/currency.js";
import { orderTotal, dateLabel, downloadInvoice } from "./data.js";
import ProductArt from "./ProductArt.vue";
const props = defineProps({ order: Object });
const emit = defineEmits(["close", "notify"]);
const { customer, product, updateOrder } = useCommerce();
const person = computed(() => customer(props.order?.customerId));
const error = ref(""),
  confirmCancel = ref(false);
watch(
  () => props.order,
  () => {
    error.value = "";
    confirmCancel.value = false;
  },
);
const steps = ["Unfulfilled", "Processing", "Shipped", "Delivered"];
const nextAction = computed(() =>
  props.order?.payment === "Pending" && props.order?.status !== "Cancelled"
    ? ["paid", "Mark as paid"]
    : props.order?.payment !== "Paid"
      ? null
      : props.order?.status === "Unfulfilled"
        ? ["process", "Start packing"]
        : props.order?.status === "Processing"
          ? ["ship", "Mark as shipped"]
          : props.order?.status === "Shipped"
            ? ["deliver", "Mark as delivered"]
            : null,
);
function action(value) {
  try {
    updateOrder(props.order.id, value);
    emit("notify", "Order and store totals updated");
    confirmCancel.value = false;
  } catch (e) {
    error.value = e.message;
  }
}
</script>
<template>
  <v-dialog
    :model-value="!!order"
    max-width="780"
    aria-label="Order details"
    @update:model-value="!$event && emit('close')"
    ><v-card v-if="order" class="c-dialog"
      ><header class="c-dialog-heading">
        <div>
          <span class="panel-kicker">ORDER DETAILS</span>
          <h2>#{{ order.id.replace("ORD-", "") }}</h2>
          <p>{{ dateLabel(order.date) }} · {{ order.channel }}</p>
        </div>
        <button
          class="c-icon-button"
          aria-label="Close order details"
          @click="emit('close')"
        >
          <X :size="20" />
        </button>
      </header>
      <div class="c-dialog-content">
        <div class="c-detail-status">
          <span class="c-status" :class="order.payment.toLowerCase()"
            ><i></i>{{ order.payment }}</span
          ><span class="c-status" :class="order.status.toLowerCase()">{{
            order.status
          }}</span
          ><span>All amounts in USD</span>
        </div>
        <div
          v-if="order.status !== 'Cancelled'"
          class="c-fulfillment-steps"
          aria-label="Fulfillment progress"
        >
          <span
            v-for="(step, i) in steps"
            :key="step"
            :class="{ done: steps.indexOf(order.status) >= i }"
            ><i
              ><Check
                v-if="steps.indexOf(order.status) > i"
                :size="12"
              /><template v-else>{{ i + 1 }}</template></i
            >{{ step }}</span
          >
        </div>
        <div class="c-detail-items">
          <article v-for="line in order.items" :key="line.productId">
            <ProductArt :product="product(line.productId) || { art: 'bag' }" />
            <div>
              <strong>{{ line.name }}</strong
              ><small>{{ line.quantity }} × {{ money(line.price) }}</small>
            </div>
            <strong>{{ money(line.price * line.quantity) }}</strong>
          </article>
        </div>
        <dl class="c-order-totals">
          <div>
            <dt>Subtotal</dt>
            <dd>
              {{
                money(order.items.reduce((s, l) => s + l.price * l.quantity, 0))
              }}
            </dd>
          </div>
          <div>
            <dt>
              Discount
              <small v-if="order.discountCode">{{ order.discountCode }}</small>
            </dt>
            <dd>−{{ money(order.discount) }}</dd>
          </div>
          <div>
            <dt>Shipping</dt>
            <dd>{{ order.shipping ? money(order.shipping) : "Free" }}</dd>
          </div>
          <div class="c-total-row">
            <dt>Total (USD)</dt>
            <dd>{{ money(orderTotal(order)) }}</dd>
          </div>
        </dl>
        <div class="c-detail-columns">
          <section>
            <span class="panel-kicker">CUSTOMER</span>
            <h3>{{ person?.name }}</h3>
            <p><Mail :size="14" />{{ person?.email }}</p>
            <p>
              <MapPin :size="14" />{{
                person?.address ||
                [person?.city, person?.country].filter(Boolean).join(", ") ||
                "No address provided"
              }}
            </p>
          </section>
          <section>
            <span class="panel-kicker">ORDER NOTE</span>
            <p>{{ order.note || "No note added to this order." }}</p>
            <span class="c-demo-note"
              >Demo order. Payment and shipping actions update this browser
              only.</span
            >
          </section>
        </div>
        <p v-if="error" class="c-form-error" role="alert">{{ error }}</p>
        <div v-if="confirmCancel" class="c-cancel-confirm">
          <p>
            Cancel this order? Stock will be restored. A paid order will be
            marked refunded in this demo.
          </p>
          <button class="button c-danger-button" @click="action('cancel')">
            Confirm cancellation</button
          ><button class="button" @click="confirmCancel = false">
            Keep order
          </button>
        </div>
      </div>
      <footer class="c-dialog-footer">
        <button class="button" @click="downloadInvoice(order, person)">
          <Download :size="15" />Invoice</button
        ><button
          v-if="
            ['Unfulfilled', 'Processing'].includes(order.status) &&
            !confirmCancel
          "
          class="c-text-button c-danger"
          @click="confirmCancel = true"
        >
          Cancel order</button
        ><button
          v-if="nextAction"
          class="button primary"
          @click="action(nextAction[0])"
        >
          {{ nextAction[1] }}<ArrowRight :size="15" /></button
        ><button v-else class="button primary" @click="emit('close')">
          Done
        </button>
      </footer></v-card
    ></v-dialog
  >
</template>
