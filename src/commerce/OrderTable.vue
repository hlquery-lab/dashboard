<script setup>
import { useCommerce } from "./store.js";
import { money } from "../utils/currency.js";
import { orderTotal, dateLabel, initials } from "./data.js";
import { ArrowUpRight, ShoppingBag } from "lucide-vue-next";
defineProps({ orders: Array });
defineEmits(["order"]);
const { customer } = useCommerce();
</script>
<template>
  <div class="c-table-scroll">
    <table class="c-table c-orders-table">
      <thead>
        <tr>
          <th>Order</th>
          <th>Customer</th>
          <th>Date</th>
          <th>Payment</th>
          <th>Fulfillment</th>
          <th class="c-number">Total</th>
          <th><span class="sr-only">Details</span></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>
            <button class="c-order-link" @click="$emit('order', order)">
              #{{ order.id.replace("ORD-", "") }}</button
            ><small
              >{{
                order.items.reduce((s, i) => s + i.quantity, 0)
              }}
              items</small
            >
          </td>
          <td>
            <div class="c-person">
              <span class="c-avatar">{{
                initials(customer(order.customerId)?.name || "Guest")
              }}</span
              ><span
                ><strong>{{ customer(order.customerId)?.name }}</strong
                ><small>{{ customer(order.customerId)?.email }}</small></span
              >
            </div>
          </td>
          <td>{{ dateLabel(order.date) }}</td>
          <td>
            <span class="c-status" :class="order.payment.toLowerCase()"
              ><i></i>{{ order.payment }}</span
            >
          </td>
          <td>
            <span class="c-status" :class="order.status.toLowerCase()">{{
              order.status
            }}</span>
          </td>
          <td class="c-number c-amount">{{ money(orderTotal(order)) }}</td>
          <td>
            <button
              class="c-icon-button"
              :aria-label="`View order ${order.id}`"
              @click="$emit('order', order)"
            >
              <ArrowUpRight :size="16" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-if="!orders.length" class="c-empty">
    <ShoppingBag :size="28" />
    <h3>No orders to show</h3>
    <p>Try a different search or filter.</p>
  </div>
</template>
