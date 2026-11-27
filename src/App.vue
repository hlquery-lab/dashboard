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
import { onClickOutside, useStorage } from "@vueuse/core";
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
  Package,
  ArrowUpRight,
  Check,
  X,
  Truck,
  CircleHelp,
  Palette,
} from "lucide-vue-next";
import { useI18n } from "vue-i18n";
import SidebarNavigation from "./components/SidebarNavigation.vue";
import CommandPalette from "./components/CommandPalette.vue";
const SettingsView = defineAsyncComponent(
  () => import("./views/SettingsView.vue"),
);
const HelpCenterView = defineAsyncComponent(
  () => import("./views/HelpCenterView.vue"),
);
const AppearanceView = defineAsyncComponent(
  () => import("./views/AppearanceView.vue"),
);
const AuthenticationView = defineAsyncComponent(
  () => import("./views/AuthenticationView.vue"),
);
const SearchResultsView = defineAsyncComponent(
  () => import("./views/SearchResultsView.vue"),
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
const { locale, t } = useI18n();
const localeOptions = [
  { code: "en", flag: "🇺🇸", name: "English" },
  { code: "es", flag: "🇪🇸", name: "Español" },
  { code: "fr", flag: "🇫🇷", name: "Français" },
];
const currentLocale = computed(() => localeOptions.find((item) => item.code === locale.value) || localeOptions[0]);
function setLocale(code) {
  locale.value = code;
  localStorage.setItem("hlquery-locale", code);
  document.documentElement.lang = code;
}
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
const isAuthPage = computed(() => ["Login 01", "Login 02", "Sign up 01", "Sign up 02"].includes(page.value));
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
const profileAnchor = ref(null),
  profileTrigger = ref(null);
onClickOutside(profileAnchor, () => (profileOpen.value = false));
async function openProfileFromKeyboard() {
  profileOpen.value = true;
  notifications.value = false;
  await nextTick();
  profileAnchor.value?.querySelector("nav button")?.focus();
}
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
    if (profileOpen.value) profileTrigger.value?.focus();
    menuOpen.value = false;
    notifications.value = false;
    profileOpen.value = false;
  }
}
watch(
  page,
  (value) =>
    (document.title = `${value === "Overview" ? "" : `${value} · `}Open Source Dashboard · HLQuery`),
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
  Overview: "An open source dashboard for your next project.",
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
  Help: "Guides and resources to help you run your store.",
  "Login 01": "A simple welcome back. Centered, focused, and ready for your brand.",
  "Login 02": "A branded welcome, with room to tell your story.",
  "Sign up 01": "A clear first step. A clean registration experience for your next product.",
  "Sign up 02": "Make a great first impression with a split-screen registration experience.",
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
    <main v-if="isAuthPage" id="main" tabindex="-1">
      <AuthenticationView :key="page" :page="page" @navigate="navigate" />
    </main>
    <template v-else>
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
        ></a
      >
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
          <label class="locale-switch" :aria-label="t('language')">
            <span class="locale-flag" aria-hidden="true">{{ currentLocale.flag }}</span>
            <span class="locale-name" aria-hidden="true">{{ currentLocale.name }}</span>
            <select :value="locale" :aria-label="t('language')" @change="setLocale($event.target.value)">
              <option v-for="option in localeOptions" :key="option.code" :value="option.code">{{ option.flag }} {{ option.name }}</option>
            </select>
            <ChevronDown :size="13" aria-hidden="true" />
          </label>
          <button
            class="global-search command-trigger"
            aria-label="Search store"
            @click="commandOpen = true"
          >
            <Search :size="16" /><span>{{ t('search') }}</span
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
          <div ref="profileAnchor" class="popover-anchor account-anchor"
            @focusout="(event) => { if (!event.currentTarget.contains(event.relatedTarget)) profileOpen = false; }"
          >
            <button
              ref="profileTrigger"
              class="profile"
              aria-label="Store account"
              :aria-expanded="profileOpen"
              aria-controls="store-account-navigation"
              @keydown.down.prevent="openProfileFromKeyboard"
              @click="
                profileOpen = !profileOpen;
                notifications = false;
              "
            >
              <span class="avatar profile-avatar" aria-hidden="true">JW</span
              ><span class="profile-copy"
                ><strong>James Wilson</strong><small>Store owner</small></span
              ><ChevronDown :size="14" aria-hidden="true" />
            </button>
            <Transition name="account-popover">
              <nav v-if="profileOpen" id="store-account-navigation"
                class="popover profile-popover" aria-label="Store account navigation">
                <div class="profile-popover-user">
                  <span class="avatar profile-avatar" aria-hidden="true">JW</span>
                  <div><strong>James Wilson</strong><small>Store owner</small></div>
                </div>
                <div class="profile-popover-links">
                  <button :aria-current="page === 'Settings' ? 'page' : undefined" @click="navigate('Settings')">
                    <Settings2 :size="17" aria-hidden="true" /><span>Store settings</span><ChevronRight :size="14" aria-hidden="true" />
                  </button>
                  <button :aria-current="page === 'Appearance' ? 'page' : undefined" @click="navigate('Appearance')">
                    <Palette :size="17" aria-hidden="true" /><span>Appearance</span><ChevronRight :size="14" aria-hidden="true" />
                  </button>
                  <button :aria-current="page === 'Help' ? 'page' : undefined" @click="navigate('Help')">
                    <CircleHelp :size="17" aria-hidden="true" /><span>Help center</span><ChevronRight :size="14" aria-hidden="true" />
                  </button>
                </div>
                <div class="profile-popover-store">
                  <Store :size="15" aria-hidden="true" /><span :title="savedName">{{ savedName }}</span><span class="profile-demo-label">Demo</span>
                </div>
              </nav>
            </Transition>
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
              {{ page === "Overview" ? "Dashboard" : page === "Help" ? "Help center" : page
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
        <SearchResultsView
          v-else-if="['Search grid', 'Search list'].includes(page)"
          :key="page"
          :page="page"
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
        <HelpCenterView v-else @navigate="navigate" />
        <footer class="c-footer">
          <span
            >© 2026 HLQuery <span class="c-footer-divider">/</span>
            {{ savedName }}</span
          ><span>Sample data · USD · {{ dateLabel(demoDate) }}</span
          ><button @click="navigate('Help')">
            Help center <ArrowUpRight :size="12" />
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
    </template>
  </v-app>
</template>
