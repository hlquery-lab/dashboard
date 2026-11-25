<script setup>
import { computed, reactive, ref } from "vue";
import {
  Search,
  LayoutGrid,
  List,
  Download,
  Package,
  Plus,
  X,
  Pencil,
  Boxes,
  AlertTriangle,
} from "lucide-vue-next";
import { useCommerce } from "./store.js";
import { categories, exportCsv } from "./data.js";
import { money } from "../utils/currency.js";
import ProductArt from "./ProductArt.vue";
const props = defineProps({ inventory: Boolean });
const emit = defineEmits(["notify"]);
const { state, saveProduct, restock, paid } = useCommerce();
const query = ref(""),
  category = ref("All categories"),
  status = ref("All statuses"),
  stockFilter = ref("All stock"),
  grid = ref(true),
  editing = ref(false),
  error = ref("");
const form = reactive({});
const restockProduct = ref(null),
  quantity = ref(10),
  stockError = ref("");
const filtered = computed(() =>
  state.products.filter(
    (p) =>
      (category.value === "All categories" || p.category === category.value) &&
      (status.value === "All statuses" || p.status === status.value) &&
      (stockFilter.value === "All stock" ||
        (stockFilter.value === "Out of stock" && p.stock === 0) ||
        (stockFilter.value === "Low stock" && p.stock > 0 && p.stock <= 10) ||
        (stockFilter.value === "In stock" && p.stock > 10)) &&
      `${p.name} ${p.sku}`
        .toLowerCase()
        .includes(query.value.trim().toLowerCase()),
  ),
);
const totalUnits = computed(() =>
  state.products.reduce((s, p) => s + p.stock, 0),
);
const low = computed(
  () => state.products.filter((p) => p.stock > 0 && p.stock <= 10).length,
);
const sold = (id) =>
  paid.value.reduce(
    (s, o) =>
      s +
      o.items
        .filter((l) => l.productId === id)
        .reduce((n, l) => n + l.quantity, 0),
    0,
  );
function create() {
  Object.assign(form, {
    id: undefined,
    name: "",
    sku: "",
    category: "Accessories",
    price: 0,
    cost: 0,
    stock: 0,
    status: "Draft",
    art: "bag",
    color: "#b7c8c4",
    description: "",
  });
  error.value = "";
  editing.value = true;
}
function edit(product) {
  Object.assign(form, product);
  error.value = "";
  editing.value = true;
}
function submit() {
  try {
    saveProduct(form);
    editing.value = false;
    emit("notify", "Product saved");
  } catch (e) {
    error.value = e.message;
  }
}
function openRestock(p) {
  restockProduct.value = p;
  quantity.value = 10;
  stockError.value = "";
}
function saveStock() {
  try {
    restock(restockProduct.value.id, Number(quantity.value));
    restockProduct.value = null;
    emit("notify", "Inventory updated");
  } catch (e) {
    stockError.value = e.message;
  }
}
function exportProducts() {
  exportCsv("hlquery-products.csv", [
    ["Product", "SKU", "Category", "Price USD", "Cost USD", "Stock", "Status"],
    ...filtered.value.map((p) => [
      p.name,
      p.sku,
      p.category,
      p.price.toFixed(2),
      p.cost.toFixed(2),
      p.stock,
      p.status,
    ]),
  ]);
}
defineExpose({ create });
</script>
<template>
  <section class="c-catalog-summary">
    <article>
      <span class="c-summary-icon"><Package :size="20" /></span>
      <div>
        <span>Products</span><strong>{{ state.products.length }}</strong>
      </div>
      <small
        >{{ state.products.filter((p) => p.status === "Active").length }} active
        listings</small
      >
    </article>
    <article>
      <span class="c-summary-icon green"><Boxes :size="20" /></span>
      <div>
        <span>Units in stock</span><strong>{{ totalUnits }}</strong>
      </div>
      <small>Across your catalog</small>
    </article>
    <article>
      <span class="c-summary-icon amber"><AlertTriangle :size="20" /></span>
      <div>
        <span>Low stock</span><strong>{{ low }}</strong>
      </div>
      <small
        >{{ state.products.filter((p) => p.stock === 0).length }} out of
        stock</small
      >
    </article>
  </section>
  <section class="card c-catalog-shell">
    <div class="c-table-toolbar">
      <label class="c-search"
        ><Search :size="16" /><input
          v-model="query"
          type="search"
          aria-label="Search products"
          placeholder="Search products or SKU…" /></label
      ><select
        v-model="category"
        class="c-select"
        aria-label="Product category"
      >
        <option>All categories</option>
        <option v-for="c in categories" :key="c">{{ c }}</option></select
      ><select
        v-if="inventory"
        v-model="stockFilter"
        class="c-select"
        aria-label="Stock level"
      >
        <option>All stock</option>
        <option>Low stock</option>
        <option>Out of stock</option>
        <option>In stock</option></select
      ><select
        v-else
        v-model="status"
        class="c-select"
        aria-label="Product status"
      >
        <option>All statuses</option>
        <option>Active</option>
        <option>Draft</option>
        <option>Archived</option></select
      ><button
        class="c-icon-button"
        aria-label="Export products"
        @click="exportProducts"
      >
        <Download :size="17" />
      </button>
      <div v-if="!inventory" class="c-view-switch">
        <button
          aria-label="Grid view"
          :aria-pressed="grid"
          :class="{ active: grid }"
          @click="grid = true"
        >
          <LayoutGrid :size="16" /></button
        ><button
          aria-label="List view"
          :aria-pressed="!grid"
          :class="{ active: !grid }"
          @click="grid = false"
        >
          <List :size="17" />
        </button>
      </div>
    </div>
    <div v-if="!inventory && grid" class="c-product-grid">
      <article v-for="p in filtered" :key="p.id" class="c-product-card">
        <button
          class="c-product-visual"
          :aria-label="`Edit ${p.name}`"
          @click="edit(p)"
        >
          <span class="c-status" :class="p.status.toLowerCase()">{{
            p.status
          }}</span
          ><ProductArt :product="p" /><span class="c-product-edit"
            ><Pencil :size="14"
          /></span>
        </button>
        <div class="c-product-info">
          <span class="c-product-category">{{ p.category }}</span
          ><button class="c-product-name" @click="edit(p)">{{ p.name }}</button
          ><span class="c-product-sku">{{ p.sku }}</span>
          <div class="c-product-bottom">
            <strong>{{ money(p.price) }}</strong
            ><span
              :class="{
                'c-danger': p.stock === 0,
                'c-warning': p.stock > 0 && p.stock <= 10,
              }"
              >{{
                p.stock === 0 ? "Out of stock" : p.stock + " in stock"
              }}</span
            >
          </div>
        </div>
      </article>
    </div>
    <div v-else class="c-table-scroll">
      <table class="c-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>SKU</th>
            <th>{{ inventory ? "Stock level" : "Status" }}</th>
            <th class="c-number">
              {{ inventory ? "Units available" : "Price (USD)" }}
            </th>
            <th class="c-number">
              {{ inventory ? "Cost (USD)" : "Units sold" }}
            </th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in filtered" :key="p.id">
            <td>
              <button class="c-product-cell" @click="edit(p)">
                <ProductArt :product="p" /><span
                  ><strong>{{ p.name }}</strong
                  ><small>{{ p.category }}</small></span
                >
              </button>
            </td>
            <td>{{ p.sku }}</td>
            <td>
              <span
                class="c-status"
                :class="
                  inventory
                    ? p.stock === 0
                      ? 'cancelled'
                      : p.stock <= 10
                        ? 'pending'
                        : 'paid'
                    : p.status.toLowerCase()
                "
                >{{
                  inventory
                    ? p.stock === 0
                      ? "Out of stock"
                      : p.stock <= 10
                        ? "Low stock"
                        : "In stock"
                    : p.status
                }}</span
              >
            </td>
            <td class="c-number c-amount">
              {{ inventory ? p.stock : money(p.price) }}
            </td>
            <td class="c-number">
              {{ inventory ? money(p.cost) : sold(p.id) }}
            </td>
            <td>
              <button
                v-if="inventory"
                class="c-text-button"
                :aria-label="`Restock ${p.name}`"
                @click="openRestock(p)"
              >
                <Plus :size="14" />Restock</button
              ><button
                v-else
                class="c-text-button"
                :aria-label="`Edit ${p.name}`"
                @click="edit(p)"
              >
                <Pencil :size="14" />Edit
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="!filtered.length" class="c-empty">
      <Package :size="28" />
      <h3>No products found</h3>
      <p>Try another search or add your first product.</p>
      <button class="button primary" @click="create">Add product</button>
    </div>
    <div class="c-catalog-footer">
      <span>{{ filtered.length }} products</span
      ><span>{{
        inventory
          ? "Stock is reserved when an order is created."
          : "All prices in USD. Draft and archived products cannot be ordered."
      }}</span>
    </div>
  </section>
  <v-dialog v-model="editing" max-width="720" aria-label="Product editor"
    ><v-card class="c-dialog"
      ><form @submit.prevent="submit">
        <header class="c-dialog-heading">
          <div>
            <span class="panel-kicker">YOUR PRODUCT CATALOG</span>
            <h2>{{ form.id ? "Edit product" : "Add product" }}</h2>
            <p>The details behind a customer favorite.</p>
          </div>
          <button
            type="button"
            class="c-icon-button"
            aria-label="Close product editor"
            @click="editing = false"
          >
            <X :size="20" />
          </button>
        </header>
        <div class="c-dialog-content">
          <div class="c-product-form-top">
            <ProductArt :product="form" />
            <div>
              <label class="c-field"
                >Product name<input v-model="form.name" required maxlength="80"
              /></label>
              <div class="c-form-grid">
                <label class="c-field"
                  >SKU<input
                    v-model="form.sku"
                    required
                    maxlength="32" /></label
                ><label class="c-field"
                  >Category<select v-model="form.category">
                    <option v-for="c in categories" :key="c">{{ c }}</option>
                  </select></label
                >
              </div>
            </div>
          </div>
          <label class="c-field"
            >Description<textarea
              v-model="form.description"
              rows="2"
              maxlength="500"
            ></textarea>
          </label>
          <div class="c-form-grid c-three-columns">
            <label class="c-field"
              >Price (USD)<input
                v-model.number="form.price"
                type="number"
                min="0.01"
                max="9999999"
                step="0.01"
                required /></label
            ><label class="c-field"
              >Cost (USD)<input
                v-model.number="form.cost"
                type="number"
                min="0"
                max="9999999"
                step="0.01"
                required /></label
            ><label class="c-field"
              >Stock quantity<input
                v-model.number="form.stock"
                type="number"
                min="0"
                max="999999"
                step="1"
                required
            /></label>
          </div>
          <div class="c-form-grid">
            <label class="c-field"
              >Publication status<select v-model="form.status">
                <option>Active</option>
                <option>Draft</option>
                <option>Archived</option>
              </select></label
            ><label class="c-field"
              >Product illustration<select v-model="form.art">
                <option
                  v-for="art in [
                    'bag',
                    'headphones',
                    'mug',
                    'shirt',
                    'lamp',
                    'backpack',
                    'bottle',
                    'cushion',
                  ]"
                  :key="art"
                  :value="art"
                >
                  {{ art }}
                </option>
              </select></label
            >
          </div>
          <label class="c-field c-color-field"
            >Product color<input v-model="form.color" type="color"
          /></label>
          <p class="c-demo-note">
            Illustrations represent demo products. Publishing makes a stocked
            product available for new orders.
          </p>
          <p v-if="error" class="c-form-error" role="alert">{{ error }}</p>
        </div>
        <footer class="c-dialog-footer">
          <button type="button" class="button" @click="editing = false">
            Cancel</button
          ><button type="submit" class="button primary">Save product</button>
        </footer>
      </form></v-card
    ></v-dialog
  >
  <v-dialog
    :model-value="!!restockProduct"
    max-width="440"
    aria-label="Restock product"
    @update:model-value="!$event && (restockProduct = null)"
    ><v-card v-if="restockProduct" class="c-dialog"
      ><form @submit.prevent="saveStock">
        <header class="c-dialog-heading">
          <div>
            <span class="panel-kicker">INVENTORY</span>
            <h2>Restock product</h2>
          </div>
          <button
            type="button"
            class="c-icon-button"
            aria-label="Close restock"
            @click="restockProduct = null"
          >
            <X :size="20" />
          </button>
        </header>
        <div class="c-dialog-content">
          <div class="c-product-cell c-restock-product">
            <ProductArt :product="restockProduct" /><span
              ><strong>{{ restockProduct.name }}</strong
              ><small
                >{{ restockProduct.stock }} units currently available</small
              ></span
            >
          </div>
          <label class="c-field"
            >Units to add<input
              v-model.number="quantity"
              type="number"
              min="1"
              max="999999"
              step="1"
              required
          /></label>
          <p class="c-empty-note">
            New stock level:
            {{ restockProduct.stock + Number(quantity || 0) }} units
          </p>
          <p v-if="stockError" class="c-form-error" role="alert">
            {{ stockError }}
          </p>
        </div>
        <footer class="c-dialog-footer">
          <button type="button" class="button" @click="restockProduct = null">
            Cancel</button
          ><button type="submit" class="button primary">Add stock</button>
        </footer>
      </form></v-card
    ></v-dialog
  >
</template>
