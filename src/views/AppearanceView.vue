<script setup>
import {
  Sun,
  Moon,
  Check,
  LayoutPanelLeft,
  ListFilter,
  PanelLeftClose,
} from "lucide-vue-next";
defineProps({ dark: Boolean, dense: Boolean, compact: Boolean });
const emit = defineEmits(["theme", "density", "navigation"]);
</script>
<template>
  <section class="appearance-layout">
    <article class="card appearance-card">
      <div class="card-header">
        <div>
          <span class="panel-kicker">MAKE IT FEEL LIKE YOURS</span>
          <h2>Your workspace, your way.</h2>
          <p>A little comfort goes a long way.</p>
        </div>
        <Sun :size="21" class="muted" />
      </div>
      <div class="appearance-body">
        <h3>Choose your canvas</h3>
        <p>
          Switch between light and dark. Your choice stays with this browser.
        </p>
        <div class="theme-options">
          <button
            v-for="option in [
              { name: 'Light', dark: false, icon: Sun },
              { name: 'Dark', dark: true, icon: Moon },
            ]"
            :key="option.name"
            class="theme-option"
            :class="{ selected: dark === option.dark }"
            :aria-pressed="dark === option.dark"
            @click="emit('theme', option.dark)"
          >
            <span class="theme-miniature" :class="{ 'mini-dark': option.dark }"
              ><i class="mini-nav"></i
              ><span class="mini-canvas"
                ><i></i><span><i></i><i></i><i></i></span><i></i></span></span
            ><span class="theme-choice-label"
              ><component :is="option.icon" :size="15" />{{ option.name
              }}<span v-if="dark === option.dark" class="theme-check"
                ><Check :size="12" /></span
            ></span>
          </button>
        </div>
        <div class="appearance-preference">
          <span class="appearance-pref-icon"><ListFilter :size="20" /></span>
          <div>
            <h3>Compact tables</h3>
            <p>Keep more rows in view with a tighter table layout.</p>
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
        <div class="appearance-preference">
          <span class="appearance-pref-icon"
            ><PanelLeftClose :size="20"
          /></span>
          <div>
            <h3>Compact navigation</h3>
            <p>Keep your sidebar small and give the content more room.</p>
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
      </div>
    </article>
    <aside class="card appearance-aside">
      <span class="appearance-aside-icon"><LayoutPanelLeft :size="26" /></span
      ><span class="panel-kicker">A FAMILIAR PLACE TO WORK</span>
      <h2>Clarity in every detail.</h2>
      <p>
        Your dashboard keeps the same blue accent across themes. It is the
        little thread that brings everything together.
      </p>
      <div class="brand-color-swatch">
        <span></span>
        <div><strong>HLQuery blue</strong><small>#1976D3</small></div>
      </div>
      <p class="appearance-hint">
        Tip: use the sun or moon in the top bar to switch themes from any view.
      </p>
    </aside>
  </section>
</template>
