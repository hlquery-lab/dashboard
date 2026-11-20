<script setup>
import { computed, ref } from "vue";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  ArrowUpRight,
} from "lucide-vue-next";
const props = defineProps({ projects: Array });
const emit = defineEmits(["create", "projects"]);
const today = new Date();
const anchor = ref(new Date(today.getFullYear(), today.getMonth(), 1));
const selected = ref(null);
const dateKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const monthLabel = computed(() =>
  anchor.value.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
);
const cells = computed(() => {
  const first = new Date(anchor.value);
  const offset = (first.getDay() + 6) % 7;
  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(
      first.getFullYear(),
      first.getMonth(),
      i - offset + 1,
    );
    const key = dateKey(date);
    return {
      key,
      day: date.getDate(),
      current: date.getMonth() === first.getMonth(),
      today: key === dateKey(today),
      projects: props.projects.filter((p) => p.date === key),
    };
  });
});
const agenda = computed(() =>
  props.projects
    .filter((p) =>
      selected.value
        ? p.date === selected.value
        : p.date?.startsWith(dateKey(anchor.value).slice(0, 7)),
    )
    .sort((a, b) => a.date.localeCompare(b.date)),
);
const selectedLabel = computed(() =>
  selected.value
    ? new Date(selected.value + "T12:00:00").toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "This month",
);
function move(delta) {
  anchor.value = new Date(
    anchor.value.getFullYear(),
    anchor.value.getMonth() + delta,
    1,
  );
  selected.value = null;
}
function reset() {
  anchor.value = new Date(today.getFullYear(), today.getMonth(), 1);
  selected.value = null;
}
</script>
<template>
  <section class="calendar-layout">
    <article class="card calendar-panel">
      <div class="card-header calendar-toolbar">
        <div>
          <span class="panel-kicker">PLAN AHEAD</span>
          <h2>{{ monthLabel }}</h2>
        </div>
        <div class="calendar-controls">
          <v-btn variant="outlined" size="small" @click="reset">Today</v-btn
          ><v-btn
            variant="text"
            size="small"
            icon
            aria-label="Previous month"
            @click="move(-1)"
            ><ChevronLeft :size="18" /></v-btn
          ><v-btn
            variant="text"
            size="small"
            icon
            aria-label="Next month"
            @click="move(1)"
            ><ChevronRight :size="18"
          /></v-btn>
        </div>
      </div>
      <div class="calendar-weekdays">
        <span
          v-for="day in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']"
          :key="day"
          >{{ day }}</span
        >
      </div>
      <div class="calendar-days">
        <button
          v-for="cell in cells"
          :key="cell.key"
          class="calendar-day"
          :class="{
            outside: !cell.current,
            today: cell.today,
            chosen: selected === cell.key,
          }"
          :aria-label="`${cell.key}, ${cell.projects.length} project deadlines`"
          :aria-pressed="selected === cell.key"
          @click="selected = selected === cell.key ? null : cell.key"
        >
          <span class="day-number">{{ cell.day }}</span>
          <span
            v-for="p in cell.projects.slice(0, 2)"
            :key="p.id"
            class="calendar-event"
            :class="p.color"
            >{{ p.name }}</span
          >
          <span v-if="cell.projects.length > 2" class="calendar-more"
            >+{{ cell.projects.length - 2 }} more</span
          >
        </button>
      </div>
    </article>
    <article class="card agenda-panel">
      <div class="card-header">
        <div>
          <span class="panel-kicker">ON YOUR RADAR</span>
          <h2>{{ selectedLabel }}</h2>
          <p>{{ agenda.length }} project deadlines</p>
        </div>
        <CalendarDays :size="21" class="muted" />
      </div>
      <div v-if="!agenda.length" class="module-empty">
        <CalendarDays :size="32" />
        <h3>A little breathing room.</h3>
        <p>
          No project deadlines {{ selected ? "on this day" : "this month" }}.
        </p>
        <v-btn color="primary" variant="tonal" @click="emit('create')"
          >Plan a project</v-btn
        >
      </div>
      <div v-for="project in agenda" :key="project.id" class="agenda-item">
        <span class="agenda-date"
          >{{
            new Date(project.date + "T12:00:00").toLocaleDateString("en-US", {
              month: "short",
            })
          }}<strong>{{ Number(project.date.slice(-2)) }}</strong></span
        >
        <div>
          <strong>{{ project.name }}</strong>
          <p>{{ project.client }}</p>
          <span
            class="badge"
            :class="project.status === 'Completed' ? 'green' : 'violet'"
            >{{ project.status }}</span
          >
        </div>
      </div>
      <div class="agenda-footer">
        <v-btn variant="text" color="primary" @click="emit('projects')"
          >View all projects <ArrowUpRight :size="16" class="ml-2"
        /></v-btn>
      </div>
    </article>
  </section>
</template>
