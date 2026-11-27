<script setup>
import { watch } from "vue";
import { useStorage } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import { vAutoAnimate } from "@formkit/auto-animate/vue";
import {
  ChevronRight,
  Search,
  ArrowUpRight,
  ChartNoAxesCombined,
} from "lucide-vue-next";
import { navigation } from "../data/navigation.js";
const props = defineProps({
  page: String,
  compact: Boolean,
  orderCount: Number,
  deliveredCount: Number,
});
const emit = defineEmits(["navigate", "expand", "search"]);
const { t } = useI18n();
const translateLabel = (label) => {
  const keys = { STORE: "store", SHOWCASE: "showcase", PREFERENCES: "preferences", Overview: "home", Orders: "orders", "All orders": "orders", Fulfillment: "fulfillment", Products: "products", Inventory: "inventory", Customers: "customers", Analytics: "analytics", Settings: "settings", Appearance: "appearance", Activity: "activity", Authentication: "authentication", "Search results": "searchResults", "Search grid": "searchResults", "Search list": "searchResults", "Login 01": "login1", "Login 02": "login2", "Sign up 01": "signup1", "Sign up 02": "signup2", "Create order": "createOrder", "Quick search": "quickSearch", "Help center": "help" };
  return keys[label] ? t(keys[label]) : label;
};
const expanded = useStorage("hlquery-commerce-navigation-groups", [
  "orders",
  "catalog",
]);
const active = (item) =>
  item.page === props.page ||
  item.children?.some((child) => child.page === props.page);
watch(
  () => props.page,
  () => {
    const parent = navigation
      .flatMap((s) => s.items)
      .find((item) =>
        item.children?.some((child) => child.page === props.page),
      );
    if (parent && !expanded.value.includes(parent.id))
      expanded.value = [...expanded.value, parent.id];
  },
  { immediate: true },
);
function toggle(item) {
  if (props.compact) {
    emit("expand");
    if (!expanded.value.includes(item.id))
      expanded.value = [...expanded.value, item.id];
    return;
  }
  expanded.value = expanded.value.includes(item.id)
    ? expanded.value.filter((id) => id !== item.id)
    : [...expanded.value, item.id];
}
</script>
<template>
  <nav class="sidebar-navigation" aria-label="Main navigation">
    <button
      class="rail-search"
      :class="{ 'is-compact': compact }"
      aria-label="Search navigation"
      :title="compact ? 'Search navigation' : undefined"
      @click="emit('search')"
    >
      <Search :size="16" /><template v-if="!compact"
        ><span>{{ t('quickSearch') }}</span><kbd>⌘ K</kbd></template
      >
    </button>
    <section
      v-for="section in navigation"
      :key="section.section"
      class="navigation-section"
      :data-section="section.section"
    >
      <div v-if="!compact" class="navigation-caption">
        {{ translateLabel(section.section) }}
      </div>
      <div
        v-for="item in section.items"
        :key="item.id || item.page"
        v-auto-animate="{ duration: 180 }"
        class="navigation-item"
      >
        <template v-if="item.children">
          <button
            class="nav-group-trigger"
            :class="{
              'group-active': active(item),
              'group-expanded': expanded.includes(item.id) && !compact,
            }"
            :aria-label="translateLabel(item.label)"
            :aria-expanded="!compact && expanded.includes(item.id)"
            :aria-controls="`submenu-${item.id}`"
            :title="compact ? translateLabel(item.label) : undefined"
            @click="toggle(item)"
          >
            <span class="nav-icon"
              ><component :is="item.icon" :size="18" /></span
            ><span class="nav-item-label">{{ translateLabel(item.label) }}</span
            ><small
              v-if="item.id === 'orders' && !compact"
              class="nav-project-count"
              >{{ orderCount }}</small
            ><ChevronRight
              v-if="!compact"
              class="group-chevron"
              :size="14"
              aria-hidden="true"
            />
          </button>
          <div
            v-if="!compact && expanded.includes(item.id)"
            :id="`submenu-${item.id}`"
            class="nav-submenu"
            role="group"
            :aria-label="`${item.label} pages`"
          >
            <a
              v-for="child in item.children"
              :key="child.page"
              :href="`#${child.page}`"
              :aria-label="translateLabel(child.label)"
              :class="{ 'submenu-active': page === child.page }"
              :aria-current="page === child.page ? 'page' : undefined"
              @click.prevent="emit('navigate', child.page)"
              ><span class="nav-child-bullet" aria-hidden="true"></span
              ><span class="nav-item-label">{{ translateLabel(child.label) }}</span
              ><span v-if="child.page === 'Board'" class="nav-child-tag"
                >NEW</span
              ><ChevronRight
                class="nav-selection-chevron"
                :size="13"
                aria-hidden="true"
            /></a>
          </div>
        </template>
        <a
          v-else
          class="nav-direct-link"
          :href="`#${item.page}`"
          :class="{ 'direct-active': active(item) }"
          :aria-current="active(item) ? 'page' : undefined"
          :aria-label="item.label"
          :title="compact ? item.label : undefined"
          @click.prevent="emit('navigate', item.page)"
          ><span class="nav-icon"><component :is="item.icon" :size="18" /></span
          ><span class="nav-item-label">{{ item.label }}</span
          ><span
            v-if="item.badge && !compact"
            class="nav-badge"
            :class="{ 'badge-new': item.badge === 'NEW' }"
            >{{ item.badge }}</span
          ><ChevronRight
            v-if="!compact"
            class="nav-selection-chevron"
            :size="14"
            aria-hidden="true"
        /></a>
      </div>
    </section>
    <a
      v-if="!compact"
      href="#Analytics"
      class="rail-pulse"
      @click.prevent="emit('navigate', 'Analytics')"
    >
      <div class="rail-pulse-heading">
        <ChartNoAxesCombined :size="15" /><span>Order fulfillment</span
        ><ArrowUpRight :size="14" />
      </div>
      <div class="rail-pulse-value">
        <strong
          >{{ orderCount ? Math.round((deliveredCount / orderCount) * 100) : 0
          }}<small>%</small></strong
        ><span>orders delivered</span>
      </div>
      <div class="rail-pulse-track">
        <i
          :style="{
            width: (orderCount ? (deliveredCount / orderCount) * 100 : 0) + '%',
          }"
        ></i>
      </div>
      <p>{{ deliveredCount }} of {{ orderCount }} orders delivered</p>
    </a>
  </nav>
</template>
<style scoped>
.sidebar-navigation {
  display: block !important;
}
.navigation-section + .navigation-section {
  margin-top: 22px;
}
.navigation-caption {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 9px;
  letter-spacing: 0.12em;
  font-weight: 700;
  color: #7790ad;
  margin: 0 10px 9px;
}
.navigation-caption::after {
  content: "";
  height: 1px;
  flex: 1;
  background: #ffffff0c;
}
.navigation-item {
  margin-bottom: 3px;
}
.sidebar-navigation .nav-group-trigger,
.sidebar-navigation .nav-direct-link {
  display: flex;
  width: 100%;
  gap: 11px;
  align-items: center;
  height: 41px;
  padding: 0 11px;
  border: 0;
  background: transparent;
  color: #9aabc0;
  font-size: 12px;
  font-weight: 500;
  border-radius: 8px;
  text-align: left;
  text-decoration: none;
  line-height: 1.4;
  box-shadow: none;
  cursor: pointer;
}
.sidebar-navigation .nav-group-trigger:hover,
.sidebar-navigation .nav-direct-link:hover {
  color: #f0f6ff;
  background: #ffffff0a;
}
.sidebar-navigation .nav-group-trigger.group-active {
  color: #e6f3ff;
  background: #ffffff08;
}
.sidebar-navigation .nav-direct-link.direct-active {
  color: #f4f9ff;
  background: linear-gradient(100deg, #1976d33a, #1976d315 78%, transparent);
  box-shadow:
    inset 2px 0 #58aaff,
    inset 0 0 0 1px #58aaff12;
}
.sidebar-navigation .nav-direct-link.direct-active > svg {
  color: #75bdff;
  filter: drop-shadow(0 0 5px #1976d344);
}
.nav-item-label {
  flex: 1;
}
.sidebar-navigation svg {
  flex-shrink: 0;
  stroke-width: 1.7;
}
.sidebar-navigation .group-chevron {
  margin-left: auto;
  opacity: 0.5;
  transition: transform 0.2s;
}
.group-expanded .group-chevron {
  transform: rotate(90deg);
}
.sidebar-navigation .nav-project-count {
  display: inline-grid;
  place-items: center;
  min-width: 21px;
  height: 19px;
  border-radius: 5px;
  color: #8da4c2;
  background: #ffffff07;
  font-size: 9px;
  padding: 0 5px;
  margin-left: 0;
}
.nav-submenu {
  position: relative;
  padding: 5px 0 4px 24px;
  margin: 2px 0 3px 18px;
}
.nav-submenu::before {
  content: "";
  position: absolute;
  top: 9px;
  bottom: 10px;
  left: 0;
  width: 2px;
  border-radius: 3px;
  background: linear-gradient(#ffffff10, #ffffff08);
}
.nav-submenu a {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 34px;
  color: #879ab2;
  font-size: 11px;
  padding: 7px 9px;
  margin-left: -5px;
  border-radius: 6px;
  text-decoration: none;
  transition:
    color 0.16s ease,
    background 0.16s ease;
}
.nav-submenu a:hover {
  color: #e8f4ff;
  background: #ffffff08;
}
.nav-submenu .submenu-active {
  color: #a6d6ff;
  font-weight: 550;
  background: #1976d31b;
}
.nav-child-tag {
  margin-left: auto;
  color: #6899c8;
  border: 1px solid #2a4761;
  font-size: 7px;
  border-radius: 4px;
  padding: 2px 4px;
  letter-spacing: 0.06em;
}
.sidebar-navigation a:focus-visible,
.sidebar-navigation button:focus-visible {
  outline: 2px solid #65b4ff;
  outline-offset: 2px;
}
@media (prefers-reduced-motion: reduce) {
  .sidebar-navigation .group-chevron {
    transition: none;
  }
}
</style>
