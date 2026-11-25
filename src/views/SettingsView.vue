<script setup>
import { computed } from "vue";
import {
  Settings2,
  SlidersHorizontal,
  Sun,
  Moon,
  Check,
  PanelLeft,
  Rows3,
  ArrowUpRight,
  Sparkles,
} from "lucide-vue-next";
const props = defineProps({
  name: String,
  dark: Boolean,
  compact: Boolean,
  dense: Boolean,
  contentWidth: Number,
  cardRadius: Number,
  orderCount: Number,
  deliveredCount: Number,
});
const emit = defineEmits([
  "update:name",
  "theme",
  "navigation",
  "density",
  "width",
  "radius",
  "save",
  "appearance",
]);
const completion = computed(() =>
  props.orderCount
    ? Math.round((props.deliveredCount / props.orderCount) * 100)
    : 0,
);
</script>

<template>
  <section class="preferences-layout" aria-label="Store settings">
    <div class="preferences-main">
      <div class="preferences-banner">
        <span class="preferences-banner-icon"><Settings2 :size="24" /></span>
        <div>
          <span class="panel-kicker">YOUR SPACE, YOUR RULES</span>
          <h2>A store that fits you.</h2>
          <p>Fine-tune the details. Find your flow.</p>
        </div>
        <Sparkles :size="32" class="preferences-sparkle" aria-hidden="true" />
      </div>
      <form class="card preferences-panel" @submit.prevent="emit('save')">
        <header class="preferences-section-title">
          <span class="preferences-icon"><Settings2 :size="19" /></span>
          <div>
            <h2>Store details</h2>
            <p>A familiar name for your everyday work.</p>
          </div>
          <span class="preferences-step">01</span>
        </header>
        <label class="preferences-name"
          >Store name<input
            :value="name"
            required
            maxlength="40"
            pattern=".*\S.*"
            @input="emit('update:name', $event.target.value)"
        /></label>
        <div class="preferences-save">
          <span><Check :size="14" /> Stored in this browser</span
          ><button class="button primary" type="submit">Save changes</button>
        </div>
      </form>
      <article class="card preferences-panel">
        <header class="preferences-section-title">
          <span class="preferences-icon"><SlidersHorizontal :size="19" /></span>
          <div>
            <h2>Layout &amp; comfort</h2>
            <p>A little more space, a little more focus.</p>
          </div>
          <span class="preferences-step">02</span>
        </header>
        <div
          class="preferences-slider"
          v-for="control in [
            {
              id: 'content-width',
              label: 'Content width',
              detail: 'Set how wide your store can grow.',
              value: contentWidth,
              min: 1100,
              max: 1800,
              step: 10,
              unit: 'px',
              event: 'width',
              start: 'Focused',
              end: 'Spacious',
            },
            {
              id: 'card-radius',
              label: 'Card corners',
              detail: 'Give your panels a sharper or softer feel.',
              value: cardRadius,
              min: 4,
              max: 28,
              step: 1,
              unit: 'px',
              event: 'radius',
              start: 'Crisp',
              end: 'Rounded',
            },
          ]"
          :key="control.id"
        >
          <div class="preferences-slider-title">
            <label :for="control.id">{{ control.label }}</label
            ><output :for="control.id"
              >{{ control.value }}<small>{{ control.unit }}</small></output
            >
          </div>
          <p>{{ control.detail }}</p>
          <input
            :id="control.id"
            type="range"
            :min="control.min"
            :max="control.max"
            :step="control.step"
            :value="control.value"
            :style="{
              '--range-fill': `${((control.value - control.min) / (control.max - control.min)) * 100}%`,
            }"
            @input="emit(control.event, Number($event.target.value))"
          />
          <div class="preferences-range-labels">
            <span>{{ control.start }}</span
            ><span>{{ control.end }}</span>
          </div>
        </div>
        <div class="preferences-toggle">
          <span class="preferences-toggle-icon"><Rows3 :size="19" /></span>
          <div>
            <h3>Compact tables</h3>
            <p>More rows, less scrolling.</p>
          </div>
          <v-switch
            :model-value="dense"
            aria-label="Compact tables"
            color="primary"
            hide-details
            inset
            @update:model-value="emit('density', $event)"
          />
        </div>
        <div class="preferences-toggle">
          <span class="preferences-toggle-icon"><PanelLeft :size="19" /></span>
          <div>
            <h3>Compact navigation</h3>
            <p>Give your content more room.</p>
          </div>
          <v-switch
            :model-value="compact"
            aria-label="Compact navigation"
            color="primary"
            hide-details
            inset
            @update:model-value="emit('navigation', $event)"
          />
        </div>
        <p class="preferences-footnote">
          Layout changes apply instantly and stay in this browser.
        </p>
      </article>
    </div>
    <aside class="preferences-aside">
      <article class="card preferences-panel">
        <div class="preferences-section-title">
          <span class="preferences-icon"><Sun :size="19" /></span>
          <div>
            <h2>Set the mood</h2>
            <p>Your favorite way to work.</p>
          </div>
        </div>
        <div class="preferences-theme-options">
          <button
            v-for="option in [
              { label: 'Light', dark: false, icon: Sun },
              { label: 'Dark', dark: true, icon: Moon },
            ]"
            :key="option.label"
            type="button"
            :aria-pressed="dark === option.dark"
            class="preferences-theme"
            :class="{ selected: dark === option.dark }"
            @click="emit('theme', option.dark)"
          >
            <span
              class="preferences-mini"
              :class="{ night: option.dark }"
              aria-hidden="true"
              ><i></i><span><b></b><b></b><b></b></span
            ></span>
            <span
              ><component :is="option.icon" :size="14" />{{ option.label
              }}<Check
                v-if="dark === option.dark"
                :size="14"
                class="preferences-selected-check"
            /></span>
          </button>
        </div>
        <button class="preferences-link" @click="emit('appearance')">
          Explore appearance <ArrowUpRight :size="15" />
        </button>
      </article>
      <article class="card preferences-panel preferences-snapshot">
        <span class="panel-kicker">STORE SNAPSHOT</span>
        <h2>Small steps. Real progress.</h2>
        <p>Your store activity at a glance.</p>
        <div class="preferences-stats">
          <div>
            <strong>{{ orderCount }}</strong
            ><span>Total orders</span>
          </div>
          <div>
            <strong>{{ deliveredCount }}</strong
            ><span>Delivered</span>
          </div>
        </div>
        <div class="preferences-meter-label">
          <span>Orders delivered</span><strong>{{ completion }}%</strong>
        </div>
        <progress :value="completion" max="100" aria-label="Orders delivered">
          {{ completion }}%
        </progress>
        <div class="preferences-tip">
          <Sparkles :size="18" />
          <p>
            Make room for your next great idea. Every delivered order is a step
            forward.
          </p>
        </div>
      </article>
    </aside>
  </section>
</template>

<style scoped>
.preferences-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.65fr) minmax(270px, 1fr);
  gap: 24px;
  align-items: start;
}
.preferences-main,
.preferences-aside {
  display: grid;
  gap: 24px;
  min-width: 0;
}
.preferences-banner {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 26px;
  background: linear-gradient(120deg, var(--primary-soft), var(--surface));
  border: 1px solid var(--line);
  border-radius: var(--workspace-card-radius, 11px);
}
.preferences-banner-icon {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  border-radius: 15px;
  background: var(--surface);
  color: var(--primary);
  box-shadow: 0 5px 15px #1976d30d;
}
.preferences-banner h2 {
  font-size: 1.25rem;
  margin: 5px 0 7px;
}
.preferences-banner p,
.preferences-section-title p,
.preferences-slider p,
.preferences-toggle p,
.preferences-snapshot > p {
  color: var(--muted);
  font-size: 0.78rem;
  line-height: 1.6;
}
.preferences-sparkle {
  margin-left: auto;
  color: var(--primary);
  opacity: 0.5;
}
.preferences-panel {
  padding: 26px;
  min-width: 0;
}
.preferences-section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 25px;
}
.preferences-section-title h2 {
  margin-bottom: 4px;
}
.preferences-icon {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border: 1px solid var(--line);
  border-radius: 11px;
  color: var(--primary);
  flex-shrink: 0;
}
.preferences-step {
  margin-left: auto;
  color: var(--muted);
  font-size: 0.7rem;
  letter-spacing: 0.08em;
}
.preferences-name {
  margin-bottom: 22px;
}
.preferences-name input {
  border-radius: 8px;
}
.preferences-save {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.preferences-save > span {
  color: var(--muted);
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  gap: 5px;
}
.preferences-save > span svg {
  color: #089977;
}
.preferences-slider {
  margin-bottom: 28px;
}
.preferences-slider-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.preferences-slider-title label {
  margin: 0;
  font-weight: 600;
}
.preferences-slider-title output {
  padding: 4px 9px;
  color: var(--primary);
  background: var(--primary-soft);
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 650;
  font-variant-numeric: tabular-nums;
}
.preferences-slider-title small {
  margin-left: 3px;
  font-weight: 400;
}
.preferences-slider > p {
  margin: 5px 0 16px;
}
.preferences-slider input[type="range"] {
  display: block;
  appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 6px;
  background: linear-gradient(
    to right,
    var(--primary) var(--range-fill),
    var(--line) var(--range-fill)
  );
  cursor: pointer;
  margin: 12px 0;
}
.preferences-slider input::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  background: var(--surface);
  border: 3px solid var(--primary);
  border-radius: 50%;
  box-shadow: 0 2px 5px #0002;
}
.preferences-slider input::-moz-range-thumb {
  width: 12px;
  height: 12px;
  background: var(--surface);
  border: 3px solid var(--primary);
  border-radius: 50%;
}
.preferences-range-labels {
  display: flex;
  justify-content: space-between;
  color: var(--muted);
  font-size: 0.68rem;
}
.preferences-toggle {
  display: flex;
  align-items: center;
  gap: 12px;
  border-top: 1px solid var(--line);
  padding: 16px 0;
}
.preferences-toggle-icon {
  color: var(--muted);
}
.preferences-toggle h3 {
  font-size: 0.8rem;
  font-weight: 600;
  margin: 0 0 4px;
}
.preferences-toggle .v-switch {
  margin-left: auto;
  flex: 0 0 auto;
}
.preferences-footnote {
  color: var(--muted);
  font-size: 0.7rem;
  line-height: 1.6;
  padding-top: 4px;
}
.preferences-theme-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.preferences-theme {
  padding: 7px;
  border: 1px solid var(--line);
  border-radius: 10px;
  text-align: left;
}
.preferences-theme.selected {
  border-color: var(--primary);
  box-shadow: 0 0 0 1px var(--primary);
  background: var(--primary-soft);
}
.preferences-mini {
  display: flex;
  height: 76px;
  background: #f4f7fb;
  border: 1px solid #e1e7ef;
  border-radius: 6px;
  overflow: hidden;
}
.preferences-mini > i {
  width: 24%;
  background: #171b2e;
}
.preferences-mini > span {
  display: grid;
  gap: 7px;
  padding: 10px;
  width: 76%;
}
.preferences-mini b {
  background: white;
  border-radius: 3px;
  border: 1px solid #e1e7ef;
}
.preferences-mini b:first-child {
  width: 65%;
  background: #1976d3;
  border: 0;
}
.preferences-mini.night {
  background: #10131e;
  border-color: #2a3043;
}
.preferences-mini.night b {
  background: #242b40;
  border-color: #303950;
}
.preferences-theme > span:last-child {
  display: flex;
  gap: 6px;
  align-items: center;
  font-size: 0.75rem;
  padding: 10px 4px 3px;
}
.preferences-selected-check {
  margin-left: auto;
  color: var(--primary);
}
.preferences-link {
  color: var(--primary);
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.75rem;
  margin-top: 23px;
}
.preferences-snapshot h2 {
  margin: 12px 0 8px;
  font-size: 1.1rem;
  line-height: 1.4;
}
.preferences-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin: 24px 0;
}
.preferences-stats > div {
  display: grid;
  gap: 6px;
}
.preferences-stats > div + div {
  border-left: 1px solid var(--line);
  padding-left: 22px;
}
.preferences-stats strong {
  font-size: 1.9rem;
  line-height: 1;
  font-weight: 600;
  letter-spacing: -0.06em;
}
.preferences-stats span,
.preferences-meter-label {
  color: var(--muted);
  font-size: 0.7rem;
}
.preferences-meter-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 9px;
}
.preferences-meter-label strong {
  color: var(--primary);
}
.preferences-snapshot progress {
  display: block;
  appearance: none;
  border: 0;
  border-radius: 5px;
  width: 100%;
  height: 7px;
  overflow: hidden;
  background: var(--line);
  color: var(--primary);
}
.preferences-snapshot progress::-webkit-progress-bar {
  background: var(--line);
}
.preferences-snapshot progress::-webkit-progress-value {
  background: var(--primary);
  border-radius: 5px;
}
.preferences-snapshot progress::-moz-progress-bar {
  background: var(--primary);
  border-radius: 5px;
}
.preferences-tip {
  display: flex;
  gap: 10px;
  border-top: 1px solid var(--line);
  margin-top: 24px;
  padding-top: 20px;
  color: var(--muted);
  font-size: 0.75rem;
  line-height: 1.7;
}
.preferences-tip svg {
  color: var(--primary);
  margin-top: 3px;
}
@media (max-width: 1150px) {
  .preferences-layout {
    grid-template-columns: 1fr;
  }
  .preferences-aside {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 650px) {
  .preferences-aside {
    grid-template-columns: 1fr;
  }
  .preferences-panel,
  .preferences-banner {
    padding: 20px;
  }
  .preferences-banner {
    gap: 12px;
  }
  .preferences-banner h2 {
    font-size: 1.05rem;
  }
  .preferences-sparkle {
    display: none;
  }
  .preferences-save {
    align-items: start;
    flex-direction: column;
  }
  .preferences-save .button {
    width: 100%;
  }
}
</style>
