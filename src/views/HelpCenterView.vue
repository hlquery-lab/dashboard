<script setup>
import { computed, nextTick, ref } from 'vue';
import { Search, BookOpen, ArrowLeft, ArrowUpRight, ChevronRight, Rocket, ShoppingBag, Package, Users, Wallet, Settings2, X } from 'lucide-vue-next';

const emit = defineEmits(['navigate']);
const query = ref('');
const category = ref('all');
const selected = ref(null);
const articleHeading = ref(null);
const searchInput = ref(null);
const categories = [
  { id: 'start', name: 'Getting started', icon: Rocket, description: 'Your first steps in the store.' },
  { id: 'orders', name: 'Orders & shipping', icon: ShoppingBag, description: 'From a new order to delivery.' },
  { id: 'catalog', name: 'Products & inventory', icon: Package, description: 'Keep your catalog and stock in shape.' },
  { id: 'customers', name: 'Customers', icon: Users, description: 'Find customer details and purchases.' },
  { id: 'finance', name: 'Payments & reports', icon: Wallet, description: 'Understand sales, invoices, and totals.' },
  { id: 'settings', name: 'Store settings', icon: Settings2, description: 'Make the workspace your own.' },
];
const articles = [
  { id: 'tour', category: 'start', title: 'Get to know your store', description: 'A quick tour of the workspace and sample data.', time: 2, page: 'Overview', action: 'Open overview', intro: 'Start with a snapshot of your store, then use the sidebar to explore the tools behind it.', steps: ['Open Overview to see sales, recent orders, and stock alerts.', 'Browse Orders, Products, and Customers to explore the sample records.', 'Use the search in the top bar, or press Ctrl / ⌘ + K, to find pages and orders.'], note: 'This is an interactive demo. Changes are saved in this browser. No real payments, emails, or shipments are processed.' },
  { id: 'create-order', category: 'orders', title: 'Create your first order', description: 'Select a customer, add products, and apply a discount.', time: 3, page: 'Orders', action: 'Go to orders', intro: 'Create an order using the customers and available products in your store.', steps: ['Open Orders and choose Create order.', 'Select a customer, add available products, and review the quantities.', 'Apply an active discount code if needed, then review the total in USD.', 'Choose Create order. Open the new order to review its details and payment status.'], note: 'Creating an order reserves stock immediately. Prices are saved with the order, so later product price changes do not affect it.' },
  { id: 'shipping', category: 'orders', title: 'Prepare and fulfill an order', description: 'Move a paid order through packing, shipping, and delivery.', time: 3, page: 'Fulfillment', action: 'Open fulfillment', intro: 'Fulfillment tracks the steps between payment and delivery.', steps: ['Open a paid order in Fulfillment. If payment is pending, mark it paid first.', 'Choose Start packing to move it to Processing.', 'Mark the order shipped when it is ready to leave.', 'Mark it delivered to complete the workflow.'], note: 'Cancelling an unshipped order restores its stock. A paid order is marked refunded when cancelled. These are demo state changes.' },
  { id: 'products', category: 'catalog', title: 'Manage your product catalog', description: 'Review products, pricing, and publishing status.', time: 2, page: 'Products', action: 'Open products', intro: 'Your catalog holds the products available to sell in the store.', steps: ['Open Products to browse the catalog.', 'Choose Add product to create an item, or open an existing product to edit it.', 'Review its price and status before saving your changes.'], note: 'Draft products are unavailable for new orders until published. All prices in this store use USD.' },
  { id: 'restock', category: 'catalog', title: 'Restock a product', description: 'Add units and keep track of low stock.', time: 2, page: 'Inventory', action: 'Open inventory', intro: 'Use Inventory to review stock levels and replenish products.', steps: ['Open Inventory and find the product you want to replenish.', 'Choose Restock and enter the number of units to add.', 'Confirm the change and review the updated stock level.'], note: 'New orders reserve stock. Cancelling an unshipped order returns those units to inventory.' },
  { id: 'customers', category: 'customers', title: 'Find a customer and their orders', description: 'Review customer profiles and purchase history.', time: 2, page: 'Customers', action: 'Open customers', intro: 'Customer profiles bring contact details and purchases together.', steps: ['Open Customers and find the customer you need.', 'Open their profile to review contact details and purchase history.', 'Use Add customer when you need a customer record for a new order.'], note: 'Customer records belong to this browser’s demo data. Creating a record does not send an email.' },
  { id: 'payments', category: 'finance', title: 'Review payments and download invoices', description: 'Check paid, pending, and refunded orders.', time: 3, page: 'Payments', action: 'Open payments', intro: 'Payments and invoices use the same order records so you can follow each total back to its source.', steps: ['Open Payments to review paid, pending, and refunded amounts.', 'Filter the list by payment status to find the records you need.', 'Open Invoices from the sidebar and download an order invoice.', 'Use Export CSV where available to download the displayed records.'], note: 'Order totals, invoices, and financial exports all use USD. No real payment processing takes place.' },
  { id: 'reports', category: 'finance', title: 'Read your store reports', description: 'Explore sales, best sellers, and reporting periods.', time: 2, page: 'Analytics', action: 'Open analytics', intro: 'Analytics gives you a closer look at sales and product performance.', steps: ['Open Analytics to see sales, best sellers, and channel reports.', 'Switch between Last 7 days and Last 30 days to compare reporting windows.', 'Use the export action to download order data for further review.'], note: 'The demo uses November 23, 2026 as its reference date. Reporting periods use this fixed date to keep sample results consistent.' },
  { id: 'preferences', category: 'settings', title: 'Personalize your workspace', description: 'Adjust the theme, table density, and navigation.', time: 2, page: 'Appearance', action: 'Open appearance', intro: 'Choose a layout that feels comfortable for your day-to-day work.', steps: ['Open Appearance from Settings in the sidebar.', 'Choose a light or dark theme.', 'Adjust table density and compact navigation to suit your screen.', 'Open General settings to update the store name and other preferences.'], note: 'Preferences are saved in this browser. The language selector in the top bar lets you switch between English, Spanish, and French.' },
];
const results = computed(() => {
  const terms = query.value.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  return articles.filter(article => (category.value === 'all' || article.category === category.value) && terms.every(term => [article.title, article.description, article.intro, ...article.steps, article.note, categories.find(c => c.id === article.category).name].join(' ').toLocaleLowerCase().includes(term)));
});
const categoryName = id => categories.find(item => item.id === id)?.name;
const guideCount = id => articles.filter(article => article.category === id).length;
async function openArticle(article) {
  selected.value = article;
  await nextTick();
  articleHeading.value?.focus();
}
async function closeArticle() {
  selected.value = null;
  await nextTick();
  searchInput.value?.focus();
}
function clearFilters() { query.value = ''; category.value = 'all'; }
</script>

<template>
  <section class="help-center" aria-label="Help center">
    <template v-if="!selected">
      <div class="help-hero">
        <span class="help-eyebrow"><BookOpen :size="16" /> HLQUERY HELP CENTER</span>
        <h2>How can we help you?</h2>
        <p>Find a guide, learn the basics, and keep your store moving.</p>
        <div class="help-search">
          <Search :size="20" aria-hidden="true" />
          <input ref="searchInput" v-model="query" type="search" aria-label="Search help articles" placeholder="Search orders, products, payments…" />
          <button v-if="query" class="icon-button" aria-label="Clear search" @click="query = ''; searchInput?.focus()"><X :size="16" /></button>
        </div>
        <div class="help-popular"><span>Popular:</span><button @click="openArticle(articles[1])">Create an order</button><button @click="openArticle(articles[4])">Restock a product</button><button @click="openArticle(articles[8])">Change appearance</button></div>
      </div>

      <div class="help-section-heading"><div><span class="panel-kicker">EXPLORE THE KNOWLEDGE BASE</span><h2>Browse by topic</h2></div><button v-if="category !== 'all'" class="text-button" @click="category = 'all'">View all topics</button></div>
      <div class="help-topics">
        <button v-for="topic in categories" :key="topic.id" class="card help-topic" :class="{ selected: category === topic.id }" :aria-pressed="category === topic.id" @click="category = category === topic.id ? 'all' : topic.id">
          <span class="help-topic-icon"><component :is="topic.icon" :size="21" /></span>
          <h3>{{ topic.name }}</h3><p>{{ topic.description }}</p>
          <span class="help-topic-footer">{{ guideCount(topic.id) }} {{ guideCount(topic.id) === 1 ? 'guide' : 'guides' }} <ChevronRight :size="15" /></span>
        </button>
      </div>

      <div class="help-section-heading"><div><h2>{{ query.trim() ? 'Search results' : category === 'all' ? 'Guides to get you going' : categoryName(category) }}</h2><p role="status">{{ results.length }} {{ results.length === 1 ? 'guide' : 'guides' }}{{ query.trim() ? ` matching “${query.trim()}”` : ' available' }}</p></div></div>
      <div v-if="results.length" class="card help-articles">
        <button v-for="article in results" :key="article.id" class="help-article-row" @click="openArticle(article)">
          <BookOpen :size="19" class="help-row-icon" /><span class="help-article-copy"><span class="help-article-category">{{ categoryName(article.category) }}</span><strong>{{ article.title }}</strong><span>{{ article.description }}</span></span><span class="help-read-time">{{ article.time }} min read</span><ChevronRight :size="17" />
        </button>
      </div>
      <div v-else class="card help-empty"><Search :size="28" /><h3>No guides found</h3><p>Try a different keyword or browse all topics.</p><button class="button" @click="clearFilters">Show all guides</button></div>
      <aside class="help-start"><span class="help-topic-icon"><Rocket :size="21" /></span><div><h3>New here? Start with a quick tour.</h3><p>Get familiar with the workspace and try your first store workflow.</p></div><button class="button" @click="openArticle(articles[0])">Read the guide <ArrowUpRight :size="16" /></button></aside>
    </template>

    <template v-else>
      <button class="text-button help-back" @click="closeArticle"><ArrowLeft :size="16" /> Back to help center</button>
      <article class="card help-guide">
        <span class="help-eyebrow">{{ categoryName(selected.category) }} <span>· {{ selected.time }} min read</span></span>
        <h2 ref="articleHeading" tabindex="-1">{{ selected.title }}</h2><p class="help-guide-intro">{{ selected.intro }}</p>
        <h3>Follow these steps</h3><ol><li v-for="step in selected.steps" :key="step">{{ step }}</li></ol>
        <aside class="help-guide-note"><BookOpen :size="19" /><div><strong>Good to know</strong><p>{{ selected.note }}</p></div></aside>
        <button class="button primary" @click="emit('navigate', selected.page)">{{ selected.action }} <ArrowUpRight :size="16" /></button>
      </article>
      <div class="help-section-heading"><h2>Keep exploring</h2></div>
      <div class="card help-articles"><button v-for="article in articles.filter(item => item.id !== selected.id && (item.category === selected.category || item.category === 'start')).slice(0, 3)" :key="article.id" class="help-article-row" @click="openArticle(article)"><BookOpen :size="19" class="help-row-icon" /><span class="help-article-copy"><strong>{{ article.title }}</strong><span>{{ article.description }}</span></span><ChevronRight :size="17" /></button></div>
    </template>
  </section>
</template>

<style scoped>
.help-center { max-width: 1120px; margin-inline: auto; }
.help-hero { padding: 42px 32px 30px; border: 1px solid var(--line); border-radius: var(--workspace-card-radius, 12px); background: radial-gradient(ellipse at top right, color-mix(in srgb, var(--primary) 12%, transparent), transparent 65%), var(--surface); text-align: center; }
.help-eyebrow { display: flex; align-items: center; justify-content: center; gap: 9px; color: var(--primary); font-size: 10px; font-weight: 650; letter-spacing: .08em; }
.help-hero h2 { margin: 15px 0 10px; font-size: clamp(25px, 3vw, 35px); letter-spacing: -.04em; font-weight: 650; }
.help-hero > p { color: var(--muted); font-size: 13px; line-height: 1.7; }
.help-search { display: flex; align-items: center; gap: 12px; max-width: 560px; margin: 24px auto 16px; padding: 6px 14px; border: 1px solid var(--line); border-radius: 10px; background: var(--surface); color: var(--muted); box-shadow: 0 5px 16px #0a254008; }
.help-search:focus-within { outline: 2px solid var(--primary); outline-offset: 2px; }
.help-search input { width: 100%; height: 38px; padding: 0; border: 0; background: transparent; color: var(--text); font-size: 13px; outline: none !important; }
.help-search input::placeholder { color: var(--muted); }
.help-popular { display: flex; justify-content: center; flex-wrap: wrap; gap: 8px 14px; color: var(--muted); font-size: 11px; }
.help-popular button { color: var(--primary); padding: 0; font-size: inherit; }
.help-popular button:hover { text-decoration: underline; }
.help-section-heading { display: flex; align-items: center; justify-content: space-between; gap: 14px; margin: 30px 0 16px; }
.help-section-heading h2 { font-size: 17px; letter-spacing: -.025em; font-weight: 650; }
.help-section-heading .panel-kicker { display: block; margin-bottom: 8px; }
.help-section-heading p { margin-top: 6px; color: var(--muted); font-size: 12px; overflow-wrap: anywhere; }
.help-topics { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
.help-topic { display: flex; flex-direction: column; align-items: flex-start; min-width: 0; padding: 22px; text-align: left; transition: border-color .15s, background .15s; }
.help-topic:hover, .help-topic.selected { border-color: var(--primary); background: color-mix(in srgb, var(--primary) 4%, var(--surface)); }
.help-topic-icon { display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; width: 40px; height: 40px; border-radius: 11px; background: var(--primary-soft); color: var(--primary); }
.help-topic h3 { margin: 16px 0 7px; font-size: 13px; font-weight: 650; }
.help-topic p { color: var(--muted); font-size: 12px; line-height: 1.7; }
.help-topic-footer { display: flex; justify-content: space-between; align-items: center; width: 100%; padding-top: 20px; margin-top: auto; color: var(--muted); font-size: 11px; }
.help-articles { overflow: hidden; }
.help-article-row { display: flex; align-items: center; gap: 16px; width: 100%; padding: 20px 22px; text-align: left; color: var(--muted); }
.help-article-row + .help-article-row { border-top: 1px solid var(--line); }
.help-article-row:hover { background: var(--hover); }
.help-row-icon { color: var(--primary); }
.help-article-copy { display: flex; flex: 1; flex-direction: column; gap: 6px; min-width: 0; font-size: 12px; line-height: 1.6; }
.help-article-copy strong { color: var(--text); font-size: 13px; font-weight: 600; }
.help-article-category { color: var(--primary); font-size: 10px; }
.help-read-time { white-space: nowrap; font-size: 10px; }
.help-start { display: flex; align-items: center; gap: 18px; margin-top: 24px; padding: 24px; border: 1px solid var(--line); border-radius: var(--workspace-card-radius, 12px); }
.help-start > div { flex: 1; }
.help-start h3, .help-empty h3 { font-size: 14px; font-weight: 600; }
.help-start p, .help-empty p { margin-top: 7px; font-size: 12px; line-height: 1.7; color: var(--muted); }
.help-empty { padding: 40px 20px; text-align: center; }
.help-empty > svg { color: var(--muted); margin-bottom: 14px; }
.help-empty .button { margin-top: 20px; }
.help-back { display: inline-flex; align-items: center; gap: 8px; margin-bottom: 20px; }
.help-guide { padding: 36px; }
.help-guide .help-eyebrow { justify-content: flex-start; flex-wrap: wrap; letter-spacing: 0; font-size: 12px; }
.help-guide .help-eyebrow > span { color: var(--muted); font-weight: 400; }
.help-guide h2 { margin: 16px 0; font-size: clamp(23px, 3vw, 30px); line-height: 1.3; letter-spacing: -.035em; }
.help-guide-intro { max-width: 740px; font-size: 14px; color: var(--muted); line-height: 1.9; }
.help-guide h3 { margin-top: 30px; font-size: 15px; font-weight: 600; }
.help-guide ol { padding-left: 23px; margin: 18px 0 26px; }
.help-guide li { padding-left: 8px; margin-bottom: 16px; font-size: 13px; line-height: 1.9; }
.help-guide li::marker { color: var(--primary); font-weight: 650; }
.help-guide-note { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 26px; padding: 20px; background: var(--primary-soft); border-radius: 9px; }
.help-guide-note > svg { color: var(--primary); margin-top: 2px; }
.help-guide-note strong { font-size: 12px; font-weight: 650; }
.help-guide-note p { margin-top: 7px; color: var(--muted); font-size: 12px; line-height: 1.9; }
@media (max-width: 900px) {
  .help-topics { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .help-start { flex-wrap: wrap; }
}
@media (max-width: 520px) {
  .help-hero { padding: 28px 17px 24px; }
  .help-hero > p { font-size: 12px; }
  .help-search { padding-inline: 10px; gap: 8px; }
  .help-search input { font-size: 12px; }
  .help-topics { grid-template-columns: 1fr; gap: 10px; }
  .help-topic { padding: 19px; }
  .help-read-time { display: none; }
  .help-article-row { padding: 18px 15px; gap: 12px; }
  .help-start { padding: 20px; }
  .help-start > div { min-width: 160px; }
  .help-guide { padding: 23px 19px; }
  .help-guide-note { padding: 15px; gap: 10px; }
}
</style>
