<script setup>
import { computed, ref, watch, nextTick } from "vue";
import {
  Search,
  ArrowUpRight,
  CornerDownLeft,
  FolderKanban,
  X,
  Command,
} from "lucide-vue-next";
import { navigationPages } from "../data/navigation.js";
const props = defineProps({ modelValue: Boolean, projects: Array });
const emit = defineEmits(["update:modelValue", "navigate", "project"]);
const query = ref(""),
  input = ref(null),
  resultsRef = ref(null);
const results = computed(() => {
  const term = query.value.trim().toLowerCase();
  const pages = navigationPages
    .filter((p) =>
      `${p.label} ${p.page} ${p.description || ""}`
        .toLowerCase()
        .includes(term),
    )
    .map((p) => ({ ...p, kind: "Page" }));
  const projects = term
    ? props.projects
        .filter((p) => `${p.name} ${p.client}`.toLowerCase().includes(term))
        .slice(0, 5)
        .map((p) => ({
          label: p.name,
          description: p.client,
          project: p,
          icon: FolderKanban,
          kind: "Project",
        }))
    : [];
  const rank = (item) => {
    const label = item.label.toLowerCase();
    if (label === term || item.page?.toLowerCase() === term) return 0;
    if (label.startsWith(term)) return 1;
    if (label.split(/\s+/).some((word) => word.startsWith(term))) return 2;
    if (label.includes(term)) return 3;
    return 4;
  };
  return [...pages, ...projects].sort((a, b) => rank(a) - rank(b)).slice(0, 12);
});
watch(
  () => props.modelValue,
  async (value) => {
    if (value) {
      query.value = "";
      await nextTick();
      input.value?.focus();
    }
  },
);
function pick(item) {
  emit("update:modelValue", false);
  if (item.project) emit("project", item.project);
  else emit("navigate", item.page);
}
function focusFirst(event) {
  event.preventDefault();
  resultsRef.value?.querySelector("button")?.focus();
}
function moveFocus(event) {
  if (!["ArrowUp", "ArrowDown"].includes(event.key)) return;
  event.preventDefault();
  const buttons = [...resultsRef.value.querySelectorAll("button")];
  const at = buttons.indexOf(document.activeElement);
  buttons[
    (at + (event.key === "ArrowDown" ? 1 : -1) + buttons.length) %
      buttons.length
  ]?.focus();
}
</script>
<template>
  <v-dialog
    aria-label="Workspace search"
    :model-value="modelValue"
    max-width="620"
    content-class="command-dialog"
    @update:model-value="emit('update:modelValue', $event)"
    @after-enter="input?.focus()"
    ><v-card class="command-card"
      ><div class="command-search">
        <Search :size="21" /><input
          ref="input"
          v-model="query"
          aria-label="Search pages and projects"
          placeholder="Where would you like to go?"
          @keydown.down="focusFirst"
          @keydown.enter.prevent="results[0] && pick(results[0])"
        /><button
          aria-label="Close search"
          @click="emit('update:modelValue', false)"
        >
          <X :size="18" />
        </button>
      </div>
      <div class="command-section-label">
        {{ query ? "SEARCH RESULTS" : "JUMP TO A PAGE"
        }}<span>{{ results.length }} results</span>
      </div>
      <div ref="resultsRef" class="command-results" @keydown="moveFocus">
        <button
          v-for="(item, i) in results"
          :key="item.project?.id || item.page"
          @click="pick(item)"
        >
          <span class="command-result-icon"
            ><component :is="item.icon" :size="18" /></span
          ><span
            ><strong>{{ item.label }}</strong
            ><small>{{ item.description }}</small></span
          ><em>{{ item.kind }}</em
          ><CornerDownLeft v-if="i === 0" :size="14" /><ArrowUpRight
            v-else
            :size="14"
          />
        </button>
        <div v-if="!results.length" class="command-empty">
          <Search :size="24" /><strong>No matches yet.</strong>
          <p>Try a page name, project, or client.</p>
        </div>
      </div>
      <div class="command-footer">
        <span><kbd>↑</kbd><kbd>↓</kbd> to navigate</span
        ><span><kbd>↵</kbd> to open</span><span><kbd>esc</kbd> to close</span
        ><Command :size="13" /></div></v-card
  ></v-dialog>
</template>
