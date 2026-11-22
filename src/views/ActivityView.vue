<script setup>
import { computed, ref } from "vue";
import { vAutoAnimate } from "@formkit/auto-animate/vue";
import {
  Activity,
  Plus,
  ArrowRight,
  CheckCheck,
  Filter,
} from "lucide-vue-next";
const props = defineProps({ entries: Array });
const filter = ref("All activity");
const filtered = computed(() =>
  props.entries.filter(
    (e) =>
      filter.value === "All activity" ||
      (filter.value === "Project creation"
        ? e.type === "project"
        : e.type === "status"),
  ),
);
const formatDate = (value) =>
  new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
</script>
<template>
  <div class="activity-page-layout">
    <section class="card activity-timeline-card">
      <div class="card-header">
        <div>
          <span class="panel-kicker">THE WORK, AS IT HAPPENS</span>
          <h2>A little progress, every day.</h2>
          <p>Project changes made in this browser appear here.</p>
        </div>
        <Activity :size="21" class="muted" />
      </div>
      <div class="activity-filter-row">
        <Filter :size="15" /><v-select
          v-model="filter"
          :items="['All activity', 'Project creation', 'Status changes']"
          label="Activity filter"
          hide-details
          density="compact"
        />
      </div>
      <div v-auto-animate="{ duration: 180 }" class="activity-timeline">
        <article
          v-for="entry in filtered"
          :key="entry.id"
          class="timeline-entry"
        >
          <span
            class="timeline-icon"
            :class="{ 'is-success': entry.to === 'Completed' }"
            ><CheckCheck v-if="entry.to === 'Completed'" :size="17" /><Plus
              v-else-if="entry.type === 'project'"
              :size="17" /><ArrowRight v-else :size="17"
          /></span>
          <div>
            <div class="timeline-meta">
              <span>{{ entry.sample ? "Sample activity" : "James Wilson" }}</span
              ><time :datetime="entry.date">{{ formatDate(entry.date) }}</time>
            </div>
            <h3>{{ entry.title }}</h3>
            <p>{{ entry.detail }}</p>
            <span class="timeline-project">{{ entry.project }}</span>
          </div>
        </article>
        <div v-if="!filtered.length" class="module-empty">
          <Activity :size="32" />
          <h3>A fresh start.</h3>
          <p>No updates match this filter yet.</p>
        </div>
      </div>
    </section>
    <aside class="card activity-aside">
      <span class="panel-kicker">WORKSPACE PULSE</span>
      <h2>
        {{ entries.filter((e) => !e.sample).length }}<small>your updates</small>
      </h2>
      <p>
        Create a project or move it on the board to see your workspace story
        grow.
      </p>
      <div class="activity-aside-note">
        <span class="live-dot"></span>Changes stay in this browser.
      </div>
    </aside>
  </div>
</template>
