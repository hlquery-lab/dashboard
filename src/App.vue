<script setup>
import {
  computed,
  defineAsyncComponent,
  ref,
  onMounted,
  onBeforeUnmount,
  nextTick,
  watch,
} from "vue";
import { useStorage } from "@vueuse/core";
import {
  Search,
  Bell,
  ChevronDown,
  ChevronRight,
  Plus,
  Download,
  PanelLeftClose,
  Menu,
  Sun,
  Moon,
  ExternalLink,
  Settings2,
  Store,
  ShoppingBag,
  Package,
  ArrowUpRight,
  Check,
  X,
  Truck,
} from "lucide-vue-next";
import SidebarNavigation from "./components/SidebarNavigation.vue";
import CommandPalette from "./components/CommandPalette.vue";
const SettingsView = defineAsyncComponent(
  () => import("./views/SettingsView.vue"),
);
const AppearanceView = defineAsyncComponent(
  () => import("./views/AppearanceView.vue"),
);
const CommerceDashboard = defineAsyncComponent(
  () => import("./commerce/CommerceDashboard.vue"),
);
const OrderList = defineAsyncComponent(
  () => import("./commerce/OrderList.vue"),
);
import OrderDetail from "./commerce/OrderDetail.vue";
import OrderEditor from "./commerce/OrderEditor.vue";
const CatalogView = defineAsyncComponent(
  () => import("./commerce/CatalogView.vue"),
);
const CustomerView = defineAsyncComponent(
  () => import("./commerce/CustomerView.vue"),
);
const DiscountView = defineAsyncComponent(
  () => import("./commerce/DiscountView.vue"),
);
const FinanceView = defineAsyncComponent(
  () => import("./commerce/FinanceView.vue"),
);
import { createCommerce } from "./commerce/store.js";
import { navigationPages, pageGroups } from "./data/navigation.js";
import { dateLabel, demoDate } from "./commerce/data.js";
const commerce = createCommerce();
const { state, lowStock, unfulfilled } = commerce;
const aliases = {
  Projects: "Orders",
  Board: "Fulfillment",
  Clients: "Customers",
  Billing: "Invoices",
  Reports: "Analytics",
  Charts: "Analytics",
  Team: "Customers",
  Calendar: "Orders",
  Milestones: "Fulfillment",
  Workload: "Fulfillment",
  Tasks: "Orders",
  Goals: "Analytics",
  Notes: "Activity",
  Files: "Invoices",
  "Vista general": "Overview",
  Proyectos: "Orders",
  Configuración: "Settings",
  Ayuda: "Help",
};
const pageFromHash = () => {
  let hash;
  try {
    hash = decodeURIComponent(location.hash.slice(1));
  } catch {
    hash = "Overview";
  }
  return aliases[hash] || hash || "Overview";
};
const valid = new Set(navigationPages.map((p) => p.page));
const page = ref(valid.has(pageFromHash()) ? pageFromHash() : "Overview");
const compact = useStorage("hlquery-compact-navigation", false),
  dense = useStorage("hlquery-compact-tables", false),
  dark = useStorage("leopemtn-dark", false);
const contentWidth = useStorage("hlquery-content-width", 1540),
  cardRadius = useStorage("hlquery-card-radius", 11);
const savedName = useStorage("hlquery-store-name", "Everyday Supply");
const storeName = ref(savedName.value),
  menuOpen = ref(false),
  commandOpen = ref(false),
  notifications = ref(false),
  profileOpen = ref(false);
const selectedOrder = ref(null),
  orderCreate = ref(false),
  viewRef = ref(null),
  period = ref("7");
const toast = ref("");
let timer;
function notify(message) {
  toast.value = message;
  clearTimeout(timer);
  timer = setTimeout(() => (toast.value = ""), 3500);
}
function navigate(value) {
  if (!valid.has(value)) return;
  page.value = value;
  location.hash = value;
  menuOpen.value = false;
  notifications.value = false;
  profileOpen.value = false;
  nextTick(() => document.querySelector("#main")?.focus());
}
function hashchange() {
  const value = pageFromHash();
  page.value = valid.has(value) ? value : "Overview";
  menuOpen.value = false;
}
function keydown(event) {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    commandOpen.value = !commandOpen.value;
  }
  if (event.key === "Escape") {
    menuOpen.value = false;
    notifications.value = false;
    profileOpen.value = false;
  }
}
watch(
  page,
  (value) =>
    (document.title = `${value === "Overview" ? "Store overview" : value} · ${savedName.value} · HLQuery`),
  { immediate: true },
);
onMounted(() => {
  window.addEventListener("hashchange", hashchange);
  document.addEventListener("keydown", keydown);
  if (aliases[location.hash.slice(1)])
    history.replaceState(null, "", `#${page.value}`);
});
onBeforeUnmount(() => {
  window.removeEventListener("hashchange", hashchange);
  document.removeEventListener("keydown", keydown);
  clearTimeout(timer);
});
const descriptions = {
  Overview: "Your store, at a glance. Let’s make today a good one.",
  Orders: "Every order, from checkout to your customer’s door.",
  Fulfillment: "Paid orders ready for the next step. Pack, ship, and deliver.",
  Products: "Good products deserve a great storefront. Manage yours here.",
  Inventory: "The right stock, right when you need it.",
  Customers: "Get to know the people who keep coming back.",
  Analytics: "A closer look at what sells, where, and to whom.",
  Discounts: "A little incentive. A new reason to shop.",
  Invoices: "Order receipts and totals, ready to download.",
  Payments: "A clear picture of the money coming into your store.",
  Activity: "The latest orders, stock changes, and store updates.",
  Settings: "The details that make this store yours.",
  Appearance: "A comfortable place to run your business.",
  Help: "Everything you need to explore your ecommerce store.",
};
const primaryLabel = computed(() =>
  ["Overview", "Orders", "Fulfillment"].includes(page.value)
    ? "Create order"
    : ["Products", "Inventory"].includes(page.value)
      ? "Add product"
      : page.value === "Customers"
        ? "Add customer"
        : page.value === "Discounts"
          ? "Create discount"
          : null,
);
function primaryAction() {
  if (["Overview", "Orders", "Fulfillment"].includes(page.value))
    orderCreate.value = true;
  else viewRef.value?.create();
}
const searchOrders = computed(() =>
  state.orders.map((o) => ({
    ...o,
    customerName: commerce.customer(o.customerId)?.name || "",
  })),
);
const delivered = computed(
  () => state.orders.filter((o) => o.status === "Delivered").length,
);
function saveSettings() {
  const name = storeName.value.trim();
  if (!name) return;
  savedName.value = name;
  notify("Store settings saved");
}
const faqs = [
  [
    "How does this demo work?",
    "This is an interactive ecommerce demo. Products, orders, customers, discounts, and preferences are saved in this browser. No payments, emails, or shipments are processed.",
  ],
  [
    "How do I create an order?",
    "Choose Create order, select a customer, and add available products. An active discount can be applied at checkout. Creating the order reserves its stock immediately.",
  ],
  [
    "How does fulfillment work?",
    "A paid order can move from Unfulfilled to Processing, Shipped, and Delivered. Orders awaiting payment must be marked paid first. Cancelling an unshipped order restores stock and marks a paid order as refunded. These are demo state changes.",
  ],
  [
    "How do I update stock?",
    "Open Inventory and choose Restock. Enter the number of units to add. Draft products remain unavailable for new orders until you publish them.",
  ],
  [
    "What currency is used?",
    "Every price, order total, invoice, and financial export is in USD. Order line prices are saved when the order is created, so later product price changes do not alter past orders.",
  ],
  [
    "Why are the dates in November 2026?",
    "The store uses a fixed sample date of November 23, 2026. Analytics filters use this reference date so the demo remains consistent.",
  ],
];
</script>
<template>
  <v-app
    class="workspace commerce"
    :theme="dark ? 'workspaceDark' : 'workspaceLight'"
    :class="{ dark, compact, dense }"
    :style="{
      '--workspace-content-width': contentWidth + 'px',
      '--workspace-card-radius': cardRadius + 'px',
    }"
  >
    <a class="skip-link" href="#main">Skip to content</a>
    <button
      v-if="menuOpen"
      class="backdrop"
      aria-label="Close menu"
      @click="menuOpen = false"
    ></button>
    <aside class="sidebar" :class="{ open: menuOpen }">
      <a href="#Overview" class="brand" @click.prevent="navigate('Overview')"
        ><img class="brand-mark" src="/logo.png" alt="" /><span
          class="brand-word"
          >HLQuery<span class="brand-dot">.</span></span
        ><span class="pro-tag">SHOP</span></a
      >
      <button class="workspace-switch" @click="navigate('Settings')">
        <span class="workspace-symbol"><Store :size="19" /></span
        ><span class="workspace-copy"
          ><strong>{{ savedName }}</strong
          ><small>Demo store · USD</small></span
        ><ChevronDown :size="16" />
      </button>
      <SidebarNavigation
        :page="page"
        :compact="compact && !menuOpen"
        :order-count="state.orders.length"
        :delivered-count="delivered"
        @search="commandOpen = true"
        @navigate="navigate"
        @expand="compact = false"
      />
      <div class="sidebar-bottom">
        <button
          v-if="!compact || menuOpen"
          class="sidebar-create"
          @click="orderCreate = true"
        >
          <Plus :size="17" /><span>Create order</span></button
        ><a class="back-site" href="https://hlquery.com"
          ><ExternalLink :size="16" /><span>HLQuery website</span></a
        >
        <div class="sidebar-footer">
          <span class="status-dot"></span><span>Ecommerce demo</span
          ><button aria-label="Collapse navigation" @click="compact = !compact">
            <PanelLeftClose :size="17" />
          </button>
        </div>
      </div>
    </aside>
    <div class="main-shell">
      <header class="topbar">
        <div class="breadcrumb">
          <button
            class="mobile-menu icon-button"
            aria-label="Open menu"
            @click="menuOpen = true"
          >
            <Menu :size="21" /></button
          ><button
            class="desktop-collapse icon-button"
            aria-label="Toggle compact navigation"
            @click="compact = !compact"
          >
            <Menu :size="19" /></button
          ><span>{{ pageGroups[page] || "Store" }}</span
          ><ChevronRight :size="13" /><strong>{{ page }}</strong>
        </div>
        <div class="topbar-tools">
          <button
            class="global-search command-trigger"
            aria-label="Search store"
            @click="commandOpen = true"
          >
            <Search :size="16" /><span>Search orders, pages…</span
            ><kbd>⌘ K</kbd>
          </button>
          <button
            class="icon-button mobile-search"
            aria-label="Search store"
            @click="commandOpen = true"
          >
            <Search :size="19" />
          </button>
          <button
            class="icon-button"
            :aria-label="
              dark ? 'Switch to light theme' : 'Switch to dark theme'
            "
            @click="dark = !dark"
          >
            <Sun v-if="dark" :size="19" /><Moon v-else :size="18" />
          </button>
          <div class="popover-anchor">
            <button
              class="icon-button notification-button"
              aria-label="Store notifications"
              :aria-expanded="notifications"
              @click="
                notifications = !notifications;
                profileOpen = false;
              "
            >
              <Bell :size="19" /><i
                v-if="lowStock.length || unfulfilled.length"
              ></i>
            </button>
            <div v-if="notifications" class="popover commerce-notifications">
              <strong>Your store needs a little attention</strong
              ><button @click="navigate('Fulfillment')">
                <Truck :size="18" /><span
                  >{{ unfulfilled.length }} orders to fulfill<small
                    >Review the packing queue</small
                  ></span
                ><ChevronRight :size="14" /></button
              ><button @click="navigate('Inventory')">
                <Package :size="18" /><span
                  >{{ lowStock.length }} products running low<small
                    >Review inventory levels</small
                  ></span
                ><ChevronRight :size="14" />
              </button>
            </div>
          </div>
          <span class="toolbar-divider"></span>
          <div class="popover-anchor">
            <button
              class="profile"
              aria-label="Store account"
              :aria-expanded="profileOpen"
              @click="
                profileOpen = !profileOpen;
                notifications = false;
              "
            >
              <span class="avatar profile-avatar">JW</span
              ><span class="profile-copy"
                ><strong>James Wilson</strong><small>Store owner</small></span
              ><ChevronDown :size="14" />
            </button>
            <div v-if="profileOpen" class="popover profile-popover">
              <strong>James Wilson</strong><small>Demo store owner</small
              ><button @click="navigate('Settings')">
                <Settings2 :size="16" />Store settings</button
              ><button @click="navigate('Help')">Demo help</button>
            </div>
          </div>
        </div>
      </header>
      <main id="main" tabindex="-1">
        <div class="page-heading">
          <div>
            <div class="eyebrow">
              {{ savedName.toUpperCase() }} /
              {{ page === "Overview" ? "ECOMMERCE" : page.toUpperCase()
              }}<span class="demo-badge">Demo store</span>
            </div>
            <h1>
              {{ page === "Overview" ? "Store overview" : page
              }}<span
                v-if="page === 'Overview'"
                class="commerce-heading-dot"
              ></span>
            </h1>
            <p>{{ descriptions[page] }}</p>
          </div>
          <div class="heading-actions">
            <select
              v-if="['Overview', 'Analytics'].includes(page)"
              v-model="period"
              class="c-select"
              aria-label="Reporting period"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option></select
            ><button
              v-if="
                ['Overview', 'Orders', 'Analytics', 'Fulfillment'].includes(
                  page,
                )
              "
              class="button"
              @click="
                commerce.exportOrders();
                notify('Orders exported in USD');
              "
            >
              <Download :size="15" />Export</button
            ><button
              v-if="primaryLabel"
              class="button primary"
              @click="primaryAction"
            >
              <Plus :size="16" />{{ primaryLabel }}
            </button>
          </div>
        </div>
        <CommerceDashboard
          v-if="['Overview', 'Analytics'].includes(page)"
          :analytics="page === 'Analytics'"
          :period="Number(period)"
          :dark="dark"
          @navigate="navigate"
          @order="selectedOrder = $event"
        />
        <OrderList
          v-else-if="['Orders', 'Fulfillment'].includes(page)"
          :key="page"
          :fulfillment="page === 'Fulfillment'"
          @order="selectedOrder = $event"
          @create="orderCreate = true"
        />
        <CatalogView
          v-else-if="['Products', 'Inventory'].includes(page)"
          ref="viewRef"
          :key="page"
          :inventory="page === 'Inventory'"
          @notify="notify"
        />
        <CustomerView
          v-else-if="page === 'Customers'"
          ref="viewRef"
          @order="selectedOrder = $event"
          @notify="notify"
        />
        <DiscountView
          v-else-if="page === 'Discounts'"
          ref="viewRef"
          @notify="notify"
        />
        <FinanceView
          v-else-if="['Invoices', 'Payments'].includes(page)"
          :key="page"
          :page="page"
          @order="selectedOrder = $event"
          @notify="notify"
        />
        <SettingsView
          v-else-if="page === 'Settings'"
          v-model:name="storeName"
          :dark="dark"
          :compact="compact"
          :dense="dense"
          :content-width="contentWidth"
          :card-radius="cardRadius"
          :order-count="state.orders.length"
          :delivered-count="delivered"
          @save="saveSettings"
          @theme="dark = $event"
          @navigation="compact = $event"
          @density="dense = $event"
          @width="contentWidth = $event"
          @radius="cardRadius = $event"
          @appearance="navigate('Appearance')"
        />
        <AppearanceView
          v-else-if="page === 'Appearance'"
          :dark="dark"
          :compact="compact"
          :dense="dense"
          @theme="dark = $event"
          @navigation="compact = $event"
          @density="dense = $event"
        />
        <section v-else-if="page === 'Activity'" class="card c-activity">
          <div class="c-panel-heading">
            <div>
              <span class="panel-kicker">STORE TIMELINE</span>
              <h2>Every little update, together.</h2>
            </div>
            <span class="c-badge">{{ state.activity.length }} updates</span>
          </div>
          <article v-for="entry in state.activity" :key="entry.id">
            <span class="c-activity-icon"><Check :size="16" /></span>
            <div>
              <h3>{{ entry.title }}</h3>
              <p>{{ entry.detail }}</p>
            </div>
            <time :datetime="entry.date">{{ dateLabel(entry.date) }}</time>
          </article>
        </section>
        <section v-else class="c-help">
          <div class="c-help-banner">
            <ShoppingBag :size="32" />
            <div>
              <span class="panel-kicker">WELCOME TO YOUR STORE</span>
              <h2>Everything you need to try it out.</h2>
              <p>
                Explore a complete store workflow with sample products,
                customers, and orders.
              </p>
            </div>
          </div>
          <details
            v-for="[question, answer] in faqs"
            :key="question"
            class="card"
          >
            <summary>{{ question }}<Plus :size="16" /></summary>
            <p>{{ answer }}</p>
          </details>
          <button class="button primary" @click="navigate('Overview')">
            Explore your store <ArrowUpRight :size="16" />
          </button>
        </section>
        <footer class="c-footer">
          <span
            >© 2026 HLQuery <span class="c-footer-divider">/</span>
            {{ savedName }}</span
          ><span>Sample data · USD · {{ dateLabel(demoDate) }}</span
          ><button @click="navigate('Help')">
            Demo help <ArrowUpRight :size="12" />
          </button>
        </footer>
      </main>
    </div>
    <CommandPalette
      v-model="commandOpen"
      :orders="searchOrders"
      @navigate="navigate"
      @order="selectedOrder = state.orders.find((o) => o.id === $event.id)"
    />
    <OrderDetail
      :order="selectedOrder"
      @close="selectedOrder = null"
      @notify="notify"
    />
    <OrderEditor
      v-model="orderCreate"
      @created="
        selectedOrder = $event;
        notify('Order created and inventory updated');
      "
    />
    <v-snackbar
      :model-value="!!toast"
      :timeout="3500"
      color="primary"
      @update:model-value="!$event && (toast = '')"
      >{{ toast
      }}<template #actions
        ><v-btn
          variant="text"
          aria-label="Dismiss notification"
          @click="toast = ''"
          >Close</v-btn
        ></template
      ></v-snackbar
    >
  </v-app>
</template>
